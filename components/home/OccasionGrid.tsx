'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { occasions as defaultOccasions } from '@/lib/products'
import SectionWrapper from '@/components/ui/SectionWrapper'
import ScrollReveal from '@/components/ui/ScrollReveal'

interface Occasion {
  id: string
  name: string
  slug: string
  image: string | null
}

const occasionIcons: Record<string, string> = {
  wedding: '💒',
  anniversary: '💕',
  birthday: '🎂',
  sympathy: '🕊️',
  congratulations: '🎉',
  'thank-you': '🙏',
  romance: '❤️',
  'new-baby': '👶',
}

export default function OccasionGrid() {
  const [occasions, setOccasions] = useState<Occasion[]>([])

  useEffect(() => {
    fetch('/api/occasions')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          setOccasions(data)
        }
      })
      .catch(() => {})
  }, [])

  // Use database occasions if available, otherwise fall back to hardcoded
  const displayOccasions = occasions.length > 0
    ? occasions.map((o) => ({
        id: o.slug,
        label: o.name,
        icon: occasionIcons[o.slug] || '🌸',
        image: o.image,
      }))
    : defaultOccasions

  return (
    <SectionWrapper background="ivory">
      <ScrollReveal animation="fade-up">
        <div className="text-center mb-12">
          <p className="luxury-subheading mb-4">Find the Perfect Bouquet</p>
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal mb-4">
            Shop by Occasion
          </h2>
          <div className="luxury-divider" />
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {displayOccasions.map((occasion, index) => (
          <ScrollReveal key={occasion.id} animation="fade-up" delay={index * 150} duration={900}>
            <Link
              href={`/shop?occasion=${occasion.id}`}
              className="group p-6 md:p-8 bg-white rounded-sm text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 block"
            >
              <span className="text-4xl mb-4 block">{occasion.icon}</span>
              <h3 className="font-serif text-lg text-charcoal group-hover:text-gold transition-colors duration-300">
                {occasion.label}
              </h3>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </SectionWrapper>
  )
}
