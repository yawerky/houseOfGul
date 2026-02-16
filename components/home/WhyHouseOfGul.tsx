'use client'

import SectionWrapper from '@/components/ui/SectionWrapper'
import ScrollReveal from '@/components/ui/ScrollReveal'

const features = [
  {
    icon: (
      <svg
        className="w-10 h-10"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    ),
    title: 'Handcrafted Luxury',
    description:
      'Each arrangement is meticulously designed by our master florists, bringing together decades of expertise and artistic vision.',
  },
  {
    icon: (
      <svg
        className="w-10 h-10"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
        />
      </svg>
    ),
    title: 'Exotic Premium Flowers',
    description:
      'We source the most exquisite blooms from renowned growers worldwide, ensuring only the finest flowers grace our arrangements.',
  },
  {
    icon: (
      <svg
        className="w-10 h-10"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
        />
      </svg>
    ),
    title: 'Elegant Packaging',
    description:
      'Every bouquet arrives in our signature luxury packaging, transforming each delivery into an unforgettable experience.',
  },
]

export default function WhyHouseOfGul() {
  return (
    <SectionWrapper background="white">
      <ScrollReveal animation="fade-up">
        <div className="text-center mb-12 md:mb-16">
          <p className="luxury-subheading mb-4">The House of Gul Experience</p>
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal mb-4">
            Why Choose Us
          </h2>
          <div className="luxury-divider" />
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        {features.map((feature, index) => (
          <ScrollReveal key={index} animation="fade-up" delay={index * 200} duration={900}>
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-champagne text-gold mb-6 group-hover:bg-gold group-hover:text-ivory transition-all duration-500">
                {feature.icon}
              </div>
              <h3 className="font-serif text-xl text-charcoal mb-4">
                {feature.title}
              </h3>
              <p className="text-charcoal-light leading-relaxed">
                {feature.description}
              </p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </SectionWrapper>
  )
}
