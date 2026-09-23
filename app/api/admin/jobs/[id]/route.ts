import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'
import { jobData, jobError } from '../validate'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    const body = await request.json()
    const error = jobError(body)
    if (error) return NextResponse.json({ error }, { status: 400 })
    const row = await prisma.job.update({ where: { id }, data: jobData(body) })
    return NextResponse.json(row)
  } catch (error) {
    console.error('Error updating job:', error)
    return NextResponse.json({ error: 'Failed to save job' }, { status: 500 })
  }
}

// Deleting a job keeps its applications. The link is set to null and the role
// they applied for is already copied onto each application, so the pile of
// CVs survives the posting coming down.
export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    await prisma.job.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting job:', error)
    return NextResponse.json({ error: 'Failed to delete job' }, { status: 500 })
  }
}
