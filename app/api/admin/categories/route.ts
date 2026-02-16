import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'

export async function GET() {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const categories = await prisma.category.findMany({
      orderBy: [{ order: 'asc' }, { name: 'asc' }],
    })
    return NextResponse.json(categories)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await request.json()

    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')

    // Check if category with same name or slug exists
    const existing = await prisma.category.findFirst({
      where: {
        OR: [{ name: data.name }, { slug }],
      },
    })

    if (existing) {
      return NextResponse.json({ error: 'Category with this name or slug already exists' }, { status: 400 })
    }

    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug,
        image: data.image || null,
        isActive: data.isActive ?? true,
        order: parseInt(data.order) || 0,
      },
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error: unknown) {
    console.error('Error creating category:', error)
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json({ error: 'Category with this name or slug already exists' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}
