'use client'

import { useState } from 'react'

interface DeliverySlot {
  date: string
  displayDate: string
  available: boolean
  premium: boolean
  label: string
}

export default function DeliveryDateChecker() {
  const [postalCode, setPostalCode] = useState('')
  const [isChecking, setIsChecking] = useState(false)
  const [deliverySlots, setDeliverySlots] = useState<DeliverySlot[]>([])
  const [error, setError] = useState('')

  const generateDeliverySlots = (): DeliverySlot[] => {
    const slots: DeliverySlot[] = []
    const today = new Date()

    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)

      const isToday = i === 0
      const isTomorrow = i === 1
      const isWeekend = date.getDay() === 0 || date.getDay() === 6

      let label = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
      if (isToday) label = 'Today'
      if (isTomorrow) label = 'Tomorrow'

      slots.push({
        date: date.toISOString().split('T')[0],
        displayDate: label,
        available: !isWeekend || i > 1,
        premium: isToday,
        label,
      })
    }

    return slots
  }

  const handleCheck = async () => {
    if (!postalCode.trim()) {
      setError('Please enter a postal code')
      return
    }

    setError('')
    setIsChecking(true)

    await new Promise((resolve) => setTimeout(resolve, 800))

    setDeliverySlots(generateDeliverySlots())
    setIsChecking(false)
  }

  return (
    <div className="border border-blush-dark/20 rounded-sm p-4 dark:border-dark-border">
      <h3 className="text-sm font-medium text-charcoal mb-3 flex items-center gap-2 dark:text-ivory">
        <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Check Delivery Availability
      </h3>

      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          placeholder="Enter postal code"
          className="flex-1 px-3 py-2 border border-blush-dark/20 rounded-sm text-sm focus:outline-none focus:border-gold dark:bg-dark-surface dark:border-dark-border dark:text-ivory"
        />
        <button
          onClick={handleCheck}
          disabled={isChecking}
          className="px-4 py-2 bg-charcoal text-ivory text-sm rounded-sm hover:bg-charcoal-light transition-colors disabled:opacity-50 dark:bg-gold dark:text-charcoal"
        >
          {isChecking ? 'Checking...' : 'Check'}
        </button>
      </div>

      {error && <p className="text-red-500 text-xs mb-2">{error}</p>}

      {deliverySlots.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-charcoal-light dark:text-ivory/60">
            Delivery available for {postalCode}:
          </p>
          <div className="grid grid-cols-4 gap-2">
            {deliverySlots.slice(0, 4).map((slot) => (
              <div
                key={slot.date}
                className={`text-center p-2 rounded-sm text-xs ${
                  slot.available
                    ? slot.premium
                      ? 'bg-gold/10 border border-gold text-gold'
                      : 'bg-champagne text-charcoal dark:bg-dark-border dark:text-ivory'
                    : 'bg-gray-100 text-gray-400 dark:bg-dark-border/50 dark:text-ivory/30'
                }`}
              >
                <p className="font-medium">{slot.displayDate}</p>
                {slot.premium && slot.available && (
                  <p className="text-[10px] mt-1">+$15</p>
                )}
                {!slot.available && (
                  <p className="text-[10px] mt-1">Unavailable</p>
                )}
              </div>
            ))}
          </div>
          <p className="text-[10px] text-charcoal-light mt-2 dark:text-ivory/50">
            Same-day delivery available before 2pm for select areas
          </p>
        </div>
      )}
    </div>
  )
}
