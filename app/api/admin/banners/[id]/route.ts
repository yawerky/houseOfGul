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

    const banner = await prisma.banner.update({
      where: { id },
      data: {
        title: data.title,
        subtitle: data.subtitle || null,
        buttonText: data.buttonText || null,
        buttonLink: data.buttonLink || null,
        image: data.image,
        position: data.position,
        isActive: data.isActive,
        order: data.order,
      },
    })

    return NextResponse.json(banner)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update banner' }, { status: 500 })
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
    await prisma.banner.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete banner' }, { status: 500 })
  }
}
