'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/lib/products'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { useCurrency } from '@/context/CurrencyContext'
import LuxuryButton from './LuxuryButton'
import { cn } from '@/lib/utils'

interface QuickViewModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

export default function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const { addItem } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const { formatPrice } = useCurrency()

  if (!product) return null

  const handleAddToCart = () => {
    addItem(product, quantity)
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
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={cn(
          'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto bg-ivory rounded-sm shadow-2xl z-50 transition-all duration-500',
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        )}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-charcoal hover:text-gold transition-colors duration-300"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Gallery */}
          <div className="p-6">
            <div className="relative aspect-square rounded-sm overflow-hidden bg-champagne mb-4">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={cn(
                    'relative aspect-square rounded-sm overflow-hidden transition-all duration-300',
                    selectedImage === index ? 'ring-2 ring-gold' : 'ring-1 ring-blush-dark/20'
                  )}
                >
                  <Image src={image} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="p-6 md:p-8 flex flex-col">
            <p className="text-xs tracking-widest uppercase text-charcoal-light mb-2">
              {product.category}
            </p>
            <h2 className="font-serif text-2xl md:text-3xl text-charcoal mb-2">
              {product.name}
            </h2>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={cn('w-4 h-4', i < Math.floor(product.rating) ? 'text-gold' : 'text-blush-dark/30')}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-charcoal-light">({product.reviewCount} reviews)</span>
            </div>

            <p className="text-2xl text-gold mb-4">{formatPrice(product.price)}</p>
            <p className="text-charcoal-light leading-relaxed mb-6">{product.description}</p>

            {/* Flowers */}
            <div className="mb-6">
              <p className="text-xs tracking-widest uppercase text-charcoal-light mb-2">Featured Blooms</p>
              <div className="flex flex-wrap gap-2">
                {product.flowers.slice(0, 3).map((flower, index) => (
                  <span key={index} className="text-xs text-charcoal bg-champagne px-2 py-1 rounded-sm">
                    {flower}
                  </span>
                ))}
              </div>
            </div>

            {/* Quantity & Actions */}
            <div className="mt-auto space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-xs tracking-widest uppercase text-charcoal-light">Qty</span>
                <div className="flex items-center border border-blush-dark/30">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-charcoal hover:bg-champagne"
                  >
                    -
                  </button>
                  <span className="w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center text-charcoal hover:bg-champagne"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => toggleWishlist(product)}
                  className="p-2 text-charcoal hover:text-gold transition-colors duration-300"
                >
                  <svg
                    className="w-6 h-6"
                    fill={isInWishlist(product.id) ? 'currentColor' : 'none'}
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

              <LuxuryButton variant="primary" className="w-full" onClick={handleAddToCart}>
                Add to Cart
              </LuxuryButton>

              <Link href={`/product/${product.id}`} onClick={onClose}>
                <LuxuryButton variant="ghost" className="w-full">
                  View Full Details
                </LuxuryButton>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
