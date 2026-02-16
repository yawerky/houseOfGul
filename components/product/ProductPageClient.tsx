'use client'

import { useEffect } from 'react'
import { Product } from '@/lib/products'
import { useRecentlyViewed } from '@/context/RecentlyViewedContext'
import ProductGallery from './ProductGallery'
import ProductInfo from './ProductInfo'

interface ProductPageClientProps {
  product: Product
}

export default function ProductPageClient({ product }: ProductPageClientProps) {
  const { addItem } = useRecentlyViewed()

  useEffect(() => {
    addItem(product)
  }, [product.id, addItem])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
      <ProductGallery images={product.images} name={product.name} />
      <ProductInfo product={product} />
    </div>
  )
}
