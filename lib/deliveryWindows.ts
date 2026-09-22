// Delivery windows (all times in India / Jaipur time):
//   Orders placed 6:00 AM – 2:00 PM  → delivered the same day by 6:00 PM
//   Orders placed 2:00 PM – 6:00 AM  → delivered by 12:00 PM (noon)
//     (the next day if ordered before midnight, the same day if after midnight)
// Customers may also choose any later date, with either slot.
// Used by both the browser (checkout, product page) and the server (order checks).

export const deliverySlots = [
  { id: 'by-12pm', label: 'By 12:00 PM (noon)', shortLabel: 'by 12 PM' },
  { id: 'by-6pm', label: 'By 6:00 PM', shortLabel: 'by 6 PM' },
] as const

export type DeliverySlotId = (typeof deliverySlots)[number]['id']

const slotRank: Record<string, number> = { 'by-12pm': 0, 'by-6pm': 1 }

export const SAME_DAY_CUTOFF_HOUR = 14 // 2 PM
export const MORNING_OPEN_HOUR = 6 // 6 AM

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000

// Current date/time parts in India.
export function indiaNow(now = new Date()) {
  const ist = new Date(now.getTime() + IST_OFFSET_MS)
  return {
    date: ist.toISOString().slice(0, 10),
    hour: ist.getUTCHours(),
    minute: ist.getUTCMinutes(),
  }
}

export function addDays(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

// The soonest delivery for an order placed now.
export function earliestDelivery(now = new Date()): { date: string; slot: DeliverySlotId } {
  const { date, hour } = indiaNow(now)
  if (hour < MORNING_OPEN_HOUR) return { date, slot: 'by-12pm' }
  if (hour < SAME_DAY_CUTOFF_HOUR) return { date, slot: 'by-6pm' }
  return { date: addDays(date, 1), slot: 'by-12pm' }
}

export function isValidSlot(slot: string): slot is DeliverySlotId {
  return slot in slotRank
}

// Can an order placed now be delivered on this date in this slot?
export function isDeliveryAllowed(date: string, slot: string, now = new Date()): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !isValidSlot(slot)) return false
  const earliest = earliestDelivery(now)
  if (date > earliest.date) return true
  if (date < earliest.date) return false
  return slotRank[slot] >= slotRank[earliest.slot]
}

export function slotLabel(slot: string): string {
  return deliverySlots.find((s) => s.id === slot)?.label || slot
}

// "today", "tomorrow" or e.g. "Fri, 26 Sep"
export function friendlyDate(date: string, now = new Date()): string {
  const today = indiaNow(now).date
  if (date === today) return 'today'
  if (date === addDays(today, 1)) return 'tomorrow'
  return new Date(`${date}T00:00:00Z`).toLocaleDateString('en-IN', {
    timeZone: 'UTC',
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

// e.g. "Order in the next 2h 15m for delivery today by 6 PM"
export function nextDeliveryMessage(now = new Date()): string {
  const { hour, minute } = indiaNow(now)
  const earliest = earliestDelivery(now)
  const when = `${friendlyDate(earliest.date, now)} ${deliverySlots.find((s) => s.id === earliest.slot)!.shortLabel}`
  const cutoffHour =
    hour < MORNING_OPEN_HOUR ? MORNING_OPEN_HOUR : hour < SAME_DAY_CUTOFF_HOUR ? SAME_DAY_CUTOFF_HOUR : 24 + MORNING_OPEN_HOUR
  const minsLeft = cutoffHour * 60 - (hour * 60 + minute)
  const h = Math.floor(minsLeft / 60)
  const m = minsLeft % 60
  const left = h > 0 ? `${h}h ${m}m` : `${m}m`
  return `Order in the next ${left} for delivery ${when}`
}

export const deliveryPolicyText =
  'Order between 6 AM and 2 PM for delivery the same day by 6 PM. Orders after 2 PM are delivered by 12 PM (noon).'
