import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const product = await prisma.product.findUnique({
      where: { slug },
    })

    if (!product || !product.inStock) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Format product to match the Product interface
    const formattedProduct = {
      id: product.slug,
      name: product.name,
      price: product.price,
      description: product.description || '',
      story: product.story || '',
      flowers: JSON.parse(product.flowers || '[]'),
      images: JSON.parse(product.images || '[]'),
      category: product.category || 'Uncategorized',
      featured: product.featured,
      deliveryInfo: product.deliveryInfo || 'Same-day delivery available in select areas.',
      occasions: product.occasion ? [product.occasion] : [],
      season: product.season || 'all',
      rating: product.rating || 4.5,
      reviewCount: product.reviewCount || 0,
    }

    return NextResponse.json(formattedProduct)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}
