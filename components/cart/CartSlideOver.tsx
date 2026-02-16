'use client'

import { useCart } from '@/context/CartContext'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import LuxuryButton from '@/components/ui/LuxuryButton'

export default function CartSlideOver() {
  const { state, closeCart, removeItem, updateQuantity, totalPrice } = useCart()

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-charcoal/30 backdrop-blur-sm z-50 transition-opacity duration-300',
          state.isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={closeCart}
      />

      {/* Slide-over panel */}
      <div
        className={cn(
          'fixed top-0 right-0 h-full w-full sm:w-[420px] bg-ivory z-50 shadow-2xl transition-transform duration-500 ease-out',
          state.isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-blush-dark/20">
            <h2 className="font-serif text-xl text-charcoal">Your Selection</h2>
            <button
              onClick={closeCart}
              className="p-2 text-charcoal hover:text-gold transition-colors duration-300"
              aria-label="Close cart"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {state.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <svg
                  className="w-16 h-16 text-blush-dark/50 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <p className="font-serif text-lg text-charcoal mb-2">
                  Your cart is empty
                </p>
                <p className="text-sm text-charcoal-light mb-6">
                  Discover our curated collection of luxury bouquets
                </p>
                <LuxuryButton variant="secondary" onClick={closeCart}>
                  <Link href="/shop">Browse Collection</Link>
                </LuxuryButton>
              </div>
            ) : (
              <div className="space-y-6">
                {state.items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-4 pb-6 border-b border-blush-dark/10"
                  >
                    {/* Product Image */}
                    <div className="relative w-24 h-24 rounded-sm overflow-hidden bg-champagne flex-shrink-0">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-serif text-sm text-charcoal mb-1">
                            {item.product.name}
                          </h3>
                          <p className="text-sm text-gold">
                            {formatPrice(item.product.price)}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="p-1 text-charcoal-light hover:text-charcoal transition-colors duration-300"
                          aria-label="Remove item"
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
                              strokeWidth={1.5}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 mt-3">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="w-7 h-7 flex items-center justify-center border border-blush-dark/30 text-charcoal hover:border-gold transition-colors duration-300"
                        >
                          <svg
                            className="w-3 h-3"
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
                        <span className="text-sm text-charcoal w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="w-7 h-7 flex items-center justify-center border border-blush-dark/30 text-charcoal hover:border-gold transition-colors duration-300"
                        >
                          <svg
                            className="w-3 h-3"
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
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {state.items.length > 0 && (
            <div className="border-t border-blush-dark/20 px-6 py-6 space-y-4 bg-white">
              <div className="flex justify-between items-center">
                <span className="text-sm tracking-widest uppercase text-charcoal-light">
                  Subtotal
                </span>
                <span className="font-serif text-lg text-charcoal">
                  {formatPrice(totalPrice)}
                </span>
              </div>
              <p className="text-xs text-charcoal-light">
                Shipping and gift wrapping calculated at checkout
              </p>
              <Link href="/checkout" onClick={closeCart}>
                <LuxuryButton variant="primary" className="w-full">
                  Proceed to Checkout
                </LuxuryButton>
              </Link>
              <Link href="/cart" onClick={closeCart}>
                <LuxuryButton variant="ghost" className="w-full">
                  View Full Cart
                </LuxuryButton>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
