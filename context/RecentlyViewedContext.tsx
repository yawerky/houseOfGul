'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { Product } from '@/lib/products'

const MAX_RECENTLY_VIEWED = 8

interface RecentlyViewedContextType {
  items: Product[]
  addItem: (product: Product) => void
  clearItems: () => void
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined)

export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('house-of-gul-recently-viewed')
    if (saved) {
      try {
        setItems(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load recently viewed:', e)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('house-of-gul-recently-viewed', JSON.stringify(items))
  }, [items])

  const addItem = useCallback((product: Product) => {
    setItems((prev) => {
      const filtered = prev.filter((item) => item.id !== product.id)
      const updated = [product, ...filtered].slice(0, MAX_RECENTLY_VIEWED)
      return updated
    })
  }, [])

  const clearItems = useCallback(() => {
    setItems([])
  }, [])

  return (
    <RecentlyViewedContext.Provider value={{ items, addItem, clearItems }}>
      {children}
    </RecentlyViewedContext.Provider>
  )
}

export function useRecentlyViewed() {
  const context = useContext(RecentlyViewedContext)
  if (!context) {
    // Return a fallback for SSR/static generation
    return {
      items: [],
      addItem: () => {},
      clearItems: () => {},
    }
  }
  return context
}
