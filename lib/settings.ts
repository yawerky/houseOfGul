import { prisma } from '@/lib/prisma'

// Store settings live in the Setting table as key/value strings.
// Anything not saved yet falls back to these defaults.
export const settingDefaults = {
  storeName: 'House of Gul',
  storeEmail: 'contact@houseofgul.com',
  storePhone: '+91-9461900344',
  whatsappNumber: '919461900344',
  orderPrefix: 'HOG',
  minimumOrderAmount: '0',
  freeDeliveryThreshold: '999',
  defaultDeliveryCharge: '99',
  specificSlotCharge: '199',
  midnightSlotCharge: '299',
}

export type StoreSettings = typeof settingDefaults
export type SettingKey = keyof StoreSettings

export const settingKeys = Object.keys(settingDefaults) as SettingKey[]

export async function getSettings(): Promise<StoreSettings> {
  const settings = { ...settingDefaults }
  try {
    const rows = await prisma.setting.findMany({ where: { key: { in: settingKeys } } })
    for (const row of rows) {
      settings[row.key as SettingKey] = row.value
    }
  } catch (error) {
    console.error('Error loading settings:', error)
  }
  return settings
}

export function toAmount(value: string): number {
  const n = parseFloat(value)
  return Number.isFinite(n) && n >= 0 ? n : 0
}

export const deliverySlots = [
  { id: 'morning', label: 'Morning (9am – 12pm)' },
  { id: 'afternoon', label: 'Afternoon (12pm – 5pm)' },
  { id: 'evening', label: 'Evening (5pm – 9pm)' },
  { id: 'specific', label: 'Specific Hour' },
  { id: 'midnight', label: 'Midnight (11pm – 12am)' },
] as const

export type DeliverySlotId = (typeof deliverySlots)[number]['id']

export function slotCharge(slotId: string, settings: StoreSettings): number {
  if (slotId === 'specific') return toAmount(settings.specificSlotCharge)
  if (slotId === 'midnight') return toAmount(settings.midnightSlotCharge)
  return 0
}

export function razorpayEnabled(): boolean {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET)
}
