'use client'

import Link from 'next/link'
import { useWishlist } from '@/context/WishlistContext'
import ProductCard from '@/components/shop/ProductCard'
import LuxuryButton from '@/components/ui/LuxuryButton'
import SectionWrapper from '@/components/ui/SectionWrapper'

export default function WishlistPage() {
  const { items, clearWishlist } = useWishlist()

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-16 bg-ivory">
        <div className="luxury-container">
          <div className="max-w-md mx-auto text-center">
            <svg
              className="w-20 h-20 mx-auto text-blush-dark/50 mb-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <h1 className="font-serif text-3xl text-charcoal mb-4">
              Your Wishlist is Empty
            </h1>
            <p className="text-charcoal-light mb-8">
              Save your favorite bouquets to revisit them later.
            </p>
            <Link href="/shop">
              <LuxuryButton variant="primary">Browse Collection</LuxuryButton>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-28 pb-16 bg-ivory">
      <div className="luxury-container">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="luxury-subheading mb-4">Your Favorites</p>
          <h1 className="font-serif text-3xl md:text-4xl text-charcoal mb-4">
            Wishlist
          </h1>
          <div className="luxury-divider" />
        </div>

        <div className="flex justify-between items-center mb-8">
          <p className="text-charcoal-light">
            {items.length} {items.length === 1 ? 'item' : 'items'} saved
          </p>
          <button
            onClick={clearWishlist}
            className="text-sm text-charcoal-light hover:text-gold transition-colors duration-300"
          >
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  )
}
