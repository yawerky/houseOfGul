'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Currency = 'USD' | 'GBP' | 'EUR' | 'INR'

interface CurrencyInfo {
  code: Currency
  symbol: string
  rate: number
}

const currencies: Record<Currency, CurrencyInfo> = {
  USD: { code: 'USD', symbol: '$', rate: 1 },
  GBP: { code: 'GBP', symbol: '£', rate: 0.79 },
  EUR: { code: 'EUR', symbol: '€', rate: 0.92 },
  INR: { code: 'INR', symbol: '₹', rate: 83 },
}

interface CurrencyContextType {
  currency: Currency
  currencyInfo: CurrencyInfo
  setCurrency: (currency: Currency) => void
  formatPrice: (priceInUSD: number) => string
  convertPrice: (priceInUSD: number) => number
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('USD')

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

  const convertPrice = (priceInUSD: number): number => {
    return Math.round(priceInUSD * currencyInfo.rate)
  }

  const formatPrice = (priceInUSD: number): string => {
    const converted = convertPrice(priceInUSD)
    return `${currencyInfo.symbol}${converted.toLocaleString()}`
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
    const defaultCurrency = currencies.USD
    return {
      currency: 'USD' as Currency,
      currencyInfo: defaultCurrency,
      setCurrency: () => {},
      formatPrice: (priceInUSD: number) => `$${priceInUSD.toLocaleString()}`,
      convertPrice: (priceInUSD: number) => priceInUSD,
    }
  }
  return context
}
