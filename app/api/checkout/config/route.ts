import { NextResponse } from 'next/server'
import { getSettings, deliverySlots, slotCharge, toAmount, razorpayEnabled } from '@/lib/settings'
import { todayInIndia } from '@/lib/checkout'

export async function GET() {
  const settings = await getSettings()
  return NextResponse.json({
    freeDeliveryThreshold: toAmount(settings.freeDeliveryThreshold),
    minimumOrderAmount: toAmount(settings.minimumOrderAmount),
    whatsappNumber: settings.whatsappNumber,
    storePhone: settings.storePhone,
    today: todayInIndia(),
    slots: deliverySlots.map((s) => ({ ...s, charge: slotCharge(s.id, settings) })),
    razorpay: razorpayEnabled() ? { keyId: process.env.RAZORPAY_KEY_ID } : null,
  })
}
