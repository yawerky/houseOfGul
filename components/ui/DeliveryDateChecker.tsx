'use client'

import { useEffect, useState } from 'react'
import { deliveryPolicyText, nextDeliveryMessage } from '@/lib/deliveryWindows'

// Product-page delivery box: live "order within…" countdown and a real
// pincode check against the delivery areas set in Admin → Pincodes.
export default function DeliveryDateChecker() {
  const [message, setMessage] = useState('')
  const [pincode, setPincode] = useState('')
  const [isChecking, setIsChecking] = useState(false)
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null)

  useEffect(() => {
    const update = () => setMessage(nextDeliveryMessage())
    update()
    const timer = setInterval(update, 30000)
    return () => clearInterval(timer)
  }, [])

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault()
    const code = pincode.replace(/\D/g, '')
    if (code.length !== 6) {
      setResult({ ok: false, text: 'Please enter a valid 6-digit pincode.' })
      return
    }
    setIsChecking(true)
    setResult(null)
    try {
      const res = await fetch('/api/checkout/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: [], pincode: code }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error()
      setResult({ ok: data.pincode.serviceable, text: data.pincode.message })
    } catch {
      setResult({ ok: false, text: 'Could not check this pincode. Please try again.' })
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <div className="border border-blush-dark/20 rounded-sm p-5 dark:border-dark-border">
      <div className="flex items-center gap-2 mb-2">
        <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="font-serif text-lg text-charcoal dark:text-ivory">Delivery in Jaipur</h3>
      </div>

      {message && <p className="text-sm text-gold mb-1">{message}</p>}
      <p className="text-xs text-charcoal-light mb-4 dark:text-ivory/60">{deliveryPolicyText}</p>

      <form onSubmit={handleCheck} className="flex gap-2">
        <label htmlFor="delivery-pincode" className="sr-only">Pincode</label>
        <input
          id="delivery-pincode"
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          placeholder="Enter pincode"
          className="luxury-input flex-1"
        />
        <button
          type="submit"
          disabled={isChecking}
          className="px-5 py-2 bg-charcoal text-ivory text-sm tracking-wide rounded-sm hover:bg-gold transition-colors disabled:opacity-50"
        >
          {isChecking ? 'Checking…' : 'Check'}
        </button>
      </form>
      {result && (
        <p className={`text-sm mt-2 ${result.ok ? 'text-green-700' : 'text-red-600'}`} role="status">
          {result.text}
        </p>
      )}
    </div>
  )
}
