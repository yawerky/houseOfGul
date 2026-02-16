import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    if (!data.name || !data.email || !data.message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        type: data.type || 'general',
        eventDate: data.eventDate ? new Date(data.eventDate) : null,
        budget: data.budget || null,
        guests: data.guests || null,
        message: data.message,
      },
    })

    return NextResponse.json(
      { message: 'Inquiry submitted successfully', id: inquiry.id },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating inquiry:', error)
    return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 })
  }
}
