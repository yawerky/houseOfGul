'use client'

import { useRef, useState } from 'react'

// Shrinks large photos in the browser before upload (max 2000px, JPEG),
// so phone photos upload quickly and stay under the 4 MB limit.
async function prepareImage(file: File): Promise<File> {
  if (!file.type.startsWith('image/') || file.type === 'image/gif') return file
  const MAX = 2000
  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, MAX / Math.max(bitmap.width, bitmap.height))
    if (scale === 1 && file.size < 1.5 * 1024 * 1024) return file
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.88))
    if (!blob) return file
    return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.jpg', { type: 'image/jpeg' })
  } catch {
    return file
  }
}

export async function uploadImage(file: File, folder: string): Promise<string> {
  const prepared = await prepareImage(file)
  const body = new FormData()
  body.append('file', prepared)
  body.append('folder', folder)
  const res = await fetch('/api/admin/upload', { method: 'POST', body })
  const data = await res.json().catch(() => ({}))
  if (!res.ok || !data.url) throw new Error(data.error || 'Upload failed.')
  return data.url as string
}

interface ImageUploaderProps {
  images: string[]
  onChange: (images: string[]) => void
  folder?: string
  multiple?: boolean
}

export default function ImageUploader({ images, onChange, folder = 'products', multiple = true }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setError('')
    setUploading(true)
    const list = Array.from(files)
    let current = multiple ? [...images] : []
    try {
      for (let i = 0; i < list.length; i++) {
        setStatus(`Uploading ${i + 1} of ${list.length}…`)
        const url = await uploadImage(list[i], folder)
        current = multiple ? [...current, url] : [url]
        onChange(current)
      }
      setStatus(`${list.length} image${list.length > 1 ? 's' : ''} uploaded.`)
    } catch (err) {
      setError((err as Error).message)
      setStatus('')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const move = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return
    const next = [...images]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    onChange(next)
  }

  return (
    <div>
      {images.length > 0 && (
        <ul className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-4">
          {images.map((src, i) => (
            <li key={`${src}-${i}`} className="relative group">
              <div className="aspect-[3/4] overflow-hidden rounded-lg bg-gray-100 border border-gray-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
              </div>
              {i === 0 && multiple && (
                <span className="absolute top-1 left-1 text-[10px] bg-gold text-white px-1.5 py-0.5 rounded">Main</span>
              )}
              <div className="flex justify-between mt-1 text-xs">
                {multiple ? (
                  <span className="flex gap-1">
                    <button type="button" onClick={() => move(i, i - 1)} disabled={i === 0} className="px-1 text-charcoal-light hover:text-gold disabled:opacity-30" aria-label="Move left">←</button>
                    <button type="button" onClick={() => move(i, i + 1)} disabled={i === images.length - 1} className="px-1 text-charcoal-light hover:text-gold disabled:opacity-30" aria-label="Move right">→</button>
                  </span>
                ) : <span />}
                <button type="button" onClick={() => onChange(images.filter((_, j) => j !== i))} className="px-1 text-red-600 hover:underline">
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="px-4 py-2 border border-gold text-gold rounded-lg hover:bg-gold hover:text-white transition-colors disabled:opacity-50"
        >
          {uploading ? 'Uploading…' : multiple ? 'Upload Images' : images.length ? 'Replace Image' : 'Upload Image'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
          multiple={multiple}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        {status && <span className="text-sm text-charcoal-light">{status}</span>}
        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>
    </div>
  )
}
