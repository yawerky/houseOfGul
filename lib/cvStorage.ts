import { put, del, get } from '@vercel/blob'
import { mkdir, readFile, unlink, writeFile } from 'fs/promises'
import path from 'path'

// Where CVs from the careers form are kept.
//
// A CV is personal data: a name, a phone number, an address history, often a
// photograph. It must never be reachable by guessing or sharing a URL, so it
// is NOT stored the way product images are.
//
//   On Vercel — a private Vercel Blob (access: 'private'). A private blob has
//     no public URL; it can only be read back with the store token, which
//     lives on the server.
//   Locally — private-uploads/cv/ at the project root. Next only serves files
//     under public/, so nothing under private-uploads is reachable over HTTP.
//     It is in .gitignore, so a test CV can never be committed.
//
// Either way the database stores a storage key, not a link. The only way to
// read a CV is GET /api/admin/job-applications/<id>/cv, which checks the
// admin session first.

const LOCAL_ROOT = 'private-uploads'
const BLOB_PREFIX = 'cv'

export const CV_MAX_BYTES = 5 * 1024 * 1024

// PDF and Word only. A CV has no reason to be anything else, and the narrow
// list keeps scripts, archives and images out of the store.
export const CV_TYPES: Record<string, string> = {
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
}

export const CV_ACCEPT = '.pdf,.doc,.docx'

function blobEnabled() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID)
}

// The applicant's file name is shown in admin, so it is cleaned down to
// letters, digits and dashes. It is never used to build a path.
export function safeCvName(name: string, ext: string): string {
  const base =
    name
      .replace(/\.[^.]+$/, '')
      .normalize('NFKD')
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 60) || 'cv'
  return `${base}.${ext}`
}

// The stored key. Built here from random bytes and the checked extension, so
// nothing the applicant sent ever reaches the filesystem or the blob path.
function newKey(ext: string) {
  const random = `${Date.now().toString(36)}-${crypto.randomUUID()}`
  return `${BLOB_PREFIX}/${random}.${ext}`
}

// What the first bytes of a real file of each kind look like. The browser's
// content type is the applicant's word for it; this is the file's own. It
// stops a script or an archive being parked in the store under a PDF label.
const SIGNATURES: Record<string, Uint8Array[]> = {
  'application/pdf': [Buffer.from('%PDF-')],
  'application/msword': [
    Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]), // the old Word format
    Buffer.from('{\\rtf'), // Word also opens RTF saved as .doc
  ],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
    Buffer.from([0x50, 0x4b, 0x03, 0x04]), // .docx is a zip
    Buffer.from([0x50, 0x4b, 0x05, 0x06]),
  ],
}

function signatureMatches(bytes: Buffer, type: string): boolean {
  const heads = SIGNATURES[type]
  if (!heads) return false
  return heads.some((head) => bytes.subarray(0, head.length).equals(head))
}

export type StoredCv = { path: string; type: string; size: number; name: string }

// Saves one CV and returns what belongs in the database.
export async function saveCv(file: File): Promise<StoredCv> {
  const ext = CV_TYPES[file.type]
  if (!ext) throw new Error('Please attach a PDF or a Word document.')
  if (file.size === 0) throw new Error('That file is empty.')
  if (file.size > CV_MAX_BYTES) throw new Error('That file is larger than 5 MB. Please attach a smaller one.')

  const bytes = Buffer.from(await file.arrayBuffer())
  if (!signatureMatches(bytes, file.type)) {
    throw new Error('That file does not open as a PDF or a Word document. Please check it and try again.')
  }

  const key = newKey(ext)
  const stored: StoredCv = {
    path: key,
    type: file.type,
    size: bytes.length,
    name: safeCvName(file.name, ext),
  }

  if (blobEnabled()) {
    const blob = await put(key, bytes, {
      access: 'private',
      addRandomSuffix: true,
      contentType: file.type,
    })
    return { ...stored, path: blob.pathname }
  }

  if (process.env.VERCEL) {
    throw new Error('CV storage is not set up. In Vercel, open Storage, create a Blob store and connect it to this project.')
  }

  const full = path.join(process.cwd(), LOCAL_ROOT, key)
  await mkdir(path.dirname(full), { recursive: true })
  await writeFile(full, bytes)
  return stored
}

// Reads a stored CV back. Only the admin download route calls this.
export async function readCv(key: string): Promise<Buffer | null> {
  // The key was written by newKey(), never by a person. Refuse anything else
  // rather than let a crafted value walk out of the folder.
  if (!/^cv\/[A-Za-z0-9._-]+$/.test(key)) return null

  if (blobEnabled()) {
    const result = await get(key, { access: 'private' })
    if (!result || result.statusCode !== 200 || !result.stream) return null
    return Buffer.from(await new Response(result.stream).arrayBuffer())
  }

  try {
    return await readFile(path.join(process.cwd(), LOCAL_ROOT, key))
  } catch {
    return null
  }
}

// Deleting an application deletes its CV too. We hold a CV to fill a job, not
// forever, so nothing is left behind after the owner clears the pile.
export async function deleteCv(key: string): Promise<void> {
  if (!/^cv\/[A-Za-z0-9._-]+$/.test(key)) return
  try {
    if (blobEnabled()) {
      await del(key)
      return
    }
    await unlink(path.join(process.cwd(), LOCAL_ROOT, key))
  } catch {
    // The row still goes. A missing file is not worth failing the delete for.
  }
}
