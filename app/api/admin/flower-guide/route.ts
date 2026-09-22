import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'
import { mapFlower } from '@/lib/flowerGuide'
import { flowerData, flowerError } from './validate'

export async function GET() {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const rows = await prisma.flowerGuide.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'asc' }] })
  return NextResponse.json(rows.map(mapFlower))
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const error = flowerError(body)
    if (error) return NextResponse.json({ error }, { status: 400 })
    const row = await prisma.flowerGuide.create({ data: flowerData(body) })
    return NextResponse.json(mapFlower(row), { status: 201 })
  } catch (error) {
    console.error('Error creating flower:', error)
    return NextResponse.json({ error: 'Failed to save flower' }, { status: 500 })
  }
}
