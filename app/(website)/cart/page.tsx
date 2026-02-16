'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils'
import LuxuryButton from '@/components/ui/LuxuryButton'
import SectionWrapper from '@/components/ui/SectionWrapper'

export default function CartPage() {
  const { state, removeItem, updateQuantity, totalPrice } = useCart()

  if (state.items.length === 0) {
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
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h1 className="font-serif text-3xl text-charcoal mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-charcoal-light mb-8">
              Discover our curated collection of luxury bouquets and find the
              perfect arrangement for any occasion.
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
          <p className="luxury-subheading mb-4">Your Selection</p>
          <h1 className="font-serif text-3xl md:text-4xl text-charcoal mb-4">
            Shopping Cart
          </h1>
          <div className="luxury-divider" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {state.items.map((item) => (
              <div
                key={item.product.id}
                className="bg-white p-6 rounded-sm shadow-sm"
              >
                <div className="flex gap-6">
                  {/* Image */}
                  <div className="relative w-32 h-32 rounded-sm overflow-hidden bg-champagne flex-shrink-0">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <Link
                          href={`/product/${item.product.id}`}
                          className="font-serif text-lg text-charcoal hover:text-gold transition-colors duration-300"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-sm text-charcoal-light">
                          {item.product.category}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="p-2 text-charcoal-light hover:text-charcoal transition-colors duration-300"
                        aria-label="Remove item"
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

                    <div className="flex items-end justify-between mt-4">
                      {/* Quantity */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="w-8 h-8 flex items-center justify-center border border-blush-dark/30 text-charcoal hover:border-gold transition-colors duration-300"
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
                        <span className="text-charcoal w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="w-8 h-8 flex items-center justify-center border border-blush-dark/30 text-charcoal hover:border-gold transition-colors duration-300"
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

                      {/* Price */}
                      <p className="font-serif text-lg text-gold">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-sm shadow-sm sticky top-32">
              <h2 className="font-serif text-xl text-charcoal mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-charcoal-light">Subtotal</span>
                  <span className="text-charcoal">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-charcoal-light">Shipping</span>
                  <span className="text-charcoal">Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-charcoal-light">Gift Wrapping</span>
                  <span className="text-gold">Complimentary</span>
                </div>
              </div>

              <div className="border-t border-blush-dark/20 pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-charcoal font-medium">Total</span>
                  <span className="font-serif text-xl text-gold">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
              </div>

              <Link href="/checkout">
                <LuxuryButton variant="primary" className="w-full mb-4">
                  Proceed to Checkout
                </LuxuryButton>
              </Link>

              <Link href="/shop">
                <LuxuryButton variant="ghost" className="w-full">
                  Continue Shopping
                </LuxuryButton>
              </Link>

              {/* Luxury Note */}
              <div className="mt-6 p-4 bg-champagne/50 rounded-sm">
                <div className="flex items-start gap-3">
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
                      d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                    />
                  </svg>
                  <p className="text-xs text-charcoal-light">
                    All orders include our signature luxury packaging and a
                    handwritten care card.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
