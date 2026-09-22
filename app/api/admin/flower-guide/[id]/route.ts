import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'
import { mapFlower } from '@/lib/flowerGuide'
import { flowerData, flowerError } from '../validate'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    const body = await request.json()
    const error = flowerError(body)
    if (error) return NextResponse.json({ error }, { status: 400 })
    const row = await prisma.flowerGuide.update({ where: { id }, data: flowerData(body) })
    return NextResponse.json(mapFlower(row))
  } catch (error) {
    console.error('Error updating flower:', error)
    return NextResponse.json({ error: 'Failed to save flower' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    await prisma.flowerGuide.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting flower:', error)
    return NextResponse.json({ error: 'Failed to delete flower' }, { status: 500 })
  }
}
