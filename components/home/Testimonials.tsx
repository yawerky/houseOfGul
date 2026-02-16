'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import SectionWrapper from '@/components/ui/SectionWrapper'
import ScrollReveal from '@/components/ui/ScrollReveal'
import { cn } from '@/lib/utils'

interface Testimonial {
  id: string
  name: string
  title: string
  content: string
  rating: number
  image: string | null
}

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])

  useEffect(() => {
    fetch('/api/testimonials')
      .then((res) => res.json())
      .then((data) => setTestimonials(data))
      .catch(() => setTestimonials([]))
  }, [])

  if (testimonials.length === 0) {
    return null
  }

  return (
    <SectionWrapper background="white">
      <ScrollReveal animation="fade-up">
        <div className="text-center mb-12">
          <p className="luxury-subheading mb-4">Client Stories</p>
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal mb-4">
            What They Say
          </h2>
          <div className="luxury-divider" />
        </div>
      </ScrollReveal>

      <ScrollReveal animation="fade-up" delay={200}>
        <div className="max-w-4xl mx-auto">
          {/* Active Testimonial */}
          <div className="text-center mb-12">
          <div className="relative w-20 h-20 mx-auto mb-6 rounded-full overflow-hidden">
            <Image
              src={testimonials[activeIndex].image || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80'}
              alt={testimonials[activeIndex].name}
              fill
              className="object-cover"
            />
          </div>

          {/* Stars */}
          <div className="flex justify-center mb-6">
            {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
              <svg key={i} className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>

          <blockquote className="font-serif text-xl md:text-2xl text-charcoal leading-relaxed mb-6 italic">
            &ldquo;{testimonials[activeIndex].content}&rdquo;
          </blockquote>

          <p className="text-charcoal font-medium">{testimonials[activeIndex].name}</p>
          <p className="text-sm text-charcoal-light">{testimonials[activeIndex].title}</p>
        </div>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  'w-3 h-3 rounded-full transition-all duration-300',
                  activeIndex === index ? 'bg-gold w-8' : 'bg-blush-dark/30 hover:bg-gold/50'
                )}
              />
            ))}
          </div>
        </div>
      </ScrollReveal>
    </SectionWrapper>
  )
}
