import { NextRequest, NextResponse, after } from 'next/server'
import { prisma } from '@/lib/prisma'
import { fetchRazorpayOrder, verifyPaymentSignature } from '@/lib/razorpay'
import { razorpayEnabled } from '@/lib/settings'
import { sendNewOrderEmails } from '@/lib/notify'

// Called by the checkout page after Razorpay reports a successful payment.
export async function POST(request: NextRequest) {
  if (!razorpayEnabled()) {
    return NextResponse.json({ error: 'Online payment is not configured.' }, { status: 400 })
  }

  try {
    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json()

    if (!orderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing payment details.' }, { status: 400 })
    }

    if (!verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
      return NextResponse.json({ error: 'Payment could not be verified.' }, { status: 400 })
    }

    const order = await prisma.order.findUnique({ where: { id: String(orderId) } })
    if (!order) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 })
    }

    // Make sure this Razorpay order really belongs to this order and amount.
    const rzp = await fetchRazorpayOrder(razorpay_order_id)
    if (rzp.receipt !== order.orderNumber || rzp.amount !== Math.round(order.total * 100)) {
      return NextResponse.json({ error: 'Payment does not match this order.' }, { status: 400 })
    }

    if (order.paymentStatus !== 'paid') {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: 'paid',
          paymentMethod: 'razorpay',
          status: order.status === 'pending' ? 'confirmed' : order.status,
          adminNote: [order.adminNote, `Razorpay payment ${razorpay_payment_id}`].filter(Boolean).join('\n'),
          timeline: {
            create: { status: 'confirmed', message: 'Payment received — order confirmed.' },
          },
        },
      })
      after(() => sendNewOrderEmails(order.id))
    }

    return NextResponse.json({ success: true, orderNumber: order.orderNumber })
  } catch (error) {
    console.error('Error verifying payment:', error)
    return NextResponse.json({ error: 'Could not verify payment. Please contact us.' }, { status: 500 })
  }
}
