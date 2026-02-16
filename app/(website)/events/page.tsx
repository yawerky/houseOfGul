'use client'

import { useState } from 'react'
import Image from 'next/image'
import SectionWrapper from '@/components/ui/SectionWrapper'
import LuxuryButton from '@/components/ui/LuxuryButton'

export default function EventsPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    eventDate: '',
    guestCount: '',
    budget: '',
    venue: '',
    message: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          type: formData.eventType,
          eventDate: formData.eventDate ? new Date(formData.eventDate).toISOString() : undefined,
          guests: formData.guestCount || undefined,
          budget: formData.budget || undefined,
          message: `${formData.message}${formData.venue ? `\n\nVenue: ${formData.venue}` : ''}`,
        }),
      })

      if (res.ok) {
        setIsSubmitted(true)
      } else {
        const data = await res.json()
        setError(data.error || 'Something went wrong')
      }
    } catch {
      setError('Failed to submit inquiry. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80"
            alt="Wedding and event flowers"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-charcoal/50" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <p className="text-xs md:text-sm tracking-[0.4em] uppercase text-gold mb-4">
            Bespoke Floral Design
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-ivory mb-4">
            Weddings & Events
          </h1>
          <div className="w-16 h-px bg-gold mx-auto mb-6" />
          <p className="text-ivory/80 leading-relaxed">
            From intimate gatherings to grand celebrations, our master florists create
            breathtaking floral experiences tailored to your vision.
          </p>
        </div>
      </section>

      {/* Services */}
      <SectionWrapper background="ivory">
        <div className="text-center mb-12">
          <p className="luxury-subheading mb-4">Our Services</p>
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal mb-4">
            What We Offer
          </h2>
          <div className="luxury-divider" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Weddings',
              description: 'Bridal bouquets, ceremony arrangements, reception centerpieces, and more.',
              icon: '💒',
            },
            {
              title: 'Corporate Events',
              description: 'Sophisticated arrangements for galas, conferences, and business functions.',
              icon: '🏢',
            },
            {
              title: 'Private Parties',
              description: 'Birthday celebrations, anniversaries, and intimate dinner parties.',
              icon: '🎉',
            },
            {
              title: 'Luxury Installations',
              description: 'Statement pieces for hotels, restaurants, and exclusive venues.',
              icon: '✨',
            },
          ].map((service) => (
            <div key={service.title} className="bg-white p-8 rounded-sm text-center hover:shadow-lg transition-shadow duration-300">
              <span className="text-4xl mb-4 block">{service.icon}</span>
              <h3 className="font-serif text-xl text-charcoal mb-3">{service.title}</h3>
              <p className="text-sm text-charcoal-light">{service.description}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* Inquiry Form */}
      <SectionWrapper background="champagne">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="luxury-subheading mb-4">Start Your Journey</p>
            <h2 className="font-serif text-3xl md:text-4xl text-charcoal mb-4">
              Request a Consultation
            </h2>
            <div className="luxury-divider" />
          </div>

          {isSubmitted ? (
            <div className="bg-white p-12 rounded-sm text-center">
              <svg
                className="w-16 h-16 mx-auto text-gold mb-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="font-serif text-2xl text-charcoal mb-4">
                Thank You for Your Inquiry
              </h3>
              <p className="text-charcoal-light mb-2">
                Our events team will review your request and contact you within 24 hours.
              </p>
              <p className="text-sm text-gold">
                We look forward to creating something beautiful together.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-sm space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs tracking-widest uppercase text-charcoal-light mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="luxury-input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-charcoal-light mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="luxury-input"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs tracking-widest uppercase text-charcoal-light mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="luxury-input"
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-charcoal-light mb-2">
                    Event Type *
                  </label>
                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    className="luxury-input"
                    required
                  >
                    <option value="">Select event type</option>
                    <option value="wedding">Wedding</option>
                    <option value="corporate">Corporate Event</option>
                    <option value="private">Private Party</option>
                    <option value="installation">Luxury Installation</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs tracking-widest uppercase text-charcoal-light mb-2">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleChange}
                    className="luxury-input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-charcoal-light mb-2">
                    Estimated Guest Count
                  </label>
                  <input
                    type="number"
                    name="guestCount"
                    value={formData.guestCount}
                    onChange={handleChange}
                    className="luxury-input"
                    placeholder="e.g., 150"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs tracking-widest uppercase text-charcoal-light mb-2">
                    Budget Range
                  </label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="luxury-input"
                  >
                    <option value="">Select budget range</option>
                    <option value="2000-5000">$2,000 - $5,000</option>
                    <option value="5000-10000">$5,000 - $10,000</option>
                    <option value="10000-20000">$10,000 - $20,000</option>
                    <option value="20000+">$20,000+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-charcoal-light mb-2">
                    Venue Name
                  </label>
                  <input
                    type="text"
                    name="venue"
                    value={formData.venue}
                    onChange={handleChange}
                    className="luxury-input"
                    placeholder="If known"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs tracking-widest uppercase text-charcoal-light mb-2">
                  Tell Us About Your Vision
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="luxury-input resize-none"
                  placeholder="Describe your dream floral design, color preferences, inspiration..."
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}

              <LuxuryButton type="submit" variant="primary" className="w-full" disabled={isLoading}>
                {isLoading ? 'Submitting...' : 'Submit Inquiry'}
              </LuxuryButton>
            </form>
          )}
        </div>
      </SectionWrapper>

      {/* Portfolio Preview */}
      <SectionWrapper background="white">
        <div className="text-center mb-12">
          <p className="luxury-subheading mb-4">Our Work</p>
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal mb-4">
            Featured Events
          </h2>
          <div className="luxury-divider" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80',
            'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=600&q=80',
            'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=80',
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
          ].map((image, index) => (
            <div key={index} className="relative aspect-square rounded-sm overflow-hidden group">
              <Image src={image} alt={`Event ${index + 1}`} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/30 transition-colors duration-300" />
            </div>
          ))}
        </div>
      </SectionWrapper>
    </>
  )
}
