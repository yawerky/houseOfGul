'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { cn } from '@/lib/utils'
import CartSlideOver from '@/components/cart/CartSlideOver'
import SearchModal from '@/components/ui/SearchModal'
import CurrencySelector from '@/components/ui/CurrencySelector'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { totalItems, toggleCart } = useCart()
  const { totalItems: wishlistCount } = useWishlist()
  const pathname = usePathname()

  // Only use transparent/white navbar on homepage
  const isHomePage = pathname === '/'
  const useWhiteText = isHomePage && !isScrolled

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop' },
    { href: '/gul-club', label: 'Gul Club' },
    { href: '/flower-guide', label: 'Flower Guide' },
    { href: '/events', label: 'Events' },
    { href: '/about', label: 'About' },
    { href: '/blog', label: 'Journal' },
  ]

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          (isScrolled || !isHomePage) ? 'bg-ivory/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'
        )}
      >
        {/* Top Bar */}
        <div className={cn(
          "hidden lg:block border-b transition-colors duration-500",
          useWhiteText ? "border-white/20" : "border-blush-dark/10"
        )}>
          <div className="luxury-container flex justify-between items-center py-2 text-xs">
            <p className={cn(
              "transition-colors duration-500",
              useWhiteText ? "text-white/90" : "text-charcoal-light"
            )}>
              Complimentary delivery on orders over $200
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/track-order"
                className={cn(
                  "hover:text-gold transition-colors",
                  useWhiteText ? "text-white/90" : "text-charcoal-light"
                )}
              >
                Track Order
              </Link>
              <CurrencySelector isScrolled={!useWhiteText} />
            </div>
          </div>
        </div>

        <nav className="luxury-container">
          <div className="flex items-center justify-between h-20 md:h-24">
            {/* Left Section - Logo, Brand Name & Tagline */}
            <Link href="/" className="flex items-center gap-3 md:gap-4">
              <Image
                src="/images/logo.png"
                alt="House of Gul"
                width={80}
                height={80}
                className={cn(
                  "h-12 md:h-16 w-auto object-contain transition-all duration-500",
                  useWhiteText && "brightness-0 invert"
                )}
                priority
              />
              <div className="hidden sm:block">
                <h1 className={cn(
                  "font-serif text-xl md:text-2xl tracking-wide leading-tight transition-colors duration-500",
                  useWhiteText ? "text-white" : "text-charcoal"
                )}>
                  House of Gul
                </h1>
                <p className={cn(
                  "text-[9px] md:text-[10px] tracking-[0.2em] uppercase transition-colors duration-500",
                  useWhiteText ? "text-white/80" : "text-charcoal-light"
                )}>
                  Where Every Bloom Speaks
                </p>
              </div>
            </Link>

            {/* Center - Desktop Navigation */}
            <div className="hidden xl:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm tracking-widest uppercase hover:text-gold transition-colors duration-300",
                    useWhiteText ? "text-white" : "text-charcoal"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Section - Icons */}
            <div className="flex items-center gap-1 md:gap-2">
              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className={cn(
                  "p-2 hover:text-gold transition-colors duration-300",
                  useWhiteText ? "text-white" : "text-charcoal"
                )}
                aria-label="Search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className={cn(
                  "relative p-2 hover:text-gold transition-colors duration-300",
                  useWhiteText ? "text-white" : "text-charcoal"
                )}
                aria-label="Wishlist"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center bg-gold text-white text-[10px] rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button
                onClick={toggleCart}
                className={cn(
                  "relative p-2 hover:text-gold transition-colors duration-300",
                  useWhiteText ? "text-white" : "text-charcoal"
                )}
                aria-label="Open cart"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center bg-gold text-white text-[10px] rounded-full">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={cn(
                  "xl:hidden p-2 transition-colors duration-300",
                  useWhiteText ? "text-white" : "text-charcoal"
                )}
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div
          className={cn(
            'xl:hidden absolute top-full left-0 right-0 bg-ivory/95 backdrop-blur-sm transition-all duration-300 overflow-hidden',
            isMobileMenuOpen ? 'max-h-[400px] border-b border-blush-dark/20' : 'max-h-0'
          )}
        >
          <div className="luxury-container py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-sm tracking-widest uppercase text-charcoal hover:text-gold transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-blush-dark/20 flex items-center gap-4">
              <Link href="/track-order" className="text-sm text-charcoal-light">
                Track Order
              </Link>
              <CurrencySelector />
            </div>
          </div>
        </div>
      </header>

      <CartSlideOver />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}
