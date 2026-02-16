import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { email, name, source } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Check if already subscribed
    const existing = await prisma.subscriber.findUnique({
      where: { email },
    })

    if (existing) {
      if (existing.isSubscribed) {
        return NextResponse.json({ message: 'Already subscribed' })
      }
      // Resubscribe
      await prisma.subscriber.update({
        where: { email },
        data: { isSubscribed: true },
      })
      return NextResponse.json({ message: 'Successfully resubscribed' })
    }

    await prisma.subscriber.create({
      data: {
        email,
        name: name || null,
        source: source || 'website',
      },
    })

    return NextResponse.json({ message: 'Successfully subscribed' }, { status: 201 })
  } catch (error) {
    console.error('Error subscribing:', error)
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
  }
}
