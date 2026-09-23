import { prisma } from '@/lib/prisma'

export type JobEntry = {
  id: string
  title: string
  location: string
  type: string
  summary: string | null
  description: string
  isActive: boolean
  order: number
}

// The employment types the admin form offers, and how they read on the site.
export const jobTypes: { value: string; label: string }[] = [
  { value: 'full-time', label: 'Full time' },
  { value: 'part-time', label: 'Part time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
  { value: 'apprenticeship', label: 'Apprenticeship' },
]

export function jobTypeLabel(value: string): string {
  return jobTypes.find((t) => t.value === value)?.label || value
}

// How an application moves through the pile.
export const applicationStatuses = [
  'new',
  'reviewing',
  'shortlisted',
  'hired',
  'not-suitable',
  'archived',
] as const

// Open jobs for the website, in admin order.
export async function getOpenJobs(): Promise<JobEntry[]> {
  try {
    return await prisma.job.findMany({
      where: { isActive: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
      select: {
        id: true,
        title: true,
        location: true,
        type: true,
        summary: true,
        description: true,
        isActive: true,
        order: true,
      },
    })
  } catch (error) {
    console.error('Error loading jobs:', error)
    return []
  }
}
