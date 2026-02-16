'use client'

import { useState } from 'react'
import { Product } from '@/lib/products'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { useCurrency } from '@/context/CurrencyContext'
import LuxuryButton from '@/components/ui/LuxuryButton'
import DeliveryDateChecker from '@/components/ui/DeliveryDateChecker'

interface ProductInfoProps {
  product: Product
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)
  const { addItem } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const { formatPrice } = useCurrency()
  const inWishlist = isInWishlist(product.id)

  const handleAddToCart = () => {
    addItem(product, quantity)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Category & Wishlist */}
      <div className="flex items-center justify-between">
        <p className="luxury-subheading">{product.category}</p>
        <button
          onClick={() => toggleWishlist(product)}
          className={`p-2 rounded-full border transition-all duration-300 ${
            inWishlist
              ? 'border-gold bg-gold/10 text-gold'
              : 'border-blush-dark/30 text-charcoal-light hover:border-gold hover:text-gold dark:border-dark-border dark:text-ivory/60'
          }`}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg
            className="w-5 h-5"
            fill={inWishlist ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>

      {/* Title & Price */}
      <div>
        <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-charcoal mb-4 dark:text-ivory">
          {product.name}
        </h1>
        <div className="flex items-center gap-3">
          <p className="text-2xl text-gold">{formatPrice(product.price)}</p>
          {product.rating && (
            <div className="flex items-center gap-1 text-sm text-charcoal-light dark:text-ivory/70">
              <svg className="w-4 h-4 text-gold fill-current" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
              </svg>
              <span>{product.rating}</span>
              <span className="text-charcoal-light/50 dark:text-ivory/40">({product.reviewCount} reviews)</span>
            </div>
          )}
        </div>
      </div>

      <div className="w-12 h-px bg-gold" />

      {/* Description */}
      <p className="text-charcoal-light leading-relaxed dark:text-ivory/70">{product.description}</p>

      {/* Story */}
      <div className="bg-champagne/50 p-6 rounded-sm dark:bg-dark-surface">
        <h3 className="font-serif text-lg text-charcoal mb-2 dark:text-ivory">The Story</h3>
        <p className="text-charcoal-light text-sm leading-relaxed dark:text-ivory/70">
          {product.story}
        </p>
      </div>

      {/* Flowers */}
      <div>
        <h3 className="text-xs tracking-widest uppercase text-charcoal-light mb-3 dark:text-ivory/60">
          Featured Blooms
        </h3>
        <div className="flex flex-wrap gap-2">
          {product.flowers.map((flower, index) => (
            <span
              key={index}
              className="text-sm text-charcoal border border-blush-dark/30 px-3 py-1.5 rounded-sm dark:text-ivory dark:border-dark-border"
            >
              {flower}
            </span>
          ))}
        </div>
      </div>

      {/* Luxury Badge */}
      <div className="flex items-center gap-3 bg-ivory border border-gold/30 p-4 rounded-sm dark:bg-dark-surface">
        <svg
          className="w-6 h-6 text-gold flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
          />
        </svg>
        <div>
          <p className="text-sm text-charcoal font-medium dark:text-ivory">
            Luxury Packaging Included
          </p>
          <p className="text-xs text-charcoal-light dark:text-ivory/60">
            Arrives in our signature House of Gul gift box
          </p>
        </div>
      </div>

      {/* Quantity & Add to Cart */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <span className="text-xs tracking-widest uppercase text-charcoal-light dark:text-ivory/60">
            Quantity
          </span>
          <div className="flex items-center border border-blush-dark/30 dark:border-dark-border">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 flex items-center justify-center text-charcoal hover:bg-champagne transition-colors duration-300 dark:text-ivory dark:hover:bg-dark-border"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 12H4"
                />
              </svg>
            </button>
            <span className="w-12 text-center text-charcoal dark:text-ivory">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 flex items-center justify-center text-charcoal hover:bg-champagne transition-colors duration-300 dark:text-ivory dark:hover:bg-dark-border"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>
        </div>

        <LuxuryButton
          variant={isAdded ? 'gold' : 'primary'}
          size="lg"
          className="w-full"
          onClick={handleAddToCart}
        >
          {isAdded ? 'Added to Cart' : 'Add to Cart'}
        </LuxuryButton>
      </div>

      {/* Delivery Info */}
      <div className="flex items-start gap-3 text-sm">
        <svg
          className="w-5 h-5 text-gold flex-shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
          />
        </svg>
        <p className="text-charcoal-light dark:text-ivory/70">{product.deliveryInfo}</p>
      </div>

      {/* Delivery Date Checker */}
      <DeliveryDateChecker />

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-blush-dark/20 dark:border-dark-border">
        <div className="text-center">
          <svg className="w-6 h-6 mx-auto mb-2 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
          <p className="text-xs text-charcoal-light dark:text-ivory/60">Same-Day Delivery</p>
        </div>
        <div className="text-center">
          <svg className="w-6 h-6 mx-auto mb-2 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <p className="text-xs text-charcoal-light dark:text-ivory/60">Freshness Guarantee</p>
        </div>
        <div className="text-center">
          <svg className="w-6 h-6 mx-auto mb-2 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
          </svg>
          <p className="text-xs text-charcoal-light dark:text-ivory/60">Gift Packaging</p>
        </div>
      </div>
    </div>
  )
}
