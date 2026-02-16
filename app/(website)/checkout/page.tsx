'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { useCurrency } from '@/context/CurrencyContext'
import LuxuryButton from '@/components/ui/LuxuryButton'

const giftWrappingOptions = [
  {
    id: 'signature',
    name: 'Signature Ribbon',
    description: 'Our classic satin ribbon with House of Gul wax seal',
    price: 0,
    image: '/images/gift-ribbon.jpg',
  },
  {
    id: 'deluxe',
    name: 'Deluxe Gift Box',
    description: 'Premium matte black box with gold foil embossing',
    price: 25,
    image: '/images/gift-box.jpg',
  },
  {
    id: 'luxe',
    name: 'Luxe Presentation',
    description: 'Handcrafted wooden keepsake box with velvet lining',
    price: 65,
    image: '/images/gift-luxe.jpg',
  },
]

const deliveryTimeSlots = [
  { id: 'morning', label: 'Morning (9am - 12pm)', price: 0 },
  { id: 'afternoon', label: 'Afternoon (12pm - 5pm)', price: 0 },
  { id: 'evening', label: 'Evening (5pm - 8pm)', price: 10 },
  { id: 'specific', label: 'Specific Hour (+$25)', price: 25 },
]

export default function CheckoutPage() {
  const { state, totalPrice } = useCart()
  const { formatPrice } = useCurrency()
  const [step, setStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
    deliveryDate: '',
    deliveryTimeSlot: 'morning',
    giftMessage: '',
    senderName: '',
    isGift: false,
    giftWrapping: 'signature',
    hidePrice: false,
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setOrderComplete(true)
    setIsProcessing(false)
  }

  if (state.items.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen pt-32 pb-16 bg-ivory">
        <div className="luxury-container">
          <div className="max-w-md mx-auto text-center">
            <h1 className="font-serif text-3xl text-charcoal mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-charcoal-light mb-8">
              Add some beautiful bouquets to your cart before checking out.
            </p>
            <Link href="/shop">
              <LuxuryButton variant="primary">Browse Collection</LuxuryButton>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen pt-32 pb-16 bg-ivory">
        <div className="luxury-container">
          <div className="max-w-lg mx-auto text-center">
            <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-gold/10 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-gold"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl text-charcoal mb-4">
              Thank You for Your Order
            </h1>
            <p className="text-charcoal-light mb-2">
              Your order has been confirmed and will be delivered with care.
            </p>
            <p className="text-sm text-gold mb-8">Order #HOG-2026-0001</p>
            <div className="bg-white p-8 rounded-sm shadow-sm mb-8">
              <p className="text-charcoal-light text-sm mb-4">
                A confirmation email has been sent to{' '}
                <span className="text-charcoal">{formData.email || 'your email'}</span>
              </p>
              <div className="border-t border-blush-dark/20 pt-4">
                <p className="text-xs tracking-widest uppercase text-charcoal-light">
                  Estimated Delivery
                </p>
                <p className="font-serif text-lg text-charcoal mt-1">
                  {formData.deliveryDate || 'Within 24-48 hours'}
                </p>
              </div>
            </div>
            <Link href="/shop">
              <LuxuryButton variant="secondary">Continue Shopping</LuxuryButton>
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
          <p className="luxury-subheading mb-4">Secure Checkout</p>
          <h1 className="font-serif text-3xl md:text-4xl text-charcoal mb-4">
            Complete Your Order
          </h1>
          <div className="luxury-divider" />
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-4">
            {['Shipping', 'Delivery', 'Payment'].map((s, i) => (
              <div key={s} className="flex items-center gap-4">
                <div
                  className={`flex items-center gap-2 ${
                    step > i + 1
                      ? 'text-gold'
                      : step === i + 1
                      ? 'text-charcoal'
                      : 'text-charcoal-light/50'
                  }`}
                >
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                      step > i + 1
                        ? 'bg-gold text-white'
                        : step === i + 1
                        ? 'bg-charcoal text-white'
                        : 'bg-blush-dark/20 text-charcoal-light'
                    }`}
                  >
                    {step > i + 1 ? '✓' : i + 1}
                  </span>
                  <span className="text-sm tracking-widest uppercase hidden sm:inline">
                    {s}
                  </span>
                </div>
                {i < 2 && (
                  <div
                    className={`w-8 sm:w-16 h-px ${
                      step > i + 1 ? 'bg-gold' : 'bg-blush-dark/20'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Shipping */}
              {step === 1 && (
                <div className="bg-white p-8 rounded-sm shadow-sm space-y-6 dark:bg-dark-surface">
                  <h2 className="font-serif text-xl text-charcoal mb-6 dark:text-ivory">
                    Shipping Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs tracking-widest uppercase text-charcoal-light mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="luxury-input"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs tracking-widest uppercase text-charcoal-light mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="luxury-input"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs tracking-widest uppercase text-charcoal-light mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="luxury-input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs tracking-widest uppercase text-charcoal-light mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="luxury-input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs tracking-widest uppercase text-charcoal-light mb-2">
                      Delivery Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="luxury-input"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs tracking-widest uppercase text-charcoal-light mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="luxury-input"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs tracking-widest uppercase text-charcoal-light mb-2">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className="luxury-input"
                        required
                      />
                    </div>
                  </div>

                  <LuxuryButton
                    type="button"
                    variant="primary"
                    className="w-full mt-6"
                    onClick={() => setStep(2)}
                  >
                    Continue to Delivery
                  </LuxuryButton>
                </div>
              )}

              {/* Step 2: Delivery */}
              {step === 2 && (
                <div className="bg-white p-8 rounded-sm shadow-sm space-y-6 dark:bg-dark-surface">
                  <h2 className="font-serif text-xl text-charcoal mb-6 dark:text-ivory">
                    Delivery Options
                  </h2>

                  {/* Delivery Date */}
                  <div>
                    <label className="block text-xs tracking-widest uppercase text-charcoal-light mb-2 dark:text-ivory/70">
                      Preferred Delivery Date
                    </label>
                    <input
                      type="date"
                      name="deliveryDate"
                      value={formData.deliveryDate}
                      onChange={handleInputChange}
                      className="luxury-input"
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>

                  {/* Delivery Time Slot */}
                  <div>
                    <label className="block text-xs tracking-widest uppercase text-charcoal-light mb-3 dark:text-ivory/70">
                      Delivery Time Slot
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {deliveryTimeSlots.map((slot) => (
                        <label
                          key={slot.id}
                          className={`border p-3 rounded-sm cursor-pointer transition-all ${
                            formData.deliveryTimeSlot === slot.id
                              ? 'border-gold bg-gold/5'
                              : 'border-blush-dark/20 hover:border-gold/50 dark:border-dark-border'
                          }`}
                        >
                          <input
                            type="radio"
                            name="deliveryTimeSlot"
                            value={slot.id}
                            checked={formData.deliveryTimeSlot === slot.id}
                            onChange={handleInputChange}
                            className="sr-only"
                          />
                          <span className="text-sm text-charcoal dark:text-ivory">{slot.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Gift Options */}
                  <div className="border-t border-blush-dark/20 pt-6 dark:border-dark-border">
                    <div className="border border-blush-dark/20 p-4 rounded-sm dark:border-dark-border">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="isGift"
                          checked={formData.isGift}
                          onChange={handleInputChange}
                          className="w-5 h-5 border-blush-dark/30 text-gold focus:ring-gold rounded"
                        />
                        <div>
                          <span className="text-charcoal dark:text-ivory">This is a gift</span>
                          <p className="text-xs text-charcoal-light mt-1 dark:text-ivory/60">
                            Add special gift wrapping and a personalized note card
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {formData.isGift && (
                    <>
                      {/* Gift Wrapping Options */}
                      <div>
                        <label className="block text-xs tracking-widest uppercase text-charcoal-light mb-3 dark:text-ivory/70">
                          Gift Wrapping
                        </label>
                        <div className="space-y-3">
                          {giftWrappingOptions.map((option) => (
                            <label
                              key={option.id}
                              className={`flex items-center gap-4 border p-4 rounded-sm cursor-pointer transition-all ${
                                formData.giftWrapping === option.id
                                  ? 'border-gold bg-gold/5'
                                  : 'border-blush-dark/20 hover:border-gold/50 dark:border-dark-border'
                              }`}
                            >
                              <input
                                type="radio"
                                name="giftWrapping"
                                value={option.id}
                                checked={formData.giftWrapping === option.id}
                                onChange={handleInputChange}
                                className="sr-only"
                              />
                              <div className="w-16 h-16 bg-champagne rounded-sm flex-shrink-0 flex items-center justify-center dark:bg-dark-border">
                                <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                                </svg>
                              </div>
                              <div className="flex-1">
                                <p className="text-charcoal font-medium dark:text-ivory">{option.name}</p>
                                <p className="text-xs text-charcoal-light dark:text-ivory/60">{option.description}</p>
                              </div>
                              <span className="text-gold font-medium">
                                {option.price === 0 ? 'Free' : `+${formatPrice(option.price)}`}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Hide Price Option */}
                      <div className="border border-blush-dark/20 p-4 rounded-sm dark:border-dark-border">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            name="hidePrice"
                            checked={formData.hidePrice}
                            onChange={handleInputChange}
                            className="w-5 h-5 border-blush-dark/30 text-gold focus:ring-gold rounded"
                          />
                          <span className="text-charcoal dark:text-ivory">
                            Hide price on delivery note
                          </span>
                        </label>
                      </div>

                      {/* Gift Message */}
                      <div>
                        <label className="block text-xs tracking-widest uppercase text-charcoal-light mb-2 dark:text-ivory/70">
                          Your Name (for the card)
                        </label>
                        <input
                          type="text"
                          name="senderName"
                          value={formData.senderName}
                          onChange={handleInputChange}
                          className="luxury-input"
                          placeholder="From..."
                        />
                      </div>

                      <div>
                        <label className="block text-xs tracking-widest uppercase text-charcoal-light mb-2 dark:text-ivory/70">
                          Personal Message
                        </label>
                        <textarea
                          name="giftMessage"
                          value={formData.giftMessage}
                          onChange={handleInputChange}
                          rows={4}
                          maxLength={200}
                          className="luxury-input resize-none"
                          placeholder="Write your heartfelt message here..."
                        />
                        <p className="text-xs text-charcoal-light mt-1 dark:text-ivory/50">
                          {formData.giftMessage.length}/200 characters
                        </p>
                      </div>

                      {/* Note Card Preview */}
                      {(formData.giftMessage || formData.senderName) && (
                        <div>
                          <label className="block text-xs tracking-widest uppercase text-charcoal-light mb-3 dark:text-ivory/70">
                            Card Preview
                          </label>
                          <div className="relative bg-ivory p-6 rounded-sm border border-gold/30 shadow-lg dark:bg-charcoal">
                            <div className="absolute top-2 right-2">
                              <svg className="w-8 h-8 text-gold/30" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                              </svg>
                            </div>
                            <div className="text-center mb-4">
                              <p className="text-[10px] tracking-[0.3em] uppercase text-gold">House of Gul</p>
                            </div>
                            <p className="font-serif text-charcoal text-center italic leading-relaxed dark:text-ivory">
                              &ldquo;{formData.giftMessage || 'Your message will appear here...'}&rdquo;
                            </p>
                            {formData.senderName && (
                              <p className="text-right text-sm text-charcoal-light mt-4 dark:text-ivory/70">
                                — {formData.senderName}
                              </p>
                            )}
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                              <div className="w-8 h-px bg-gold/50" />
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  <div className="flex gap-4 mt-6">
                    <LuxuryButton
                      type="button"
                      variant="secondary"
                      onClick={() => setStep(1)}
                    >
                      Back
                    </LuxuryButton>
                    <LuxuryButton
                      type="button"
                      variant="primary"
                      className="flex-1"
                      onClick={() => setStep(3)}
                    >
                      Continue to Payment
                    </LuxuryButton>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {step === 3 && (
                <div className="bg-white p-8 rounded-sm shadow-sm space-y-6 dark:bg-dark-surface">
                  <h2 className="font-serif text-xl text-charcoal mb-6 dark:text-ivory">
                    Payment Details
                  </h2>

                  <div>
                    <label className="block text-xs tracking-widest uppercase text-charcoal-light mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="luxury-input"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs tracking-widest uppercase text-charcoal-light mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="luxury-input"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs tracking-widest uppercase text-charcoal-light mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        className="luxury-input"
                        required
                      />
                    </div>
                  </div>

                  <div className="bg-champagne/50 p-4 rounded-sm">
                    <div className="flex items-center gap-3">
                      <svg
                        className="w-5 h-5 text-gold"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                      <p className="text-xs text-charcoal-light">
                        Your payment is secured with 256-bit SSL encryption
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <LuxuryButton
                      type="button"
                      variant="secondary"
                      onClick={() => setStep(2)}
                    >
                      Back
                    </LuxuryButton>
                    <LuxuryButton
                      type="submit"
                      variant="gold"
                      className="flex-1"
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Processing...' : `Pay ${formatPrice(
                        totalPrice +
                        (totalPrice >= 200 ? 0 : 15) +
                        (formData.isGift ? (giftWrappingOptions.find(o => o.id === formData.giftWrapping)?.price || 0) : 0) +
                        (deliveryTimeSlots.find(s => s.id === formData.deliveryTimeSlot)?.price || 0)
                      )}`}
                    </LuxuryButton>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-sm shadow-sm sticky top-32 dark:bg-dark-surface">
              <h2 className="font-serif text-lg text-charcoal mb-6 dark:text-ivory">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                {state.items.map((item) => (
                  <div key={item.product.id} className="flex gap-4">
                    <div className="relative w-16 h-16 rounded-sm overflow-hidden bg-champagne flex-shrink-0 dark:bg-dark-border">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-charcoal text-ivory text-xs flex items-center justify-center rounded-full">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-charcoal truncate dark:text-ivory">
                        {item.product.name}
                      </p>
                      <p className="text-sm text-gold">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-blush-dark/20 pt-4 space-y-2 dark:border-dark-border">
                <div className="flex justify-between text-sm">
                  <span className="text-charcoal-light dark:text-ivory/70">Subtotal</span>
                  <span className="text-charcoal dark:text-ivory">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-charcoal-light dark:text-ivory/70">Shipping</span>
                  <span className="text-charcoal dark:text-ivory">
                    {totalPrice >= 200 ? (
                      <span className="text-gold">Free</span>
                    ) : (
                      formatPrice(15)
                    )}
                  </span>
                </div>
                {formData.isGift && (
                  <div className="flex justify-between text-sm">
                    <span className="text-charcoal-light dark:text-ivory/70">
                      Gift Wrapping ({giftWrappingOptions.find(o => o.id === formData.giftWrapping)?.name})
                    </span>
                    <span className="text-charcoal dark:text-ivory">
                      {giftWrappingOptions.find(o => o.id === formData.giftWrapping)?.price === 0 ? (
                        <span className="text-gold">Free</span>
                      ) : (
                        formatPrice(giftWrappingOptions.find(o => o.id === formData.giftWrapping)?.price || 0)
                      )}
                    </span>
                  </div>
                )}
                {deliveryTimeSlots.find(s => s.id === formData.deliveryTimeSlot)?.price !== undefined &&
                 deliveryTimeSlots.find(s => s.id === formData.deliveryTimeSlot)!.price > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-charcoal-light dark:text-ivory/70">Priority Delivery</span>
                    <span className="text-charcoal dark:text-ivory">
                      {formatPrice(deliveryTimeSlots.find(s => s.id === formData.deliveryTimeSlot)?.price || 0)}
                    </span>
                  </div>
                )}
              </div>

              <div className="border-t border-blush-dark/20 pt-4 mt-4 dark:border-dark-border">
                <div className="flex justify-between">
                  <span className="text-charcoal font-medium dark:text-ivory">Total</span>
                  <span className="font-serif text-xl text-gold">
                    {formatPrice(
                      totalPrice +
                      (totalPrice >= 200 ? 0 : 15) +
                      (formData.isGift ? (giftWrappingOptions.find(o => o.id === formData.giftWrapping)?.price || 0) : 0) +
                      (deliveryTimeSlots.find(s => s.id === formData.deliveryTimeSlot)?.price || 0)
                    )}
                  </span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-4 border-t border-blush-dark/20 dark:border-dark-border">
                <div className="flex items-center justify-center gap-4 text-charcoal-light dark:text-ivory/60">
                  <div className="flex flex-col items-center">
                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="text-[10px]">Secure</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="text-[10px]">Protected</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <span className="text-[10px]">Encrypted</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
