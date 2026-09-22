'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import LuxuryButton from '@/components/ui/LuxuryButton'
import type { BannerContent } from '@/lib/banners'

// Shows the admin "popup" banner once per browser session.
export default function PromoPopup({ banner }: { banner: BannerContent }) {
  const [open, setOpen] = useState(false)
  const storageKey = `hog-popup-${banner.title}`

  useEffect(() => {
    let seen = false
    try {
      seen = sessionStorage.getItem(storageKey) === '1'
    } catch {
      seen = false
    }
    if (seen) return
    const timer = setTimeout(() => setOpen(true), 2500)
    return () => clearTimeout(timer)
  }, [storageKey])

  const close = () => {
    setOpen(false)
    try {
      sessionStorage.setItem(storageKey, '1')
    } catch {
      // ignore storage errors
    }
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-charcoal/60 px-4"
      role="dialog"
      aria-modal="true"
      aria-label={banner.title}
      onClick={close}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-sm bg-ivory shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={close}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-ivory/90 text-charcoal hover:text-gold"
        >
          ✕
        </button>
        <div className="relative aspect-[4/3] w-full bg-champagne">
          <Image src={banner.image} alt={banner.title} fill className="object-cover" />
        </div>
        <div className="p-6 text-center">
          <h2 className="font-serif text-2xl text-charcoal mb-2">{banner.title}</h2>
          {banner.subtitle && <p className="text-charcoal-light mb-6">{banner.subtitle}</p>}
          {banner.buttonText && (
            <Link href={banner.buttonLink || '/shop'} onClick={close}>
              <LuxuryButton variant="gold">{banner.buttonText}</LuxuryButton>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
