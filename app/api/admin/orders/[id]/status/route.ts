import { NextRequest, NextResponse, after } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'
import { sendStatusEmail } from '@/lib/notify'

const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'out-for-delivery', 'delivered', 'cancelled']
const validPaymentStatuses = ['pending', 'paid', 'failed', 'refunded']

const statusMessages: Record<string, string> = {
  pending: 'Order received.',
  confirmed: 'Order confirmed.',
  processing: 'Your flowers are being hand-arranged.',
  shipped: 'Your order has left our studio.',
  'out-for-delivery': 'Out for delivery.',
  delivered: 'Delivered. Thank you for choosing House of Gul!',
  cancelled: 'Order cancelled.',
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const { status, paymentStatus, message } = await request.json()

    if (status !== undefined && !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }
    if (paymentStatus !== undefined && !validPaymentStatuses.includes(paymentStatus)) {
      return NextResponse.json({ error: 'Invalid payment status' }, { status: 400 })
    }

    const current = await prisma.order.findUnique({ where: { id } })
    if (!current) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const statusChanged = status !== undefined && status !== current.status
    const note = typeof message === 'string' ? message.trim().slice(0, 300) : ''

    const order = await prisma.order.update({
      where: { id },
      data: {
        ...(status !== undefined ? { status } : {}),
        ...(paymentStatus !== undefined ? { paymentStatus } : {}),
        ...(statusChanged
          ? { timeline: { create: { status, message: note || statusMessages[status] } } }
          : {}),
      },
    })

    if (statusChanged) {
      after(() => sendStatusEmail(id, status, note))
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('Error updating order status:', error)
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 })
  }
}
