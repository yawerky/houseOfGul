'use client'

import SectionWrapper from '@/components/ui/SectionWrapper'
import ScrollReveal from '@/components/ui/ScrollReveal'

export default function BrandStatement() {
  return (
    <SectionWrapper background="champagne" padding="xl">
      <div className="max-w-4xl mx-auto text-center">
        <ScrollReveal animation="zoom" duration={1000}>
          <svg
            className="w-12 h-12 mx-auto mb-8 text-gold"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
            <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
            <circle cx="12" cy="12" r="2" />
          </svg>
        </ScrollReveal>
        <ScrollReveal animation="fade-up" delay={200} duration={900}>
          <p className="luxury-subheading mb-6">Our Philosophy</p>
        </ScrollReveal>
        <ScrollReveal animation="fade-up" delay={400} duration={1000}>
          <blockquote className="font-serif text-2xl md:text-3xl lg:text-4xl text-charcoal leading-relaxed mb-8">
            &ldquo;At House of Gul, every bouquet is crafted as a piece of floral
            couture — where nature&apos;s finest blooms meet the artistry of
            timeless elegance.&rdquo;
          </blockquote>
        </ScrollReveal>
        <ScrollReveal animation="fade" delay={600} duration={800}>
          <div className="luxury-divider" />
        </ScrollReveal>
        <ScrollReveal animation="fade-up" delay={800} duration={900}>
          <p className="text-charcoal-light mt-8 max-w-2xl mx-auto leading-relaxed">
            We believe that flowers are more than gifts — they are expressions of
            emotion, vessels of memory, and works of living art. Each arrangement
            is thoughtfully composed to speak the language of the heart.
          </p>
        </ScrollReveal>
      </div>
    </SectionWrapper>
  )
}
