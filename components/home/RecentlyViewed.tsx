'use client'

import { useRecentlyViewed } from '@/context/RecentlyViewedContext'
import ProductCard from '@/components/shop/ProductCard'
import SectionWrapper from '@/components/ui/SectionWrapper'

export default function RecentlyViewed() {
  const { items } = useRecentlyViewed()

  if (items.length === 0) return null

  return (
    <SectionWrapper background="champagne">
      <div className="text-center mb-12">
        <p className="luxury-subheading mb-4">Continue Exploring</p>
        <h2 className="font-serif text-3xl md:text-4xl text-charcoal mb-4">
          Recently Viewed
        </h2>
        <div className="luxury-divider" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {items.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </SectionWrapper>
  )
}
