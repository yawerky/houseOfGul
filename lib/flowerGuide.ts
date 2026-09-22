import { prisma } from '@/lib/prisma'
import { defaultFlowerGuide, type FlowerGuideEntry } from '@/lib/flowerGuideDefaults'

export { defaultFlowerGuide }
export type { FlowerGuideEntry }

const parseList = (value: string): string[] => {
  try {
    const parsed = JSON.parse(value || '[]')
    return Array.isArray(parsed) ? parsed.map(String) : []
  } catch {
    return []
  }
}

type FlowerRow = {
  id: string
  name: string
  meaning: string
  symbolism: string
  colors: string
  season: string
  careLevel: string
  image: string | null
  order: number
  isActive: boolean
}

export function mapFlower(row: FlowerRow): FlowerGuideEntry {
  return { ...row, symbolism: parseList(row.symbolism), colors: parseList(row.colors) }
}

// Visible flowers for the website, in admin order.
export async function getFlowerGuide(): Promise<FlowerGuideEntry[]> {
  try {
    const rows = await prisma.flowerGuide.findMany({
      where: { isActive: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    })
    return rows.map(mapFlower)
  } catch (error) {
    console.error('Error loading flower guide:', error)
    return []
  }
}
