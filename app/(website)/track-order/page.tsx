'use client'

import { useState } from 'react'
import Image from 'next/image'
import SectionWrapper from '@/components/ui/SectionWrapper'
import LuxuryButton from '@/components/ui/LuxuryButton'
import { cn } from '@/lib/utils'

const mockOrderStatuses = [
  { status: 'Order Placed', date: 'Feb 15, 2026 - 10:30 AM', completed: true },
  { status: 'Arrangement Crafted', date: 'Feb 15, 2026 - 2:00 PM', completed: true },
  { status: 'Quality Inspection', date: 'Feb 15, 2026 - 3:30 PM', completed: true },
  { status: 'Out for Delivery', date: 'Feb 16, 2026 - 9:00 AM', completed: false, current: true },
  { status: 'Delivered', date: 'Expected by 2:00 PM', completed: false },
]

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('')
  const [isTracking, setIsTracking] = useState(false)
  const [showResult, setShowResult] = useState(false)

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault()
    if (orderNumber) {
      setIsTracking(true)
      setTimeout(() => {
        setIsTracking(false)
        setShowResult(true)
      }, 1500)
    }
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
            <form onSubmit={handleTrack} className="flex gap-4">
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="Enter your order number (e.g., HOG-2026-0001)"
                className="luxury-input flex-1"
                required
              />
              <LuxuryButton type="submit" variant="primary" disabled={isTracking}>
                {isTracking ? 'Tracking...' : 'Track'}
              </LuxuryButton>
            </form>
            <p className="text-xs text-charcoal-light mt-3 text-center">
              Your order number can be found in your confirmation email
            </p>
          </div>
        </div>
      </section>

      {/* Results */}
      {showResult && (
        <SectionWrapper background="white" padding="lg">
          <div className="max-w-3xl mx-auto">
            {/* Order Summary */}
            <div className="bg-champagne/50 p-6 rounded-sm mb-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <p className="text-xs tracking-widest uppercase text-charcoal-light mb-1">
                    Order Number
                  </p>
                  <p className="font-serif text-xl text-charcoal">{orderNumber || 'HOG-2026-0001'}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs tracking-widest uppercase text-charcoal-light mb-1">
                    Estimated Delivery
                  </p>
                  <p className="text-gold font-medium">Today by 2:00 PM</p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="mb-8">
              <h2 className="font-serif text-xl text-charcoal mb-6">Delivery Progress</h2>
              <div className="space-y-0">
                {mockOrderStatuses.map((step, index) => (
                  <div key={step.status} className="flex gap-4">
                    {/* Timeline Line & Dot */}
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          'w-4 h-4 rounded-full border-2 flex-shrink-0',
                          step.completed
                            ? 'bg-gold border-gold'
                            : step.current
                            ? 'bg-white border-gold'
                            : 'bg-white border-blush-dark/30'
                        )}
                      >
                        {step.completed && (
                          <svg className="w-full h-full text-white p-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      {index < mockOrderStatuses.length - 1 && (
                        <div
                          className={cn(
                            'w-0.5 h-16',
                            step.completed ? 'bg-gold' : 'bg-blush-dark/30'
                          )}
                        />
                      )}
                    </div>

                    {/* Content */}
                    <div className="pb-8">
                      <p
                        className={cn(
                          'font-medium',
                          step.completed || step.current ? 'text-charcoal' : 'text-charcoal-light'
                        )}
                      >
                        {step.status}
                      </p>
                      <p className="text-sm text-charcoal-light">{step.date}</p>
                      {step.current && (
                        <p className="text-sm text-gold mt-1">In Progress</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Items */}
            <div className="border-t border-blush-dark/20 pt-8">
              <h2 className="font-serif text-xl text-charcoal mb-6">Order Details</h2>
              <div className="flex gap-4 items-start">
                <div className="relative w-24 h-24 rounded-sm overflow-hidden bg-champagne flex-shrink-0">
                  <Image
                    src="https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=200&q=80"
                    alt="Eternal Elegance"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-lg text-charcoal">Eternal Elegance</h3>
                  <p className="text-sm text-charcoal-light">Qty: 1</p>
                  <p className="text-gold">$285</p>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="border-t border-blush-dark/20 pt-8 mt-8">
              <h2 className="font-serif text-xl text-charcoal mb-4">Delivery Address</h2>
              <p className="text-charcoal-light">
                123 Luxury Lane<br />
                New York, NY 10001<br />
                United States
              </p>
            </div>

            {/* Help */}
            <div className="bg-champagne/50 p-6 rounded-sm mt-8 text-center">
              <p className="text-charcoal mb-2">Need assistance with your order?</p>
              <p className="text-sm text-charcoal-light">
                Contact us at{' '}
                <a href="mailto:care@houseofgul.com" className="text-gold hover:underline">
                  care@houseofgul.com
                </a>{' '}
                or call{' '}
                <a href="tel:+18884687345" className="text-gold hover:underline">
                  +1 (888) HOUSE-GUL
                </a>
              </p>
            </div>
          </div>
        </SectionWrapper>
      )}
    </>
  )
}
