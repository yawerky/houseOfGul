import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const occasion = searchParams.get('occasion')
    const featured = searchParams.get('featured')
    const limit = searchParams.get('limit')
    const search = searchParams.get('search')

    const where: Record<string, unknown> = {
      inStock: true,
    }

    if (category && category !== 'all') {
      where.category = category
    }

    if (occasion && occasion !== 'all') {
      where.occasion = occasion
    }

    if (featured === 'true') {
      where.featured = true
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ]
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
      take: limit ? parseInt(limit) : undefined,
    })

    // Format products to match the Product interface used by frontend
    const formattedProducts = products.map((p) => ({
      id: p.slug,
      name: p.name,
      price: p.price,
      description: p.description || '',
      story: p.story || '',
      flowers: JSON.parse(p.flowers || '[]'),
      images: JSON.parse(p.images || '[]'),
      category: p.category || 'Uncategorized',
      featured: p.featured,
      deliveryInfo: p.deliveryInfo || 'Same-day delivery available in select areas.',
      occasions: p.occasion ? [p.occasion] : [],
      season: p.season || 'all',
      rating: p.rating || 4.5,
      reviewCount: p.reviewCount || 0,
    }))

    return NextResponse.json(formattedProducts)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
