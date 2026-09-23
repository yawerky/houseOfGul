import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'
import { deleteCv } from '@/lib/cvStorage'
import { applicationStatuses } from '@/lib/jobs'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    const body = await request.json()

    // Only these two are the owner's to change. Everything else came from the
    // applicant and stays as they wrote it.
    const data: { status?: string; adminNote?: string | null } = {}
    if (typeof body.status === 'string') {
      if (!(applicationStatuses as readonly string[]).includes(body.status)) {
        return NextResponse.json({ error: 'Unknown status' }, { status: 400 })
      }
      data.status = body.status
    }
    if (typeof body.adminNote === 'string') {
      data.adminNote = body.adminNote.trim().slice(0, 2000) || null
    }
    if (!Object.keys(data).length) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })
    }

    const application = await prisma.jobApplication.update({ where: { id }, data })
    return NextResponse.json(application)
  } catch (error) {
    console.error('Error updating application:', error)
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 })
  }
}

// Deleting an application deletes the CV with it. Holding someone's personal
// data after the owner has decided to let it go would be the wrong default.
export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    const application = await prisma.jobApplication.findUnique({ where: { id } })
    if (!application) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    await prisma.jobApplication.delete({ where: { id } })
    await deleteCv(application.cvPath)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting application:', error)
    return NextResponse.json({ error: 'Failed to delete application' }, { status: 500 })
  }
}
