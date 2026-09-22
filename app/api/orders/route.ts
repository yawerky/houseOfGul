import { NextRequest, NextResponse, after } from 'next/server'
import { prisma } from '@/lib/prisma'
import { buildQuote, generateOrderNumber, normalizePincode, todayInIndia } from '@/lib/checkout'
import { deliverySlots, razorpayEnabled } from '@/lib/settings'
import { createRazorpayOrder } from '@/lib/razorpay'
import { sendNewOrderEmails } from '@/lib/notify'

const clean = (value: unknown, max = 300) =>
  typeof value === 'string' ? value.trim().slice(0, max) : ''

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const firstName = clean(body.firstName, 80)
  const lastName = clean(body.lastName, 80)
  const email = clean(body.email, 200).toLowerCase()
  const phone = clean(body.phone, 20)
  const address = clean(body.address, 300)
  const apartment = clean(body.apartment, 200)
  const city = clean(body.city, 80) || 'Jaipur'
  const state = clean(body.state, 80) || 'Rajasthan'
  const pincode = normalizePincode(clean(body.pincode, 10))
  const deliveryDate = clean(body.deliveryDate, 10)
  const deliverySlot = clean(body.deliverySlot, 20)
  const customerNote = clean(body.customerNote, 500)
  const isGift = body.isGift === true
  const giftMessage = isGift ? clean(body.giftMessage, 200) : ''
  const senderName = isGift ? clean(body.senderName, 80) : ''
  const hidePrice = isGift && body.hidePrice === true
  const couponCode = clean(body.couponCode, 40)
  const paymentMethod = body.paymentMethod === 'razorpay' ? 'razorpay' : 'cod'
  const items = Array.isArray(body.items) ? body.items : []

  // Validation
  const phoneDigits = phone.replace(/\D/g, '')
  if (!firstName || !lastName) return bad('Please enter your first and last name.')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return bad('Please enter a valid email address.')
  if (phoneDigits.length < 10) return bad('Please enter a valid 10-digit phone number.')
  if (!address) return bad('Please enter the delivery address.')
  if (pincode.length !== 6) return bad('Please enter a valid 6-digit pincode.')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(deliveryDate) || deliveryDate < todayInIndia()) {
    return bad('Please choose a delivery date from today onwards.')
  }
  if (!deliverySlots.some((s) => s.id === deliverySlot)) return bad('Please choose a delivery time slot.')
  if (items.length === 0) return bad('Your cart is empty.')
  if (paymentMethod === 'razorpay' && !razorpayEnabled()) {
    return bad('Online payment is not available right now. Please choose pay on delivery.')
  }

  try {
    const quote = await buildQuote({
      items: items as { slug: string; quantity: number }[],
      pincode,
      deliverySlot,
      couponCode,
    })

    if (quote.missingItems.length > 0 || quote.lines.length === 0) {
      return bad('Some items in your cart are no longer available. Please remove them and try again.')
    }
    if (!quote.pincode.serviceable) return bad(quote.pincode.message)
    if (quote.coupon && !quote.coupon.valid) return bad(quote.coupon.message)
    if (quote.subtotal < quote.minimumOrderAmount) {
      return bad(`The minimum order amount is ₹${quote.minimumOrderAmount.toLocaleString('en-IN')}.`)
    }

    const slotLabel = deliverySlots.find((s) => s.id === deliverySlot)!.label

    let order = null
    for (let attempt = 0; attempt < 5 && !order; attempt++) {
      const orderNumber = generateOrderNumber(quote.settings.orderPrefix)
      try {
        order = await prisma.$transaction(async (tx) => {
          const created = await tx.order.create({
            data: {
              orderNumber,
              email,
              phone,
              shippingFirstName: firstName,
              shippingLastName: lastName,
              shippingAddress: address,
              shippingApartment: apartment || null,
              shippingCity: city,
              shippingState: state,
              shippingPincode: pincode,
              shippingPhone: phone,
              subtotal: quote.subtotal,
              deliveryCharge: quote.deliveryCharge + quote.slotCharge,
              giftWrapCharge: 0,
              discount: quote.discount,
              total: quote.total,
              isGift,
              giftWrapType: isGift ? 'Gift message card' : null,
              giftMessage: giftMessage || null,
              senderName: senderName || null,
              hidePrice,
              deliveryDate: new Date(`${deliveryDate}T00:00:00+05:30`),
              deliverySlot: slotLabel,
              deliveryZone: quote.pincode.deliveryZone,
              status: 'pending',
              paymentStatus: 'pending',
              paymentMethod,
              customerNote: [quote.coupon?.valid ? `Coupon: ${quote.coupon.code}` : '', customerNote]
                .filter(Boolean)
                .join('\n') || null,
              items: {
                create: quote.lines.map((l) => ({
                  productId: l.productId,
                  name: l.name,
                  price: l.price,
                  quantity: l.quantity,
                  image: l.image,
                })),
              },
              timeline: {
                create: {
                  status: 'pending',
                  message:
                    paymentMethod === 'razorpay'
                      ? 'Order placed — waiting for online payment.'
                      : 'Order placed — pay on delivery.',
                },
              },
            },
          })
          if (quote.coupon?.valid && quote.coupon.couponId) {
            await tx.coupon.update({
              where: { id: quote.coupon.couponId },
              data: { usedCount: { increment: 1 } },
            })
          }
          return created
        })
      } catch (error) {
        // Retry only on a duplicate order number.
        if ((error as { code?: string }).code !== 'P2002') throw error
      }
    }

    if (!order) throw new Error('Could not generate a unique order number')

    let razorpay = null
    if (paymentMethod === 'cod') {
      const placedId = order.id
      after(() => sendNewOrderEmails(placedId))
    }
    if (paymentMethod === 'razorpay') {
      const rzp = await createRazorpayOrder(order.total, order.orderNumber)
      razorpay = {
        keyId: process.env.RAZORPAY_KEY_ID,
        razorpayOrderId: rzp.id,
        amount: rzp.amount,
        currency: rzp.currency,
      }
    }

    return NextResponse.json(
      {
        orderId: order.id,
        orderNumber: order.orderNumber,
        total: order.total,
        paymentMethod,
        razorpay,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'We could not place your order. Please try again or call us.' },
      { status: 500 }
    )
  }
}

function bad(message: string) {
  return NextResponse.json({ error: message }, { status: 400 })
}
