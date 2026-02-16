import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    const data = await request.json()

    // Check if another category with same name or slug exists
    const existing = await prisma.category.findFirst({
      where: {
        OR: [{ name: data.name }, { slug: data.slug }],
        NOT: { id },
      },
    })

    if (existing) {
      return NextResponse.json({ error: 'Category with this name or slug already exists' }, { status: 400 })
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        image: data.image || null,
        isActive: data.isActive ?? true,
        order: parseInt(data.order) || 0,
      },
    })

    return NextResponse.json(category)
  } catch (error: unknown) {
    console.error('Error updating category:', error)
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json({ error: 'Category with this name or slug already exists' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    const data = await request.json()

    // Only update valid Category fields
    const updateData: Record<string, unknown> = {}
    if (data.name !== undefined) updateData.name = data.name
    if (data.slug !== undefined) updateData.slug = data.slug
    if (data.image !== undefined) updateData.image = data.image || null
    if (data.isActive !== undefined) updateData.isActive = data.isActive
    if (data.order !== undefined) updateData.order = data.order

    const category = await prisma.category.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    await prisma.category.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error('Error deleting category:', error)
    // Check if it's a foreign key constraint error
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2003') {
      return NextResponse.json({ error: 'Cannot delete category that has products' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}
