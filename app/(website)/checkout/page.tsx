'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils'
import LuxuryButton from '@/components/ui/LuxuryButton'
import { deliveryPolicyText, friendlyDate, isDeliveryAllowed, slotLabel } from '@/lib/deliveryWindows'

interface CheckoutConfig {
  freeDeliveryThreshold: number
  minimumOrderAmount: number
  whatsappNumber: string
  storePhone: string
  today: string
  slots: { id: string; label: string; charge: number }[]
  earliest: { date: string; slot: string }
  razorpay: { keyId: string } | null
}

interface QuoteResponse {
  subtotal: number
  deliveryCharge: number
  slotCharge: number
  discount: number
  total: number
  freeDeliveryThreshold: number
  minimumOrderAmount: number
  missingItems: string[]
  pincode: { checked: boolean; serviceable: boolean; message: string; area: string | null }
  coupon: { code: string; valid: boolean; message: string } | null
}

interface PlacedOrder {
  orderId: string
  orderNumber: string
  total: number
  paymentMethod: 'cod' | 'razorpay'
  razorpay: { keyId: string; razorpayOrderId: string; amount: number; currency: string } | null
}

type RazorpayResponse = {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void }
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true)
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

const labelClass = 'block text-xs tracking-widest uppercase text-charcoal-light mb-2 dark:text-ivory/70'

export default function CheckoutPage() {
  const { state, totalPrice, clearCart } = useCart()
  const [step, setStep] = useState(1)
  const [config, setConfig] = useState<CheckoutConfig | null>(null)
  const [quote, setQuote] = useState<QuoteResponse | null>(null)
  const [quoteLoading, setQuoteLoading] = useState(false)
  const [error, setError] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [placedOrder, setPlacedOrder] = useState<PlacedOrder | null>(null)
  const [orderComplete, setOrderComplete] = useState<{ orderNumber: string; paid: boolean } | null>(null)
  const [paymentPending, setPaymentPending] = useState(false)
  const [couponInput, setCouponInput] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('cod')

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: 'Jaipur',
    pincode: '',
    phone: '',
    deliveryDate: '',
    deliverySlot: '',
    instructions: '',
    giftMessage: '',
    senderName: '',
    isGift: false,
    hidePrice: false,
  })

  useEffect(() => {
    fetch('/api/checkout/config')
      .then((res) => res.json())
      .then((data: CheckoutConfig) => {
        setConfig(data)
        if (data.razorpay) setPaymentMethod('razorpay')
        // Pre-select the next available delivery
        setFormData((prev) => ({
          ...prev,
          deliveryDate: prev.deliveryDate || data.earliest.date,
          deliverySlot: prev.deliverySlot || data.earliest.slot,
        }))
      })
      .catch(() => setError('Could not load checkout. Please refresh the page.'))
  }, [])

  const cartItems = useMemo(
    () => state.items.map((item) => ({ slug: item.product.id, quantity: item.quantity })),
    [state.items]
  )
  const cartKey = JSON.stringify(cartItems)
  const pincodeReady = formData.pincode.replace(/\D/g, '').length === 6

  // Server-side price calculation: delivery charge, slot charge, coupon.
  const quoteRequest = useRef(0)
  useEffect(() => {
    if (cartItems.length === 0) return
    const id = ++quoteRequest.current
    setQuoteLoading(true)
    const timer = setTimeout(async () => {
      try {
        const res = await fetch('/api/checkout/quote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: cartItems,
            pincode: pincodeReady ? formData.pincode : '',
            deliverySlot: formData.deliverySlot,
            couponCode: appliedCoupon,
          }),
        })
        const data = await res.json()
        if (id === quoteRequest.current && res.ok) setQuote(data)
      } catch {
        // keep the previous quote
      } finally {
        if (id === quoteRequest.current) setQuoteLoading(false)
      }
    }, 300)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartKey, formData.pincode, pincodeReady, formData.deliverySlot, appliedCoupon])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const validateStep1 = (): string => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) return "Please enter the recipient's first and last name."
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) return 'Please enter a valid email address.'
    if (formData.phone.replace(/\D/g, '').length < 10) return 'Please enter a valid 10-digit phone number.'
    if (!formData.address.trim()) return 'Please enter the delivery address.'
    if (!pincodeReady) return 'Please enter a valid 6-digit pincode.'
    if (quote && quote.pincode.checked && !quote.pincode.serviceable) return quote.pincode.message
    return ''
  }

  const validateStep2 = (): string => {
    if (!formData.deliveryDate) return 'Please choose a delivery date.'
    if (config && formData.deliveryDate < config.today) return 'Please choose a delivery date from today onwards.'
    if (!isDeliveryAllowed(formData.deliveryDate, formData.deliverySlot)) {
      return 'That delivery time is no longer available. Please choose a later time or date.'
    }
    return ''
  }

  const goToStep = (next: number) => {
    const message = next >= 2 ? validateStep1() : ''
    const message2 = !message && next >= 3 ? validateStep2() : ''
    if (message || message2) {
      setError(message || message2)
      return
    }
    setError('')
    setStep(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openRazorpay = async (order: PlacedOrder) => {
    if (!order.razorpay) return
    const loaded = await loadRazorpayScript()
    if (!loaded || !window.Razorpay) {
      setPaymentPending(true)
      setError('Could not open the payment window. Check your connection and try again.')
      return
    }

    const rzp = new window.Razorpay({
      key: order.razorpay.keyId,
      amount: order.razorpay.amount,
      currency: order.razorpay.currency,
      order_id: order.razorpay.razorpayOrderId,
      name: 'House of Gul',
      description: `Order ${order.orderNumber}`,
      prefill: {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        contact: formData.phone,
      },
      theme: { color: '#C4A35A' },
      handler: async (response: RazorpayResponse) => {
        setIsProcessing(true)
        try {
          const res = await fetch('/api/orders/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId: order.orderId, ...response }),
          })
          const data = await res.json()
          if (!res.ok) throw new Error(data.error)
          clearCart()
          setOrderComplete({ orderNumber: order.orderNumber, paid: true })
        } catch (err) {
          setPaymentPending(true)
          setError(
            `${(err as Error).message || 'We could not confirm your payment.'} Your order number is ${order.orderNumber} — please contact us and we'll sort it out.`
          )
        } finally {
          setIsProcessing(false)
        }
      },
      modal: {
        ondismiss: () => {
          setPaymentPending(true)
          setError(`Payment was not completed. Your order ${order.orderNumber} is saved — tap "Pay now" to try again.`)
        },
      },
    })
    rzp.open()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (step !== 3) return

    const message = validateStep1() || validateStep2()
    if (message) {
      setError(message)
      return
    }

    if (placedOrder && paymentPending) {
      setError('')
      await openRazorpay(placedOrder)
      return
    }

    setIsProcessing(true)
    setError('')

    const notes = formData.instructions

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          apartment: formData.apartment,
          city: formData.city,
          pincode: formData.pincode,
          deliveryDate: formData.deliveryDate,
          deliverySlot: formData.deliverySlot,
          customerNote: notes,
          isGift: formData.isGift,
          giftMessage: formData.giftMessage,
          senderName: formData.senderName,
          hidePrice: formData.hidePrice,
          couponCode: appliedCoupon,
          paymentMethod,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'We could not place your order.')

      const order = data as PlacedOrder
      setPlacedOrder(order)

      if (order.paymentMethod === 'razorpay') {
        await openRazorpay(order)
      } else {
        clearCart()
        setOrderComplete({ orderNumber: order.orderNumber, paid: false })
      }
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setIsProcessing(false)
    }
  }

  if (state.items.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen pt-32 pb-16 bg-ivory">
        <div className="luxury-container">
          <div className="max-w-md mx-auto text-center">
            <h1 className="font-serif text-3xl text-charcoal mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-charcoal-light mb-8">
              Add some beautiful bouquets to your cart before checking out.
            </p>
            <Link href="/shop">
              <LuxuryButton variant="primary">Browse Collection</LuxuryButton>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen pt-32 pb-16 bg-ivory">
        <div className="luxury-container">
          <div className="max-w-lg mx-auto text-center">
            <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-gold/10 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-gold"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl text-charcoal mb-4">
              Thank You for Your Order
            </h1>
            <p className="text-charcoal-light mb-2">
              {orderComplete.paid
                ? 'Your payment was received and your order is confirmed.'
                : 'Your order has been placed. You can pay by cash or UPI when it is delivered. We will call you to confirm.'}
            </p>
            <p className="text-sm text-gold mb-8">Order #{orderComplete.orderNumber}</p>
            <div className="bg-white p-8 rounded-sm shadow-sm mb-8 dark:bg-dark-surface">
              <p className="text-charcoal-light text-sm mb-4">
                Save your order number. You can track your order with it and the phone number{' '}
                <span className="text-charcoal dark:text-ivory">{formData.phone}</span>.
              </p>
              <div className="border-t border-blush-dark/20 pt-4">
                <p className="text-xs tracking-widest uppercase text-charcoal-light">
                  Delivery
                </p>
                <p className="font-serif text-lg text-charcoal mt-1 dark:text-ivory">
                  {formData.deliveryDate
                    ? new Date(`${formData.deliveryDate}T00:00:00`).toLocaleDateString('en-IN', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                      })
                    : ''}
                  {' · '}
                  {slotLabel(formData.deliverySlot)}
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/track-order?order=${encodeURIComponent(orderComplete.orderNumber)}`}>
                <LuxuryButton variant="primary">Track Order</LuxuryButton>
              </Link>
              <Link href="/shop">
                <LuxuryButton variant="secondary">Continue Shopping</LuxuryButton>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const subtotal = quote?.subtotal ?? totalPrice
  const deliveryCharge = quote?.deliveryCharge ?? 0
  const slotFee = quote?.slotCharge ?? 0
  const discount = quote?.discount ?? 0
  const total = quote?.total ?? totalPrice
  const freeThreshold = quote?.freeDeliveryThreshold ?? config?.freeDeliveryThreshold ?? 0

  return (
    <div className="min-h-screen pt-28 pb-16 bg-ivory">
      <div className="luxury-container">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="luxury-subheading mb-4">Secure Checkout</p>
          <h1 className="font-serif text-3xl md:text-4xl text-charcoal mb-4">
            Complete Your Order
          </h1>
          <div className="luxury-divider" />
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-4">
            {['Recipient', 'Delivery', 'Payment'].map((s, i) => (
              <div key={s} className="flex items-center gap-4">
                <div
                  className={`flex items-center gap-2 ${
                    step > i + 1
                      ? 'text-gold'
                      : step === i + 1
                      ? 'text-charcoal'
                      : 'text-charcoal-light/50'
                  }`}
                >
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                      step > i + 1
                        ? 'bg-gold text-white'
                        : step === i + 1
                        ? 'bg-charcoal text-white'
                        : 'bg-blush-dark/20 text-charcoal-light'
                    }`}
                  >
                    {step > i + 1 ? '✓' : i + 1}
                  </span>
                  <span className="text-sm tracking-widest uppercase hidden sm:inline">
                    {s}
                  </span>
                </div>
                {i < 2 && (
                  <div
                    className={`w-8 sm:w-16 h-px ${
                      step > i + 1 ? 'bg-gold' : 'bg-blush-dark/20'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form */}
          <div className="lg:col-span-2">
            {error && (
              <div role="alert" className="mb-6 p-4 border border-red-200 bg-red-50 text-red-700 text-sm rounded-sm">
                {error}
              </div>
            )}

            {quote && quote.missingItems.length > 0 && (
              <div className="mb-6 p-4 border border-yellow-200 bg-yellow-50 text-yellow-800 text-sm rounded-sm">
                Some items in your cart are no longer available. Please remove them from your cart to continue.
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* Step 1: Recipient */}
              {step === 1 && (
                <div className="bg-white p-8 rounded-sm shadow-sm space-y-6 dark:bg-dark-surface">
                  <h2 className="font-serif text-xl text-charcoal mb-6 dark:text-ivory">
                    Who are the flowers for?
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className={labelClass}>Recipient First Name</label>
                      <input id="firstName" type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="luxury-input" autoComplete="given-name" />
                    </div>
                    <div>
                      <label htmlFor="lastName" className={labelClass}>Recipient Last Name</label>
                      <input id="lastName" type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="luxury-input" autoComplete="family-name" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="phone" className={labelClass}>Phone (for delivery)</label>
                      <input id="phone" type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="luxury-input" placeholder="10-digit mobile number" autoComplete="tel" />
                    </div>
                    <div>
                      <label htmlFor="email" className={labelClass}>Your Email</label>
                      <input id="email" type="email" name="email" value={formData.email} onChange={handleInputChange} className="luxury-input" autoComplete="email" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="address" className={labelClass}>Delivery Address</label>
                    <input id="address" type="text" name="address" value={formData.address} onChange={handleInputChange} className="luxury-input" placeholder="House no., street, area" autoComplete="street-address" />
                  </div>

                  <div>
                    <label htmlFor="apartment" className={labelClass}>Landmark / Apartment (optional)</label>
                    <input id="apartment" type="text" name="apartment" value={formData.apartment} onChange={handleInputChange} className="luxury-input" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="city" className={labelClass}>City</label>
                      <input id="city" type="text" name="city" value={formData.city} onChange={handleInputChange} className="luxury-input" autoComplete="address-level2" />
                    </div>
                    <div>
                      <label htmlFor="pincode" className={labelClass}>Pincode</label>
                      <input id="pincode" type="text" inputMode="numeric" maxLength={6} name="pincode" value={formData.pincode} onChange={handleInputChange} className="luxury-input" placeholder="e.g. 302017" autoComplete="postal-code" />
                      {pincodeReady && quote?.pincode.checked && (
                        <p className={`text-xs mt-2 ${quote.pincode.serviceable ? 'text-green-700' : 'text-red-600'}`}>
                          {quote.pincode.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <LuxuryButton type="button" variant="primary" className="w-full mt-6" onClick={() => goToStep(2)}>
                    Continue to Delivery
                  </LuxuryButton>
                </div>
              )}

              {/* Step 2: Delivery */}
              {step === 2 && (
                <div className="bg-white p-8 rounded-sm shadow-sm space-y-6 dark:bg-dark-surface">
                  <h2 className="font-serif text-xl text-charcoal mb-6 dark:text-ivory">
                    Delivery Options
                  </h2>

                  <div className="p-4 bg-champagne/50 rounded-sm text-sm text-charcoal dark:bg-dark-border dark:text-ivory">
                    {config && (
                      <p className="font-medium mb-1">
                        Next available delivery: {friendlyDate(config.earliest.date)} {slotLabel(config.earliest.slot).toLowerCase()}
                      </p>
                    )}
                    <p className="text-charcoal-light dark:text-ivory/70">{deliveryPolicyText} You can also choose a later date.</p>
                  </div>

                  <div>
                    <label htmlFor="deliveryDate" className={labelClass}>Delivery Date</label>
                    <input
                      id="deliveryDate"
                      type="date"
                      name="deliveryDate"
                      value={formData.deliveryDate}
                      onChange={(e) => {
                        const date = e.target.value
                        setFormData((prev) => ({
                          ...prev,
                          deliveryDate: date,
                          // keep the chosen time if still possible, otherwise pick the one that is
                          deliverySlot: isDeliveryAllowed(date, prev.deliverySlot)
                            ? prev.deliverySlot
                            : (config?.slots.find((slot) => isDeliveryAllowed(date, slot.id))?.id ?? prev.deliverySlot),
                        }))
                      }}
                      className="luxury-input"
                      min={config?.earliest.date}
                    />
                  </div>

                  <fieldset>
                    <legend className={labelClass}>Delivery Time</legend>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(config?.slots || []).map((slot) => {
                        const available = isDeliveryAllowed(formData.deliveryDate, slot.id)
                        return (
                          <label
                            key={slot.id}
                            className={`border p-3 rounded-sm transition-all flex justify-between gap-2 ${
                              !available
                                ? 'opacity-40 cursor-not-allowed border-blush-dark/20 dark:border-dark-border'
                                : formData.deliverySlot === slot.id
                                ? 'border-gold bg-gold/5 cursor-pointer'
                                : 'border-blush-dark/20 hover:border-gold/50 cursor-pointer dark:border-dark-border'
                            }`}
                          >
                            <input
                              type="radio"
                              name="deliverySlot"
                              value={slot.id}
                              checked={formData.deliverySlot === slot.id}
                              onChange={handleInputChange}
                              disabled={!available}
                              className="sr-only"
                            />
                            <span className="text-sm text-charcoal dark:text-ivory">{slot.label}</span>
                            <span className="text-sm text-gold whitespace-nowrap">{available ? 'Free' : 'Not available'}</span>
                          </label>
                        )
                      })}
                    </div>
                  </fieldset>

                  <div>
                    <label htmlFor="instructions" className={labelClass}>Delivery Instructions (optional)</label>
                    <textarea
                      id="instructions"
                      name="instructions"
                      value={formData.instructions}
                      onChange={handleInputChange}
                      rows={2}
                      maxLength={300}
                      className="luxury-input resize-none"
                      placeholder="e.g. Call before arriving, it's a surprise!"
                    />
                  </div>

                  {/* Gift Options */}
                  <div className="border-t border-blush-dark/20 pt-6 dark:border-dark-border">
                    <div className="border border-blush-dark/20 p-4 rounded-sm dark:border-dark-border">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="isGift"
                          checked={formData.isGift}
                          onChange={handleInputChange}
                          className="w-5 h-5 border-blush-dark/30 text-gold focus:ring-gold rounded"
                        />
                        <div>
                          <span className="text-charcoal dark:text-ivory">This is a gift</span>
                          <p className="text-xs text-charcoal-light mt-1 dark:text-ivory/60">
                            Add a free personalised message card
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {formData.isGift && (
                    <>
                      <div className="border border-blush-dark/20 p-4 rounded-sm dark:border-dark-border">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            name="hidePrice"
                            checked={formData.hidePrice}
                            onChange={handleInputChange}
                            className="w-5 h-5 border-blush-dark/30 text-gold focus:ring-gold rounded"
                          />
                          <span className="text-charcoal dark:text-ivory">
                            Don&apos;t show the price to the recipient
                          </span>
                        </label>
                      </div>

                      <div>
                        <label htmlFor="senderName" className={labelClass}>Your Name (for the card)</label>
                        <input id="senderName" type="text" name="senderName" value={formData.senderName} onChange={handleInputChange} className="luxury-input" placeholder="From..." />
                      </div>

                      <div>
                        <label htmlFor="giftMessage" className={labelClass}>Personal Message</label>
                        <textarea
                          id="giftMessage"
                          name="giftMessage"
                          value={formData.giftMessage}
                          onChange={handleInputChange}
                          rows={4}
                          maxLength={200}
                          className="luxury-input resize-none"
                          placeholder="Write your heartfelt message here..."
                        />
                        <p className="text-xs text-charcoal-light mt-1 dark:text-ivory/50">
                          {formData.giftMessage.length}/200 characters
                        </p>
                      </div>

                      {(formData.giftMessage || formData.senderName) && (
                        <div>
                          <p className={labelClass}>Card Preview</p>
                          <div className="relative bg-ivory p-6 rounded-sm border border-gold/30 shadow-lg dark:bg-charcoal">
                            <div className="text-center mb-4">
                              <p className="text-[10px] tracking-[0.3em] uppercase text-gold">House of Gul</p>
                            </div>
                            <p className="font-serif text-charcoal text-center italic leading-relaxed dark:text-ivory">
                              &ldquo;{formData.giftMessage || 'Your message will appear here...'}&rdquo;
                            </p>
                            {formData.senderName && (
                              <p className="text-right text-sm text-charcoal-light mt-4 dark:text-ivory/70">
                                — {formData.senderName}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  <div className="flex gap-4 mt-6">
                    <LuxuryButton type="button" variant="secondary" onClick={() => { setError(''); setStep(1) }}>
                      Back
                    </LuxuryButton>
                    <LuxuryButton type="button" variant="primary" className="flex-1" onClick={() => goToStep(3)}>
                      Continue to Payment
                    </LuxuryButton>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {step === 3 && (
                <div className="bg-white p-8 rounded-sm shadow-sm space-y-6 dark:bg-dark-surface">
                  <h2 className="font-serif text-xl text-charcoal mb-6 dark:text-ivory">
                    Payment
                  </h2>

                  {/* Coupon */}
                  <div>
                    <label htmlFor="coupon" className={labelClass}>Coupon Code</label>
                    <div className="flex gap-3">
                      <input
                        id="coupon"
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        className="luxury-input flex-1"
                        placeholder="Enter code"
                        disabled={!!placedOrder}
                      />
                      {appliedCoupon ? (
                        <LuxuryButton
                          type="button"
                          variant="secondary"
                          disabled={!!placedOrder}
                          onClick={() => { setAppliedCoupon(''); setCouponInput('') }}
                        >
                          Remove
                        </LuxuryButton>
                      ) : (
                        <LuxuryButton
                          type="button"
                          variant="secondary"
                          disabled={!couponInput.trim()}
                          onClick={() => setAppliedCoupon(couponInput.trim())}
                        >
                          Apply
                        </LuxuryButton>
                      )}
                    </div>
                    {appliedCoupon && quote?.coupon && (
                      <p className={`text-xs mt-2 ${quote.coupon.valid ? 'text-green-700' : 'text-red-600'}`}>
                        {quote.coupon.message}
                      </p>
                    )}
                  </div>

                  {/* Payment method */}
                  <fieldset>
                    <legend className={labelClass}>Payment Method</legend>
                    <div className="space-y-3">
                      {config?.razorpay && (
                        <label
                          className={`flex items-start gap-3 border p-4 rounded-sm cursor-pointer ${
                            paymentMethod === 'razorpay' ? 'border-gold bg-gold/5' : 'border-blush-dark/20 dark:border-dark-border'
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="razorpay"
                            checked={paymentMethod === 'razorpay'}
                            onChange={() => setPaymentMethod('razorpay')}
                            disabled={!!placedOrder}
                            className="mt-1"
                          />
                          <span>
                            <span className="block text-charcoal dark:text-ivory">Pay online</span>
                            <span className="block text-xs text-charcoal-light dark:text-ivory/60">
                              UPI, cards, net banking and wallets — secured by Razorpay
                            </span>
                          </span>
                        </label>
                      )}
                      <label
                        className={`flex items-start gap-3 border p-4 rounded-sm cursor-pointer ${
                          paymentMethod === 'cod' ? 'border-gold bg-gold/5' : 'border-blush-dark/20 dark:border-dark-border'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cod"
                          checked={paymentMethod === 'cod'}
                          onChange={() => setPaymentMethod('cod')}
                          disabled={!!placedOrder}
                          className="mt-1"
                        />
                        <span>
                          <span className="block text-charcoal dark:text-ivory">Pay on delivery</span>
                          <span className="block text-xs text-charcoal-light dark:text-ivory/60">
                            Cash or UPI when your flowers arrive. We&apos;ll call to confirm your order.
                          </span>
                        </span>
                      </label>
                    </div>
                  </fieldset>

                  <div className="flex gap-4 mt-6">
                    <LuxuryButton
                      type="button"
                      variant="secondary"
                      disabled={!!placedOrder}
                      onClick={() => { setError(''); setStep(2) }}
                    >
                      Back
                    </LuxuryButton>
                    <LuxuryButton
                      type="submit"
                      variant="gold"
                      className="flex-1"
                      disabled={isProcessing || quoteLoading || !quote || quote.missingItems.length > 0}
                    >
                      {isProcessing
                        ? 'Placing order...'
                        : placedOrder && paymentPending
                        ? `Pay now ${formatPrice(placedOrder.total)}`
                        : paymentMethod === 'razorpay'
                        ? `Pay ${formatPrice(total)}`
                        : `Place Order · ${formatPrice(total)}`}
                    </LuxuryButton>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-sm shadow-sm sticky top-32 dark:bg-dark-surface">
              <h2 className="font-serif text-lg text-charcoal mb-6 dark:text-ivory">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                {state.items.map((item) => (
                  <div key={item.product.id} className="flex gap-4">
                    <div className="relative w-16 h-16 rounded-sm overflow-hidden bg-champagne flex-shrink-0 dark:bg-dark-border">
                      {item.product.images[0] && (
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      )}
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-charcoal text-ivory text-xs flex items-center justify-center rounded-full">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-charcoal truncate dark:text-ivory">
                        {item.product.name}
                      </p>
                      <p className="text-sm text-gold">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-blush-dark/20 pt-4 space-y-2 dark:border-dark-border">
                <div className="flex justify-between text-sm">
                  <span className="text-charcoal-light dark:text-ivory/70">Subtotal</span>
                  <span className="text-charcoal dark:text-ivory">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-charcoal-light dark:text-ivory/70">Delivery</span>
                  <span className="text-charcoal dark:text-ivory">
                    {!pincodeReady ? (
                      <span className="text-charcoal-light">Enter pincode</span>
                    ) : deliveryCharge === 0 ? (
                      <span className="text-gold">Free</span>
                    ) : (
                      formatPrice(deliveryCharge)
                    )}
                  </span>
                </div>
                {slotFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-charcoal-light dark:text-ivory/70">Time Slot</span>
                    <span className="text-charcoal dark:text-ivory">{formatPrice(slotFee)}</span>
                  </div>
                )}
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-charcoal-light dark:text-ivory/70">Discount ({quote?.coupon?.code})</span>
                    <span className="text-green-700">−{formatPrice(discount)}</span>
                  </div>
                )}
                {deliveryCharge > 0 && freeThreshold > 0 && subtotal < freeThreshold && (
                  <p className="text-xs text-charcoal-light pt-1 dark:text-ivory/60">
                    Add {formatPrice(freeThreshold - subtotal)} more for free delivery.
                  </p>
                )}
              </div>

              <div className="border-t border-blush-dark/20 pt-4 mt-4 dark:border-dark-border">
                <div className="flex justify-between">
                  <span className="text-charcoal font-medium dark:text-ivory">Total</span>
                  <span className="font-serif text-xl text-gold">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              {config && (
                <p className="mt-6 pt-4 border-t border-blush-dark/20 text-xs text-center text-charcoal-light dark:border-dark-border dark:text-ivory/60">
                  Need help? Call or WhatsApp us at {config.storePhone}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
