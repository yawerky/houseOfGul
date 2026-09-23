import { jobTypes } from '@/lib/jobs'

const text = (value: unknown, max = 200) => (typeof value === 'string' ? value.trim().slice(0, max) : '')

export function jobError(body: Record<string, unknown>): string {
  if (!text(body.title)) return 'Please enter the job title.'
  if (!text(body.description, 20000)) return 'Please write the job description.'
  return ''
}

export function jobData(body: Record<string, unknown>) {
  const type = text(body.type, 40)
  return {
    title: text(body.title, 120),
    location: text(body.location, 160) || 'Jhotwara, Jaipur',
    type: jobTypes.some((t) => t.value === type) ? type : 'full-time',
    summary: text(body.summary, 300) || null,
    description: text(body.description, 20000),
    order: Number.isFinite(Number(body.order)) ? Math.round(Number(body.order)) : 0,
    isActive: body.isActive !== false,
  }
}
