'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

interface ParallaxSectionProps {
  imageUrl: string
  children: React.ReactNode
  height?: string
  overlayOpacity?: number
}

export default function ParallaxSection({
  imageUrl,
  children,
  height = '60vh',
  overlayOpacity = 0.4,
}: ParallaxSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [offsetY, setOffsetY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect()
        const scrollProgress = -rect.top / window.innerHeight
        setOffsetY(scrollProgress * 100)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden flex items-center justify-center"
      style={{ height }}
    >
      <div
        className="absolute inset-0 scale-110"
        style={{ transform: `translateY(${offsetY * 0.3}px)` }}
      >
        <Image
          src={imageUrl}
          alt=""
          fill
          className="object-cover"
        />
      </div>
      <div
        className="absolute inset-0 bg-charcoal"
        style={{ opacity: overlayOpacity }}
      />
      <div className="relative z-10 luxury-container">{children}</div>
    </section>
  )
}
