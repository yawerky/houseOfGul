import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'

export async function GET() {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await request.json()

    // Check if slug already exists
    const existingProduct = await prisma.product.findUnique({
      where: { slug: data.slug },
    })

    if (existingProduct) {
      return NextResponse.json({ error: 'A product with this slug already exists' }, { status: 400 })
    }

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        price: data.price,
        comparePrice: data.comparePrice || null,
        description: data.description,
        story: data.story || null,
        category: data.category,
        occasion: data.occasion || null,
        season: data.season || null,
        flowers: JSON.stringify(data.flowers || []),
        images: JSON.stringify(data.images || []),
        featured: data.featured || false,
        inStock: data.inStock ?? true,
        stockCount: data.stockCount || 100,
        deliveryInfo: data.deliveryInfo || null,
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
