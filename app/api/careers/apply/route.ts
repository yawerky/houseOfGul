import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendJobApplicationEmail } from '@/lib/notify'
import { CV_MAX_BYTES, CV_TYPES, saveCv, deleteCv } from '@/lib/cvStorage'

// The careers form. Unlike the admin upload route this one has no login
// behind it — anyone on the internet can post here — so it is deliberately
// narrow: one multipart request, a short field list, PDF or Word only, 5 MB,
// and a cap on how often one address may post.
//
// The file is saved through lib/cvStorage, which keeps it out of public/ and
// out of git. See the note at the top of that file.

export const runtime = 'nodejs'

// A rough brake on someone holding down the submit button. It lives in memory,
// so on Vercel each instance counts separately and a determined flood would
// still get through. It is here to stop accidents, not attacks.
const recent = new Map<string, number[]>()
const WINDOW_MS = 60 * 60 * 1000
const MAX_PER_WINDOW = 5

function tooMany(key: string): boolean {
  const now = Date.now()
  const hits = (recent.get(key) || []).filter((t) => now - t < WINDOW_MS)
  hits.push(now)
  recent.set(key, hits)
  if (recent.size > 5000) recent.clear()
  return hits.length > MAX_PER_WINDOW
}

const text = (value: FormDataEntryValue | null, max: number) =>
  typeof value === 'string' ? value.trim().slice(0, max) : ''

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'local'
  if (tooMany(ip)) {
    return NextResponse.json(
      { error: 'We already have your application. Please write to us instead if something went wrong.' },
      { status: 429 }
    )
  }

  let savedPath: string | null = null

  try {
    const form = await request.formData()

    const name = text(form.get('name'), 120)
    const email = text(form.get('email'), 200)
    const phone = text(form.get('phone'), 40)
    const note = text(form.get('note'), 2000)
    const jobId = text(form.get('jobId'), 60)

    if (!name || !email || !phone) {
      return NextResponse.json({ error: 'Please fill in your name, email and phone.' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Please check the email address.' }, { status: 400 })
    }
    if (phone.replace(/\D/g, '').length < 10) {
      return NextResponse.json({ error: 'Please give a phone number we can reach you on.' }, { status: 400 })
    }

    const file = form.get('cv')
    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: 'Please attach your CV.' }, { status: 400 })
    }
    if (!CV_TYPES[file.type]) {
      return NextResponse.json({ error: 'Please attach a PDF or a Word document.' }, { status: 400 })
    }
    if (file.size > CV_MAX_BYTES) {
      return NextResponse.json({ error: 'That file is larger than 5 MB. Please attach a smaller one.' }, { status: 400 })
    }

    // Only an open job can be applied for. Anything else is a general
    // application, whatever the form posted.
    const job = jobId ? await prisma.job.findFirst({ where: { id: jobId, isActive: true } }) : null

    const cv = await saveCv(file)
    savedPath = cv.path

    const application = await prisma.jobApplication.create({
      data: {
        jobId: job?.id || null,
        jobTitle: job?.title || 'General application',
        name,
        email,
        phone,
        cvPath: cv.path,
        cvName: cv.name,
        cvType: cv.type,
        cvSize: cv.size,
        note: note || null,
      },
    })

    // The application is saved. A mail failure must never fail the form —
    // log it and move on. Email may not be set up at all, in which case
    // sendEmail does nothing.
    await sendJobApplicationEmail(application.id).catch((e) =>
      console.error('Job application email failed:', e)
    )

    return NextResponse.json({ message: 'Application received', id: application.id }, { status: 201 })
  } catch (error) {
    console.error('Error saving job application:', error)
    // If the file landed but the row did not, do not leave the CV behind.
    if (savedPath) await deleteCv(savedPath)
    const reason = error instanceof Error && /PDF|Word|5 MB|empty|storage/i.test(error.message) ? error.message : ''
    return NextResponse.json(
      { error: reason || 'We could not receive that. Please try again.' },
      { status: reason ? 400 : 500 }
    )
  }
}
