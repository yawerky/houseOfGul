import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''
  const occasion = searchParams.get('occasion') || ''
  const minPrice = parseFloat(searchParams.get('minPrice') || '0')
  const maxPrice = parseFloat(searchParams.get('maxPrice') || '100000')
  const limit = parseInt(searchParams.get('limit') || '20')

  try {
    const products = await prisma.product.findMany({
      where: {
        inStock: true,
        AND: [
          query ? {
            OR: [
              { name: { contains: query } },
              { description: { contains: query } },
              { category: { contains: query } },
              { occasion: { contains: query } },
              { flowers: { contains: query } },
            ],
          } : {},
          category ? { category } : {},
          occasion ? { occasion } : {},
          { price: { gte: minPrice, lte: maxPrice } },
        ],
      },
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' },
      ],
      take: limit,
    })

    const results = products.map((p) => ({
      id: p.slug,
      name: p.name,
      price: p.price,
      category: p.category,
      occasion: p.occasion,
      image: JSON.parse(p.images || '[]')[0] || null,
      slug: p.slug,
    }))

    // Get search suggestions
    const suggestions = await prisma.product.findMany({
      where: {
        inStock: true,
        name: { contains: query },
      },
      select: { name: true, category: true },
      take: 5,
      distinct: ['name'],
    })

    // Get categories for filters
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      select: { name: true, slug: true },
    })

    // Get occasions for filters
    const occasions = await prisma.occasion.findMany({
      where: { isActive: true },
      select: { name: true, slug: true },
    })

    return NextResponse.json({
      results,
      total: results.length,
      suggestions: suggestions.map(s => s.name),
      filters: {
        categories,
        occasions,
      },
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ results: [], total: 0, suggestions: [], filters: { categories: [], occasions: [] } })
  }
}
