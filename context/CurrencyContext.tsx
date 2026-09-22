'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Currency = 'USD' | 'GBP' | 'EUR' | 'INR'

interface CurrencyInfo {
  code: Currency
  symbol: string
  rate: number
}

// All product prices are stored in INR. Other currencies are display-only
// approximations for overseas customers sending gifts to Jaipur.
const currencies: Record<Currency, CurrencyInfo> = {
  INR: { code: 'INR', symbol: '₹', rate: 1 },
  USD: { code: 'USD', symbol: '$', rate: 1 / 83 },
  GBP: { code: 'GBP', symbol: '£', rate: 1 / 105 },
  EUR: { code: 'EUR', symbol: '€', rate: 1 / 90 },
}

const localeFor = (currency: Currency) => (currency === 'INR' ? 'en-IN' : 'en-US')

interface CurrencyContextType {
  currency: Currency
  currencyInfo: CurrencyInfo
  setCurrency: (currency: Currency) => void
  formatPrice: (priceInINR: number) => string
  convertPrice: (priceInINR: number) => number
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('INR')

  useEffect(() => {
    const saved = localStorage.getItem('house-of-gul-currency') as Currency
    if (saved && currencies[saved]) {
      setCurrencyState(saved)
    }
  }, [])

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency)
    localStorage.setItem('house-of-gul-currency', newCurrency)
  }

  const currencyInfo = currencies[currency]

  const convertPrice = (priceInINR: number): number => {
    return Math.round(priceInINR * currencyInfo.rate)
  }

  const formatPrice = (priceInINR: number): string => {
    const converted = convertPrice(priceInINR)
    return `${currencyInfo.symbol}${converted.toLocaleString(localeFor(currency))}`
  }

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        currencyInfo,
        setCurrency,
        formatPrice,
        convertPrice,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (!context) {
    // Return a fallback for SSR/static generation
    const defaultCurrency = currencies.INR
    return {
      currency: 'INR' as Currency,
      currencyInfo: defaultCurrency,
      setCurrency: () => {},
      formatPrice: (priceInINR: number) => `₹${priceInINR.toLocaleString('en-IN')}`,
      convertPrice: (priceInINR: number) => priceInINR,
    }
  }
  return context
}
