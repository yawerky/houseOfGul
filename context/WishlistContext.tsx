'use client'

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { Product } from '@/lib/products'

interface WishlistState {
  items: Product[]
}

type WishlistAction =
  | { type: 'ADD_ITEM'; product: Product }
  | { type: 'REMOVE_ITEM'; productId: string }
  | { type: 'CLEAR_WISHLIST' }
  | { type: 'LOAD_WISHLIST'; items: Product[] }

const initialState: WishlistState = {
  items: [],
}

function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const exists = state.items.some((item) => item.id === action.product.id)
      if (exists) return state
      return { ...state, items: [...state.items, action.product] }
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.productId),
      }
    case 'CLEAR_WISHLIST':
      return { ...state, items: [] }
    case 'LOAD_WISHLIST':
      return { ...state, items: action.items }
    default:
      return state
  }
}

interface WishlistContextType {
  items: Product[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  toggleWishlist: (product: Product) => void
  clearWishlist: () => void
  totalItems: number
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wishlistReducer, initialState)

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('house-of-gul-wishlist')
    if (saved) {
      try {
        const items = JSON.parse(saved)
        dispatch({ type: 'LOAD_WISHLIST', items })
      } catch (e) {
        console.error('Failed to load wishlist:', e)
      }
    }
  }, [])

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('house-of-gul-wishlist', JSON.stringify(state.items))
  }, [state.items])

  const addItem = (product: Product) => {
    dispatch({ type: 'ADD_ITEM', product })
  }

  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', productId })
  }

  const isInWishlist = (productId: string) => {
    return state.items.some((item) => item.id === productId)
  }

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeItem(product.id)
    } else {
      addItem(product)
    }
  }

  const clearWishlist = () => {
    dispatch({ type: 'CLEAR_WISHLIST' })
  }

  return (
    <WishlistContext.Provider
      value={{
        items: state.items,
        addItem,
        removeItem,
        isInWishlist,
        toggleWishlist,
        clearWishlist,
        totalItems: state.items.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    // Return a fallback for SSR/static generation
    return {
      items: [],
      addItem: () => {},
      removeItem: () => {},
      isInWishlist: () => false,
      toggleWishlist: () => {},
      clearWishlist: () => {},
      totalItems: 0,
    }
  }
  return context
}
