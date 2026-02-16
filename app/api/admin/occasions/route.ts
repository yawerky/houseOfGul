import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'

export async function GET() {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const occasions = await prisma.occasion.findMany({
      orderBy: [{ order: 'asc' }, { name: 'asc' }],
    })
    return NextResponse.json(occasions)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch occasions' }, { status: 500 })
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

    const occasion = await prisma.occasion.create({
      data: {
        name: data.name,
        slug,
        description: data.description || null,
        image: data.image || null,
        isActive: data.isActive ?? true,
        order: data.order || 0,
      },
    })

    return NextResponse.json(occasion, { status: 201 })
  } catch (error) {
    console.error('Error creating occasion:', error)
    return NextResponse.json({ error: 'Failed to create occasion' }, { status: 500 })
  }
}
