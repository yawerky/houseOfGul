import { prisma } from '@/lib/prisma'
import { getSettings, slotCharge, toAmount, deliverySlots, type StoreSettings } from '@/lib/settings'

// Server-side pricing for checkout. Prices always come from the database,
// never from the browser, so a customer cannot change what they pay.

export interface QuoteItemInput {
  slug: string
  quantity: number
}

export interface QuoteInput {
  items: QuoteItemInput[]
  pincode?: string
  deliverySlot?: string
  couponCode?: string
}

export interface QuoteLine {
  productId: string
  slug: string
  name: string
  price: number
  quantity: number
  image: string | null
}

export interface PincodeResult {
  checked: boolean
  serviceable: boolean
  message: string
  area: string | null
  deliveryZone: string | null
}

export interface CouponResult {
  code: string
  valid: boolean
  message: string
  couponId: string | null
}

export interface Quote {
  lines: QuoteLine[]
  missingItems: string[]
  subtotal: number
  deliveryCharge: number
  slotCharge: number
  discount: number
  total: number
  freeDeliveryThreshold: number
  minimumOrderAmount: number
  pincode: PincodeResult
  coupon: CouponResult | null
  settings: StoreSettings
}

const roundRupees = (n: number) => Math.round(n)

export function normalizePincode(value: string | undefined): string {
  return (value || '').replace(/\D/g, '').slice(0, 6)
}

export async function buildQuote(input: QuoteInput): Promise<Quote> {
  const settings = await getSettings()

  // Products
  const wanted = new Map<string, number>()
  for (const item of input.items || []) {
    const qty = Math.max(1, Math.min(20, Math.floor(Number(item.quantity) || 0)))
    if (item.slug) wanted.set(item.slug, (wanted.get(item.slug) || 0) + qty)
  }

  const products = await prisma.product.findMany({
    where: { slug: { in: Array.from(wanted.keys()) }, inStock: true },
  })

  const lines: QuoteLine[] = products.map((p) => {
    let image: string | null = null
    try {
      image = (JSON.parse(p.images || '[]') as string[])[0] || null
    } catch {
      image = null
    }
    return {
      productId: p.id,
      slug: p.slug,
      name: p.name,
      price: p.price,
      quantity: wanted.get(p.slug) || 1,
      image,
    }
  })
  const found = new Set(products.map((p) => p.slug))
  const missingItems = Array.from(wanted.keys()).filter((slug) => !found.has(slug))

  const subtotal = roundRupees(lines.reduce((sum, l) => sum + l.price * l.quantity, 0))

  // Pincode and delivery charge
  const code = normalizePincode(input.pincode)
  let pincode: PincodeResult = {
    checked: false,
    serviceable: false,
    message: 'Enter your 6-digit pincode to check delivery.',
    area: null,
    deliveryZone: null,
  }
  let baseDelivery = toAmount(settings.defaultDeliveryCharge)
  let freeThreshold = toAmount(settings.freeDeliveryThreshold)

  if (code.length === 6) {
    const activeCount = await prisma.pincode.count({ where: { isActive: true } })
    if (activeCount === 0) {
      // No delivery areas set up in admin yet: accept every pincode.
      pincode = { checked: true, serviceable: true, message: 'We deliver here.', area: null, deliveryZone: null }
    } else {
      const match = await prisma.pincode.findFirst({ where: { code, isActive: true } })
      if (!match || match.deliveryZone === 'not-serviceable') {
        pincode = {
          checked: true,
          serviceable: false,
          message: `Sorry, we don't deliver to ${code} yet. Please try another pincode or call us.`,
          area: null,
          deliveryZone: null,
        }
      } else {
        const zoneLabel =
          match.deliveryZone === 'same-day'
            ? 'Same-day delivery available.'
            : match.deliveryZone === 'next-day'
            ? 'Next-day delivery.'
            : 'Delivery in 2–3 days.'
        pincode = {
          checked: true,
          serviceable: true,
          message: `${match.area} — ${zoneLabel}`,
          area: match.area,
          deliveryZone: match.deliveryZone,
        }
        baseDelivery = match.deliveryCharge
        if (match.minOrderFree !== null && match.minOrderFree !== undefined) {
          freeThreshold = match.minOrderFree
        }
      }
    }
  } else if (code.length > 0) {
    pincode = { ...pincode, checked: true, message: 'Please enter a valid 6-digit pincode.' }
  }

  const deliveryCharge =
    subtotal > 0 && freeThreshold > 0 && subtotal >= freeThreshold ? 0 : roundRupees(baseDelivery)

  const slotId = deliverySlots.some((s) => s.id === input.deliverySlot) ? input.deliverySlot! : 'morning'
  const slotFee = roundRupees(slotCharge(slotId, settings))

  // Coupon
  let coupon: CouponResult | null = null
  let discount = 0
  const couponCode = (input.couponCode || '').trim().toUpperCase()
  if (couponCode) {
    const found = await prisma.coupon.findUnique({ where: { code: couponCode } })
    const now = new Date()
    const invalid = (message: string): CouponResult => ({ code: couponCode, valid: false, message, couponId: null })

    if (!found || !found.isActive) {
      coupon = invalid('This coupon code is not valid.')
    } else if (found.startDate && found.startDate > now) {
      coupon = invalid('This coupon is not active yet.')
    } else if (found.endDate && found.endDate < now) {
      coupon = invalid('This coupon has expired.')
    } else if (found.usageLimit !== null && found.usedCount >= found.usageLimit) {
      coupon = invalid('This coupon has reached its usage limit.')
    } else if (found.minOrderAmount && subtotal < found.minOrderAmount) {
      coupon = invalid(`Add items worth ₹${Math.ceil(found.minOrderAmount - subtotal)} more to use this coupon.`)
    } else {
      discount =
        found.discountType === 'percentage'
          ? (subtotal * found.discountValue) / 100
          : found.discountValue
      if (found.maxDiscount) discount = Math.min(discount, found.maxDiscount)
      discount = roundRupees(Math.min(discount, subtotal))
      coupon = {
        code: couponCode,
        valid: true,
        message: `Coupon applied — you save ₹${discount.toLocaleString('en-IN')}.`,
        couponId: found.id,
      }
    }
  }

  const total = Math.max(0, subtotal + deliveryCharge + slotFee - discount)

  return {
    lines,
    missingItems,
    subtotal,
    deliveryCharge,
    slotCharge: slotFee,
    discount,
    total,
    freeDeliveryThreshold: freeThreshold,
    minimumOrderAmount: toAmount(settings.minimumOrderAmount),
    pincode,
    coupon,
    settings,
  }
}

// Shape sent to the browser (no internal ids or settings).
export function publicQuote(quote: Quote) {
  return {
    items: quote.lines.map(({ slug, name, price, quantity, image }) => ({ slug, name, price, quantity, image })),
    missingItems: quote.missingItems,
    subtotal: quote.subtotal,
    deliveryCharge: quote.deliveryCharge,
    slotCharge: quote.slotCharge,
    discount: quote.discount,
    total: quote.total,
    freeDeliveryThreshold: quote.freeDeliveryThreshold,
    minimumOrderAmount: quote.minimumOrderAmount,
    pincode: quote.pincode,
    coupon: quote.coupon ? { code: quote.coupon.code, valid: quote.coupon.valid, message: quote.coupon.message } : null,
  }
}

export function generateOrderNumber(prefix: string): string {
  const now = new Date()
  const ist = new Date(now.getTime() + 5.5 * 60 * 60 * 1000)
  const date = ist.toISOString().slice(2, 10).replace(/-/g, '')
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
  const clean = (prefix || 'HOG').replace(/[^A-Za-z0-9]/g, '').toUpperCase() || 'HOG'
  return `${clean}-${date}-${rand}`
}

// Today's date in India as YYYY-MM-DD.
export function todayInIndia(): string {
  const ist = new Date(Date.now() + 5.5 * 60 * 60 * 1000)
  return ist.toISOString().slice(0, 10)
}
