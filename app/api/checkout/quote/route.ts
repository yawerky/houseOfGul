import { NextRequest, NextResponse } from 'next/server'
import { buildQuote, publicQuote } from '@/lib/checkout'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const quote = await buildQuote({
      items: Array.isArray(body.items) ? body.items : [],
      pincode: body.pincode,
      deliverySlot: body.deliverySlot,
      couponCode: body.couponCode,
    })
    return NextResponse.json(publicQuote(quote))
  } catch (error) {
    console.error('Error building checkout quote:', error)
    return NextResponse.json({ error: 'Could not calculate your order total. Please try again.' }, { status: 500 })
  }
}
