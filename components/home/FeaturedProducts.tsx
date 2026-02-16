'use client'

import { useEffect, useState } from 'react'
import { Product } from '@/lib/products'
import ProductCard from '@/components/shop/ProductCard'
import SectionWrapper from '@/components/ui/SectionWrapper'
import Link from 'next/link'
import LuxuryButton from '@/components/ui/LuxuryButton'
import ScrollReveal from '@/components/ui/ScrollReveal'

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    fetch('/api/products?featured=true&limit=8')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(() => setProducts([]))
  }, [])

  return (
    <SectionWrapper background="ivory">
      <ScrollReveal animation="fade-up">
        <div className="text-center mb-12 md:mb-16">
          <p className="luxury-subheading mb-4">The Collection</p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-charcoal mb-4">
            Signature Bouquets
          </h2>
          <div className="luxury-divider" />
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {products.map((product, index) => (
          <ScrollReveal
            key={product.id}
            animation="fade-up"
            delay={index * 150}
            duration={900}
          >
            <ProductCard product={product} />
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal animation="fade-up" delay={200}>
        <div className="text-center mt-12 md:mt-16">
          <Link href="/shop">
            <LuxuryButton variant="secondary">View All Bouquets</LuxuryButton>
          </Link>
        </div>
      </ScrollReveal>
    </SectionWrapper>
  )
}
