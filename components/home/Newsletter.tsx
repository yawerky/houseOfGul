'use client'

import { useState } from 'react'
import SectionWrapper from '@/components/ui/SectionWrapper'
import LuxuryButton from '@/components/ui/LuxuryButton'
import ScrollReveal from '@/components/ui/ScrollReveal'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    setError('')

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (res.ok) {
        setIsSubmitted(true)
        setEmail('')
      } else {
        const data = await res.json()
        setError(data.error || 'Something went wrong')
      }
    } catch {
      setError('Failed to subscribe. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SectionWrapper background="white" padding="xl">
      <ScrollReveal animation="fade-up">
        <div className="max-w-2xl mx-auto text-center">
          <p className="luxury-subheading mb-4">Stay Connected</p>
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal mb-4">
            Join the House of Gul
          </h2>
          <div className="luxury-divider mb-6" />
          <p className="text-charcoal-light mb-8">
            Be the first to discover new collections, exclusive offers, and the
            art of floral living.
          </p>

          {isSubmitted ? (
            <div className="bg-champagne/50 border border-gold/30 rounded-sm p-6">
              <svg
                className="w-12 h-12 mx-auto text-gold mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="font-serif text-xl text-charcoal mb-2">
                Welcome to House of Gul
              </p>
              <p className="text-charcoal-light text-sm">
                Thank you for joining our community. Expect beauty in your inbox
                soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="luxury-input flex-1"
                  required
                  disabled={isLoading}
                />
                <LuxuryButton type="submit" variant="primary" disabled={isLoading}>
                  {isLoading ? 'Subscribing...' : 'Subscribe'}
                </LuxuryButton>
              </div>
              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}
            </form>
          )}

          <p className="text-xs text-charcoal-light/60 mt-4">
            By subscribing, you agree to receive marketing communications from
            House of Gul. Unsubscribe anytime.
          </p>
        </div>
      </ScrollReveal>
    </SectionWrapper>
  )
}
