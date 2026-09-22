'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import LuxuryButton from '@/components/ui/LuxuryButton'
import type { BannerContent } from '@/lib/banners'
import { cn } from '@/lib/utils'

const defaultSlide: BannerContent = {
  title: 'House of Gul',
  subtitle:
    'Discover the art of floral couture. Each arrangement is a masterpiece, crafted with passion and delivered with elegance.',
  buttonText: 'Shop Bouquets',
  buttonLink: '/shop',
  image: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=1920&q=80',
}

const SLIDE_MS = 6000

// Hero banners come from Admin → Banners (position "Hero"). With more than
// one active banner they rotate as a slideshow.
export default function HeroBanner({ banners = [] }: { banners?: BannerContent[] }) {
  const slides = banners.length > 0 ? banners : [defaultSlide]
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (slides.length < 2 || paused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = setInterval(() => setActive((i) => (i + 1) % slides.length), SLIDE_MS)
    return () => clearInterval(timer)
  }, [slides.length, paused])

  const slide = slides[active] || slides[0]

  return (
    <section
      className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription={slides.length > 1 ? 'carousel' : undefined}
    >
      {/* Background Images */}
      <div className="absolute inset-0">
        {slides.map((s, i) => (
          <div
            key={`${s.image}-${i}`}
            className={cn(
              'absolute inset-0 transition-opacity duration-1000 motion-reduce:transition-none',
              i === active ? 'opacity-100' : 'opacity-0'
            )}
            aria-hidden={i !== active}
          >
            <Image src={s.image} alt={s.title} fill priority={i === 0} sizes="100vw" className="object-cover" />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/40 via-charcoal/20 to-charcoal/50" />
      </div>

      {/* Content */}
      <div key={active} className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <p className="text-xs md:text-sm tracking-[0.4em] uppercase text-ivory/80 mb-6 animate-[fadeIn_1s_ease-out]">
          Luxury Floral Atelier
        </p>
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-ivory mb-4 tracking-tight animate-[slideUp_1s_ease-out]">
          {slide.title}
        </h1>
        <p className="text-lg md:text-xl text-ivory/90 mb-2 font-light tracking-wide animate-[slideUp_1s_ease-out_0.2s_both]">
          Where Every Bloom Speaks
        </p>
        <div className="w-16 h-px bg-gold mx-auto my-8 animate-[fadeIn_1s_ease-out_0.4s_both]" />
        {slide.subtitle && (
          <p className="text-ivory/70 max-w-xl mx-auto mb-10 leading-relaxed animate-[fadeIn_1s_ease-out_0.5s_both]">
            {slide.subtitle}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-[fadeIn_1s_ease-out_0.6s_both]">
          <Link href={slide.buttonLink || '/shop'}>
            <LuxuryButton variant="gold" size="lg">
              {slide.buttonText || 'Shop Bouquets'}
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

      {/* Slide dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 flex gap-3">
          {slides.map((s, i) => (
            <button
              key={`dot-${i}`}
              onClick={() => setActive(i)}
              aria-label={`Show banner ${i + 1}: ${s.title}`}
              aria-current={i === active}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold',
                i === active ? 'w-8 bg-gold' : 'w-3 bg-ivory/60 hover:bg-ivory'
              )}
            />
          ))}
        </div>
      )}

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
