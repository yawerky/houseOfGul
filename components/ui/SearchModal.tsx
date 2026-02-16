'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { searchProducts, occasions, seasons, Product } from '@/lib/products'
import { useCurrency } from '@/context/CurrencyContext'
import { cn } from '@/lib/utils'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState({
    occasion: '',
    season: '',
    minPrice: 0,
    maxPrice: 500,
  })
  const [results, setResults] = useState<Product[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { formatPrice } = useCurrency()

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (query || filters.occasion || filters.season) {
      const searchResults = searchProducts(query, {
        occasion: filters.occasion || undefined,
        season: filters.season || undefined,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
      })
      setResults(searchResults)
    } else {
      setResults([])
    }
  }, [query, filters])

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

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-champagne/50 rounded-sm">
              <div>
                <label className="block text-xs tracking-widest uppercase text-charcoal-light mb-2">Occasion</label>
                <select
                  value={filters.occasion}
                  onChange={(e) => setFilters({ ...filters, occasion: e.target.value })}
                  className="w-full p-2 bg-white border border-blush-dark/20 rounded-sm text-charcoal focus:outline-none focus:border-gold"
                >
                  <option value="">All Occasions</option>
                  {occasions.map((occ) => (
                    <option key={occ.id} value={occ.id}>{occ.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-charcoal-light mb-2">Season</label>
                <select
                  value={filters.season}
                  onChange={(e) => setFilters({ ...filters, season: e.target.value })}
                  className="w-full p-2 bg-white border border-blush-dark/20 rounded-sm text-charcoal focus:outline-none focus:border-gold"
                >
                  <option value="">All Seasons</option>
                  {seasons.map((s) => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-charcoal-light mb-2">Min Price</label>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({ ...filters, minPrice: Number(e.target.value) })}
                  className="w-full p-2 bg-white border border-blush-dark/20 rounded-sm text-charcoal focus:outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-charcoal-light mb-2">Max Price</label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                  className="w-full p-2 bg-white border border-blush-dark/20 rounded-sm text-charcoal focus:outline-none focus:border-gold"
                />
              </div>
            </div>
          )}

          {/* Results */}
          <div className="max-h-[50vh] overflow-y-auto">
            {results.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    onClick={handleClose}
                    className="group flex flex-col bg-white rounded-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="relative aspect-square">
                      <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                    </div>
                    <div className="p-3">
                      <h3 className="font-serif text-sm text-charcoal group-hover:text-gold transition-colors duration-300">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gold">{formatPrice(product.price)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : query ? (
              <p className="text-center text-charcoal-light py-8">No results found for "{query}"</p>
            ) : (
              <div className="text-center py-8">
                <p className="text-charcoal-light mb-4">Popular Searches</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {['Roses', 'Wedding', 'Birthday', 'Peonies', 'Anniversary'].map((term) => (
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
