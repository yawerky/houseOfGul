'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCurrency } from '@/context/CurrencyContext'
import { cn } from '@/lib/utils'

export interface SeasonOption {
  slug: string
  season: string
  label: string
  months: string
  price: number
  image: string | null
  isCurrentSeason: boolean
}

// Switches between the seasonal versions of a product. Each season is its own
// product page, so price, photos, flowers and description all update together.
export default function SeasonPicker({ options, currentSlug }: { options: SeasonOption[]; currentSlug: string }) {
  const { formatPrice } = useCurrency()
  const prices = new Set(options.map((o) => o.price))

  return (
    <div>
      <h3 className="text-xs tracking-widest uppercase text-charcoal-light mb-3 dark:text-ivory/60">
        Also Available In These Seasons
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" role="radiogroup" aria-label="Season">
        {options.map((option) => {
          const selected = option.slug === currentSlug
          return (
            <Link
              key={option.slug}
              href={`/product/${option.slug}`}
              replace
              scroll={false}
              role="radio"
              aria-checked={selected}
              className={cn(
                'group flex flex-col items-center gap-2 border p-2 rounded-sm text-center transition-all',
                selected
                  ? 'border-gold bg-gold/5'
                  : 'border-blush-dark/30 hover:border-gold/60 dark:border-dark-border'
              )}
            >
              <span className="relative w-full aspect-square overflow-hidden rounded-sm bg-champagne dark:bg-dark-border">
                {option.image && (
                  <Image src={option.image} alt={`${option.label} version`} fill sizes="120px" className="object-cover" />
                )}
              </span>
              <span className="text-sm text-charcoal dark:text-ivory">{option.label}</span>
              <span className="text-[11px] text-charcoal-light dark:text-ivory/60">{option.months}</span>
              {prices.size > 1 && <span className="text-xs text-gold">{formatPrice(option.price)}</span>}
              {option.isCurrentSeason && (
                <span className="text-[10px] tracking-widest uppercase text-gold">In season now</span>
              )}
            </Link>
          )
        })}
      </div>
      <p className="text-xs text-charcoal-light mt-3 dark:text-ivory/60">
        Flowers change with the season so every box is fresh and locally sourced.
      </p>
    </div>
  )
}
