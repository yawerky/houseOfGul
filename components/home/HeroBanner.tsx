'use client'

import Image from 'next/image'
import Link from 'next/link'
import LuxuryButton from '@/components/ui/LuxuryButton'

export default function HeroBanner() {
  return (
    <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=1920&q=80"
          alt="Luxury floral arrangement"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/40 via-charcoal/20 to-charcoal/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <p className="text-xs md:text-sm tracking-[0.4em] uppercase text-ivory/80 mb-6 animate-[fadeIn_1s_ease-out]">
          Luxury Floral Atelier
        </p>
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-ivory mb-4 tracking-tight animate-[slideUp_1s_ease-out]">
          House of Gul
        </h1>
        <p className="text-lg md:text-xl text-ivory/90 mb-2 font-light tracking-wide animate-[slideUp_1s_ease-out_0.2s_both]">
          Where Every Bloom Speaks
        </p>
        <div className="w-16 h-px bg-gold mx-auto my-8 animate-[fadeIn_1s_ease-out_0.4s_both]" />
        <p className="text-ivory/70 max-w-xl mx-auto mb-10 leading-relaxed animate-[fadeIn_1s_ease-out_0.5s_both]">
          Discover the art of floral couture. Each arrangement is a masterpiece,
          crafted with passion and delivered with elegance.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-[fadeIn_1s_ease-out_0.6s_both]">
          <Link href="/shop">
            <LuxuryButton variant="gold" size="lg">
              Shop Bouquets
            </LuxuryButton>
          </Link>
          <Link href="/about">
            <LuxuryButton
              variant="secondary"
              size="lg"
              className="border-ivory/50 text-ivory hover:bg-ivory hover:text-charcoal"
            >
              Our Story
            </LuxuryButton>
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-ivory/60"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  )
}
