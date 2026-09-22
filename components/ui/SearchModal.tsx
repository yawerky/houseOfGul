'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCurrency } from '@/context/CurrencyContext'
import { cn } from '@/lib/utils'

interface SearchResult {
  id: string
  name: string
  price: number
  category: string
  occasion: string | null
  image: string | null
  slug: string
}

interface FilterOption {
  name: string
  slug: string
}

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState({
    category: '',
    occasion: '',
    minPrice: 0,
    maxPrice: 100000,
  })
  const [results, setResults] = useState<SearchResult[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [categories, setCategories] = useState<FilterOption[]>([])
  const [occasions, setOccasions] = useState<FilterOption[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { formatPrice } = useCurrency()

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Debounced search function
  const searchProducts = useCallback(async () => {
    if (!query && !filters.category && !filters.occasion) {
      setResults([])
      setSuggestions([])
      return
    }

    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (query) params.set('q', query)
      if (filters.category) params.set('category', filters.category)
      if (filters.occasion) params.set('occasion', filters.occasion)
      if (filters.minPrice > 0) params.set('minPrice', filters.minPrice.toString())
      if (filters.maxPrice < 100000) params.set('maxPrice', filters.maxPrice.toString())

      const response = await fetch(`/api/search?${params.toString()}`)
      const data = await response.json()

      setResults(data.results || [])
      setSuggestions(data.suggestions || [])
      if (data.filters?.categories) setCategories(data.filters.categories)
      if (data.filters?.occasions) setOccasions(data.filters.occasions)
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [query, filters])

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(searchProducts, 300)
    return () => clearTimeout(timer)
  }, [searchProducts])

  const handleClose = () => {
    setQuery('')
    setResults([])
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-charcoal/50 backdrop-blur-sm z-50 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={cn(
          'fixed top-0 left-0 right-0 bg-ivory z-50 transition-all duration-500 max-h-[90vh] overflow-hidden',
          isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        )}
      >
        <div className="luxury-container py-6">
          {/* Search Input */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-light"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search bouquets, flowers, occasions..."
                className="w-full pl-12 pr-4 py-4 bg-white border border-blush-dark/20 rounded-sm text-charcoal placeholder:text-charcoal-light/50 focus:outline-none focus:border-gold text-lg"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                'p-4 border rounded-sm transition-colors duration-300',
                showFilters ? 'bg-gold border-gold text-white' : 'border-blush-dark/20 text-charcoal hover:border-gold'
              )}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </button>
            <button onClick={handleClose} className="p-4 text-charcoal hover:text-gold transition-colors duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && query && (
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="text-xs text-charcoal-light">Suggestions:</span>
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setQuery(suggestion)}
                  className="text-xs px-2 py-1 bg-champagne text-charcoal rounded-sm hover:bg-gold hover:text-white transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-champagne/50 rounded-sm">
              <div>
                <label className="block text-xs tracking-widest uppercase text-charcoal-light mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="w-full p-2 bg-white border border-blush-dark/20 rounded-sm text-charcoal focus:outline-none focus:border-gold"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.slug} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-charcoal-light mb-2">Occasion</label>
                <select
                  value={filters.occasion}
                  onChange={(e) => setFilters({ ...filters, occasion: e.target.value })}
                  className="w-full p-2 bg-white border border-blush-dark/20 rounded-sm text-charcoal focus:outline-none focus:border-gold"
                >
                  <option value="">All Occasions</option>
                  {occasions.map((occ) => (
                    <option key={occ.slug} value={occ.name}>{occ.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-charcoal-light mb-2">Min Price (₹)</label>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({ ...filters, minPrice: Number(e.target.value) })}
                  className="w-full p-2 bg-white border border-blush-dark/20 rounded-sm text-charcoal focus:outline-none focus:border-gold"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-charcoal-light mb-2">Max Price (₹)</label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                  className="w-full p-2 bg-white border border-blush-dark/20 rounded-sm text-charcoal focus:outline-none focus:border-gold"
                  placeholder="100000"
                />
              </div>
            </div>
          )}

          {/* Results */}
          <div className="max-h-[50vh] overflow-y-auto">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="inline-block w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                <p className="text-charcoal-light mt-2">Searching...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    onClick={handleClose}
                    className="group flex flex-col bg-white rounded-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="relative aspect-square bg-champagne">
                      {product.image ? (
                        <Image src={product.image} alt={product.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-charcoal-light">
                          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="font-serif text-sm text-charcoal group-hover:text-gold transition-colors duration-300 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-xs text-charcoal-light">{product.category}</p>
                      <p className="text-sm text-gold font-medium">{formatPrice(product.price)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : query ? (
              <p className="text-center text-charcoal-light py-8">No results found for "{query}"</p>
            ) : (
              <div className="text-center py-8">
                <p className="text-charcoal-light mb-4">Popular Searches in Jaipur</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {['Roses', 'Birthday', 'Anniversary', 'Wedding', 'Bouquets'].map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-4 py-2 bg-champagne text-charcoal rounded-sm hover:bg-gold hover:text-white transition-colors duration-300"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
