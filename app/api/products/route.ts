import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { mapDbProduct } from '@/lib/productMapper'
import { collapseSeasonVariants } from '@/lib/variants'

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
    })

    // One card per seasonal group, then apply the limit
    const { items, seasonCounts } = collapseSeasonVariants(products)
    const max = limit ? parseInt(limit) : undefined
    const formattedProducts = items
      .slice(0, max && max > 0 ? max : undefined)
      .map((p) => mapDbProduct(p, seasonCounts.get(p.slug)))

    return NextResponse.json(formattedProducts)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
