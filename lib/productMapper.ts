import type { Product as DbProduct } from '@prisma/client'
import type { Product } from '@/lib/products'

const parseList = (value: string | null | undefined): string[] => {
  try {
    const parsed = JSON.parse(value || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

// Database product -> shape used by the website components.
export function mapDbProduct(p: DbProduct, seasonCount?: number): Product {
  return {
    id: p.slug,
    ...(p.sku ? { sku: p.sku } : {}),
    name: p.name,
    price: p.price,
    description: p.description || '',
    story: p.story || '',
    flowers: parseList(p.flowers),
    images: parseList(p.images),
    category: p.category || 'Uncategorized',
    featured: p.featured,
    deliveryInfo: p.deliveryInfo || 'Same-day delivery available in select areas.',
    occasions: p.occasion ? [p.occasion] : [],
    season: p.season || 'all',
    rating: p.rating || 4.5,
    reviewCount: p.reviewCount || 0,
    ...(seasonCount && seasonCount > 1 ? { seasonCount } : {}),
  }
}
