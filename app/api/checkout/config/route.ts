import { NextResponse } from 'next/server'
import { getSettings, toAmount, razorpayEnabled } from '@/lib/settings'
import { todayInIndia } from '@/lib/checkout'
import { deliverySlots, earliestDelivery } from '@/lib/deliveryWindows'

export const dynamic = 'force-dynamic'

export async function GET() {
  const settings = await getSettings()
  return NextResponse.json({
    freeDeliveryThreshold: toAmount(settings.freeDeliveryThreshold),
    minimumOrderAmount: toAmount(settings.minimumOrderAmount),
    whatsappNumber: settings.whatsappNumber,
    storePhone: settings.storePhone,
    today: todayInIndia(),
    earliest: earliestDelivery(),
    slots: deliverySlots.map((s) => ({ id: s.id, label: s.label, charge: 0 })),
    razorpay: razorpayEnabled() ? { keyId: process.env.RAZORPAY_KEY_ID } : null,
  })
}
