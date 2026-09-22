import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { mkdir, writeFile } from 'fs/promises'
import path from 'path'
import { getAdminSession } from '@/lib/auth'

const allowedTypes: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
  'image/gif': 'gif',
}
const MAX_BYTES = 4 * 1024 * 1024

// Uploads one image and returns its public URL.
// On Vercel it uses Vercel Blob (BLOB_READ_WRITE_TOKEN). Locally, without a
// token, it saves into public/uploads so you can test.
export async function POST(request: NextRequest) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const form = await request.formData()
    const file = form.get('file')
    const folder = String(form.get('folder') || 'products').replace(/[^a-z0-9-]/gi, '') || 'products'

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No image was received.' }, { status: 400 })
    }
    const ext = allowedTypes[file.type]
    if (!ext) {
      return NextResponse.json({ error: 'Please upload a JPG, PNG, WebP, AVIF or GIF image.' }, { status: 400 })
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'Image is larger than 4 MB. Please use a smaller image.' }, { status: 400 })
    }

    const base =
      file.name
        .replace(/\.[^.]+$/, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
        .slice(0, 60) || 'image'
    const filename = `${base}-${Date.now().toString(36)}.${ext}`

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`${folder}/${filename}`, file, {
        access: 'public',
        addRandomSuffix: true,
        contentType: file.type,
      })
      return NextResponse.json({ url: blob.url })
    }

    if (process.env.VERCEL) {
      return NextResponse.json(
        { error: 'Image storage is not set up. In Vercel, open Storage → create a Blob store and connect it to this project.' },
        { status: 500 }
      )
    }

    const dir = path.join(process.cwd(), 'public', 'uploads', folder)
    await mkdir(dir, { recursive: true })
    await writeFile(path.join(dir, filename), Buffer.from(await file.arrayBuffer()))
    return NextResponse.json({ url: `/uploads/${folder}/${filename}` })
  } catch (error) {
    console.error('Error uploading image:', error)
    return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 })
  }
}
