'use client'

import { useState } from 'react'
import { useCurrency, Currency } from '@/context/CurrencyContext'
import { cn } from '@/lib/utils'

const currencyOptions: { code: Currency; label: string; symbol: string }[] = [
  { code: 'USD', label: 'USD', symbol: '$' },
  { code: 'GBP', label: 'GBP', symbol: '£' },
  { code: 'EUR', label: 'EUR', symbol: '€' },
  { code: 'INR', label: 'INR', symbol: '₹' },
]

interface CurrencySelectorProps {
  isScrolled?: boolean
}

export default function CurrencySelector({ isScrolled = true }: CurrencySelectorProps) {
  const { currency, setCurrency } = useCurrency()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-1 text-sm hover:text-gold transition-colors duration-300",
          isScrolled ? "text-charcoal" : "text-white/90"
        )}
      >
        <span>{currencyOptions.find((c) => c.code === currency)?.symbol}</span>
        <span>{currency}</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full right-0 mt-2 bg-white shadow-lg rounded-sm overflow-hidden z-50 min-w-[100px]">
            {currencyOptions.map((option) => (
              <button
                key={option.code}
                onClick={() => {
                  setCurrency(option.code)
                  setIsOpen(false)
                }}
                className={cn(
                  'w-full px-4 py-2 text-left text-sm transition-colors duration-300',
                  currency === option.code
                    ? 'bg-gold text-white'
                    : 'text-charcoal hover:bg-champagne'
                )}
              >
                {option.symbol} {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
