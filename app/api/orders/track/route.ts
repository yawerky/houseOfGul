import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Public order tracking. Requires the order number AND the phone or email
// used at checkout, so strangers can't look up other people's orders.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const orderNumber = (searchParams.get('orderNumber') || '').trim().toUpperCase()
  const contact = (searchParams.get('contact') || '').trim().toLowerCase()

  if (!orderNumber || !contact) {
    return NextResponse.json({ error: 'Enter your order number and the phone or email used at checkout.' }, { status: 400 })
  }

  try {
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: true,
        timeline: { orderBy: { createdAt: 'asc' } },
      },
    })

    const last10 = (value: string) => value.replace(/\D/g, '').slice(-10)
    const contactMatches =
      order &&
      (order.email.toLowerCase() === contact ||
        (last10(contact).length === 10 &&
          (last10(order.phone) === last10(contact) || last10(order.shippingPhone) === last10(contact))))

    if (!order || !contactMatches) {
      return NextResponse.json(
        { error: "We couldn't find an order with those details. Please check and try again." },
        { status: 404 }
      )
    }

    return NextResponse.json({
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      createdAt: order.createdAt,
      deliveryDate: order.deliveryDate,
      deliverySlot: order.deliverySlot,
      recipient: `${order.shippingFirstName} ${order.shippingLastName}`.trim(),
      area: `${order.shippingCity} ${order.shippingPincode}`.trim(),
      total: order.total,
      items: order.items.map((i) => ({ name: i.name, quantity: i.quantity, image: i.image })),
      timeline: order.timeline.map((t) => ({ status: t.status, message: t.message, createdAt: t.createdAt })),
    })
  } catch (error) {
    console.error('Error tracking order:', error)
    return NextResponse.json({ error: 'Could not look up your order. Please try again.' }, { status: 500 })
  }
}
