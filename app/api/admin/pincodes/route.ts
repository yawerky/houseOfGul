import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'

export async function GET() {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const pincodes = await prisma.pincode.findMany({
      orderBy: [{ isActive: 'desc' }, { city: 'asc' }, { code: 'asc' }],
    })
    return NextResponse.json(pincodes)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch pincodes' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await request.json()

    // Check if pincode already exists
    const existingPincode = await prisma.pincode.findUnique({
      where: { code: data.code },
    })

    if (existingPincode) {
      return NextResponse.json({ error: 'This pincode already exists' }, { status: 400 })
    }

    const pincode = await prisma.pincode.create({
      data: {
        code: data.code,
        area: data.area || data.city,
        city: data.city,
        state: data.state,
        deliveryZone: data.sameDayAvailable ? 'same-day' : (data.nextDayAvailable ? 'next-day' : '2-3-days'),
        deliveryCharge: data.deliveryCharge || 0,
        minOrderFree: data.minOrderFree || null,
        isActive: data.isActive ?? true,
      },
    })

    return NextResponse.json(pincode, { status: 201 })
  } catch (error) {
    console.error('Error creating pincode:', error)
    return NextResponse.json({ error: 'Failed to create pincode' }, { status: 500 })
  }
}
