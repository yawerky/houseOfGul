'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import SectionWrapper from '@/components/ui/SectionWrapper'
import LuxuryButton from '@/components/ui/LuxuryButton'
import { cn, formatPrice } from '@/lib/utils'

interface TrackedOrder {
  orderNumber: string
  status: string
  paymentStatus: string
  paymentMethod: string | null
  createdAt: string
  deliveryDate: string | null
  deliverySlot: string | null
  recipient: string
  area: string
  total: number
  items: { name: string; quantity: number; image: string | null }[]
  timeline: { status: string; message: string; createdAt: string }[]
}

const progressSteps = [
  { key: 'pending', label: 'Order Placed' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'processing', label: 'Being Arranged' },
  { key: 'out-for-delivery', label: 'Out for Delivery' },
  { key: 'delivered', label: 'Delivered' },
]

// "shipped" means it has left the studio — treat it like out for delivery.
const stepIndex = (status: string) => {
  if (status === 'shipped') return 3
  return progressSteps.findIndex((s) => s.key === status)
}

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  })

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('')
  const [contact, setContact] = useState('')
  const [isTracking, setIsTracking] = useState(false)
  const [error, setError] = useState('')
  const [order, setOrder] = useState<TrackedOrder | null>(null)

  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get('order')
    if (fromUrl) setOrderNumber(fromUrl)
  }, [])

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderNumber.trim() || !contact.trim()) {
      setError('Enter your order number and the phone or email used at checkout.')
      return
    }
    setIsTracking(true)
    setError('')
    setOrder(null)
    try {
      const params = new URLSearchParams({ orderNumber: orderNumber.trim(), contact: contact.trim() })
      const res = await fetch(`/api/orders/track?${params}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setOrder(data)
    } catch (err) {
      setError((err as Error).message || 'Could not look up your order. Please try again.')
    } finally {
      setIsTracking(false)
    }
  }

  const current = order ? stepIndex(order.status) : -1
  const cancelled = order?.status === 'cancelled'
  const timeFor = (key: string) => {
    if (!order) return ''
    const entry = [...order.timeline].reverse().find((t) => t.status === key || (key === 'out-for-delivery' && t.status === 'shipped'))
    return entry ? formatDateTime(entry.createdAt) : ''
  }

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 bg-ivory">
        <div className="luxury-container">
          <div className="text-center mb-12">
            <p className="luxury-subheading mb-4">Order Status</p>
            <h1 className="font-serif text-3xl md:text-4xl text-charcoal mb-4">
              Track Your Order
            </h1>
            <div className="luxury-divider" />
          </div>

          {/* Search Form */}
          <div className="max-w-xl mx-auto">
            <form onSubmit={handleTrack} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <label htmlFor="track-order-number" className="sr-only">Order number</label>
                <input
                  id="track-order-number"
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="Order number (e.g. HOG-260922-AB12)"
                  className="luxury-input flex-1"
                />
                <label htmlFor="track-contact" className="sr-only">Phone or email</label>
                <input
                  id="track-contact"
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="Phone or email"
                  className="luxury-input flex-1"
                />
              </div>
              <LuxuryButton type="submit" variant="primary" className="w-full" disabled={isTracking}>
                {isTracking ? 'Tracking...' : 'Track Order'}
              </LuxuryButton>
            </form>
            {error ? (
              <p role="alert" className="text-sm text-red-600 mt-3 text-center">{error}</p>
            ) : (
              <p className="text-xs text-charcoal-light mt-3 text-center">
                Your order number is shown after checkout. Use the phone number or email you entered.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Results */}
      {order && (
        <SectionWrapper background="white" padding="lg">
          <div className="max-w-3xl mx-auto">
            {/* Order Summary */}
            <div className="bg-champagne/50 p-6 rounded-sm mb-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <p className="text-xs tracking-widest uppercase text-charcoal-light mb-1">
                    Order Number
                  </p>
                  <p className="font-serif text-xl text-charcoal">{order.orderNumber}</p>
                </div>
                <div className="md:text-right">
                  <p className="text-xs tracking-widest uppercase text-charcoal-light mb-1">
                    Delivery
                  </p>
                  <p className="text-gold font-medium">
                    {order.deliveryDate
                      ? new Date(order.deliveryDate).toLocaleDateString('en-IN', {
                          timeZone: 'Asia/Kolkata',
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                        })
                      : '—'}
                    {order.deliverySlot ? ` · ${order.deliverySlot}` : ''}
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="mb-8">
              <h2 className="font-serif text-xl text-charcoal mb-6">Delivery Progress</h2>
              {cancelled ? (
                <p className="p-4 border border-red-200 bg-red-50 text-red-700 rounded-sm">
                  This order was cancelled. {order.timeline[order.timeline.length - 1]?.message}
                </p>
              ) : (
                <div className="space-y-0">
                  {progressSteps.map((step, index) => {
                    const completed = index < current || (index === current && step.key === 'delivered')
                    const isCurrent = index === current && step.key !== 'delivered'
                    return (
                      <div key={step.key} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={cn(
                              'w-4 h-4 rounded-full border-2 flex-shrink-0',
                              completed
                                ? 'bg-gold border-gold'
                                : isCurrent
                                ? 'bg-white border-gold'
                                : 'bg-white border-blush-dark/30'
                            )}
                          >
                            {completed && (
                              <svg className="w-full h-full text-white p-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          {index < progressSteps.length - 1 && (
                            <div className={cn('w-0.5 h-16', index < current ? 'bg-gold' : 'bg-blush-dark/30')} />
                          )}
                        </div>
                        <div className="pb-8">
                          <p className={cn('font-medium', completed || isCurrent ? 'text-charcoal' : 'text-charcoal-light')}>
                            {step.label}
                          </p>
                          <p className="text-sm text-charcoal-light">{timeFor(step.key)}</p>
                          {isCurrent && <p className="text-sm text-gold mt-1">In Progress</p>}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {order.timeline.length > 0 && (
                <div className="mt-2 p-4 bg-ivory rounded-sm">
                  <p className="text-xs tracking-widest uppercase text-charcoal-light mb-2">Latest update</p>
                  <p className="text-charcoal">{order.timeline[order.timeline.length - 1].message}</p>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="border-t border-blush-dark/20 pt-8">
              <h2 className="font-serif text-xl text-charcoal mb-6">Order Details</h2>
              <div className="space-y-4">
                {order.items.map((item, i) => (
                  <div key={`${item.name}-${i}`} className="flex gap-4 items-center">
                    <div className="relative w-20 h-20 rounded-sm overflow-hidden bg-champagne flex-shrink-0">
                      {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-serif text-lg text-charcoal">{item.name}</h3>
                      <p className="text-sm text-charcoal-light">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-6 pt-4 border-t border-blush-dark/20">
                <span className="text-charcoal-light">
                  Total ·{' '}
                  {order.paymentStatus === 'paid'
                    ? 'Paid'
                    : order.paymentMethod === 'cod'
                    ? 'Pay on delivery'
                    : 'Payment pending'}
                </span>
                <span className="text-gold font-medium">{formatPrice(order.total)}</span>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="border-t border-blush-dark/20 pt-8 mt-8">
              <h2 className="font-serif text-xl text-charcoal mb-4">Delivering To</h2>
              <p className="text-charcoal-light">
                {order.recipient}
                <br />
                {order.area}
              </p>
            </div>

            {/* Help */}
            <div className="bg-champagne/50 p-6 rounded-sm mt-8 text-center">
              <p className="text-charcoal mb-2">Need assistance with your order?</p>
              <p className="text-sm text-charcoal-light">
                Call or WhatsApp us at{' '}
                <a href="tel:+919461900344" className="text-gold hover:underline">
                  +91 94619 00344
                </a>
              </p>
            </div>
          </div>
        </SectionWrapper>
      )}
    </>
  )
}
