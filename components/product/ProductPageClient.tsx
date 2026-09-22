'use client'

import { useEffect } from 'react'
import { Product } from '@/lib/products'
import { useRecentlyViewed } from '@/context/RecentlyViewedContext'
import ProductGallery from './ProductGallery'
import ProductInfo from './ProductInfo'
import type { SeasonOption } from './SeasonPicker'

interface ProductPageClientProps {
  product: Product
  seasonOptions?: SeasonOption[]
}

export default function ProductPageClient({ product, seasonOptions = [] }: ProductPageClientProps) {
  const { addItem } = useRecentlyViewed()

  useEffect(() => {
    addItem(product)
  }, [product.id, addItem])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
      <ProductGallery key={product.id} images={product.images} name={product.name} />
      <ProductInfo product={product} seasonOptions={seasonOptions} />
    </div>
  )
}
