import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'
import { readCv } from '@/lib/cvStorage'

export const runtime = 'nodejs'

// The only way to read a CV. The file is never served as a static asset and
// the database holds a storage key, not a link, so this login check is the
// whole of the door. It streams as an attachment rather than rendering in the
// browser, so a crafted document cannot run in the admin's session.
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const application = await prisma.jobApplication.findUnique({
    where: { id },
    select: { cvPath: true, cvName: true, cvType: true },
  })
  if (!application) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const file = await readCv(application.cvPath)
  if (!file) {
    return NextResponse.json({ error: 'That CV is no longer in storage.' }, { status: 404 })
  }

  return new NextResponse(new Uint8Array(file), {
    headers: {
      'Content-Type': application.cvType || 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${application.cvName}"`,
      'Content-Length': String(file.length),
      'Cache-Control': 'no-store, private',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
