import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'
import { getSettings, settingKeys } from '@/lib/settings'

export async function GET() {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json(await getSettings())
}

export async function PUT(request: NextRequest) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await request.json()
    const updates = settingKeys
      .filter((key) => typeof data[key] === 'string' || typeof data[key] === 'number')
      .map((key) => {
        const value = String(data[key]).trim().slice(0, 500)
        return prisma.setting.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        })
      })
    await prisma.$transaction(updates)
    return NextResponse.json(await getSettings())
  } catch (error) {
    console.error('Error saving settings:', error)
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
  }
}
