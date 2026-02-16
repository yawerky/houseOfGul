import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const text = await file.text()
    const lines = text.split('\n').filter((line) => line.trim())

    if (lines.length < 2) {
      return NextResponse.json({ error: 'CSV file is empty or has no data rows' }, { status: 400 })
    }

    // Parse header
    const header = lines[0].toLowerCase().split(',').map((h) => h.trim())
    const requiredFields = ['pincode', 'city', 'state']
    const missingFields = requiredFields.filter((f) => !header.includes(f))

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    // Parse data rows
    const pincodes: Array<{
      code: string
      area: string
      city: string
      state: string
      deliveryZone: string
      deliveryCharge: number
      isActive: boolean
    }> = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map((v) => v.trim())
      if (values.length < 3) continue

      const row: Record<string, string> = {}
      header.forEach((h, idx) => {
        row[h] = values[idx] || ''
      })

      const code = row.pincode || row.code
      if (!code || !row.city || !row.state) continue

      const sameDayAvailable = row.samedayavailable === 'true'
      const nextDayAvailable = row.nextdayavailable !== 'false'

      pincodes.push({
        code,
        area: row.area || row.city,
        city: row.city,
        state: row.state,
        deliveryZone: sameDayAvailable ? 'same-day' : (nextDayAvailable ? 'next-day' : '2-3-days'),
        deliveryCharge: parseFloat(row.deliverycharge) || 0,
        isActive: true,
      })
    }

    if (pincodes.length === 0) {
      return NextResponse.json({ error: 'No valid pincode data found in CSV' }, { status: 400 })
    }

    // Upsert pincodes (update if exists, create if not)
    let count = 0
    for (const pincode of pincodes) {
      await prisma.pincode.upsert({
        where: { code: pincode.code },
        update: pincode,
        create: pincode,
      })
      count++
    }

    return NextResponse.json({ success: true, count })
  } catch (error) {
    console.error('Error importing pincodes:', error)
    return NextResponse.json({ error: 'Failed to import pincodes' }, { status: 500 })
  }
}
