// Seasonal versions of a product are separate products whose slugs share a
// base and end in a season, e.g. "the-bloom-letter-summer" and
// "the-bloom-letter-winter". They are shown as one product with a season picker.

export type SeasonKey = 'spring' | 'summer' | 'autumn' | 'winter'

export const seasonInfo: Record<SeasonKey, { label: string; months: string }> = {
  spring: { label: 'Spring', months: 'Feb – Mar' },
  summer: { label: 'Summer', months: 'Apr – Aug' },
  autumn: { label: 'Autumn', months: 'Sep – Nov' },
  winter: { label: 'Winter', months: 'Dec – Jan' },
}

export const seasonOrder: SeasonKey[] = ['spring', 'summer', 'autumn', 'winter']

const suffixes: Record<string, SeasonKey> = {
  spring: 'spring',
  summer: 'summer',
  autumn: 'autumn',
  fall: 'autumn',
  winter: 'winter',
}

export function parseSeasonSlug(slug: string): { base: string; season: SeasonKey } | null {
  const match = /^(.+)-(spring|summer|autumn|fall|winter)$/.exec(slug)
  if (!match) return null
  return { base: match[1], season: suffixes[match[2]] }
}

// Season in Jaipur right now (Indian time).
export function currentSeason(date = new Date()): SeasonKey {
  const month = new Date(date.getTime() + 5.5 * 60 * 60 * 1000).getUTCMonth() + 1
  if (month === 2 || month === 3) return 'spring'
  if (month >= 4 && month <= 8) return 'summer'
  if (month >= 9 && month <= 11) return 'autumn'
  return 'winter'
}

// Keep one product per seasonal group (the current season if it exists),
// and report how many seasons each kept product has.
export function collapseSeasonVariants<T extends { slug: string }>(
  rows: T[]
): { items: T[]; seasonCounts: Map<string, number> } {
  const now = currentSeason()
  const groups = new Map<string, T[]>()
  const order: string[] = []

  for (const row of rows) {
    const parsed = parseSeasonSlug(row.slug)
    const key = parsed ? `group:${parsed.base}` : `single:${row.slug}`
    if (!groups.has(key)) {
      groups.set(key, [])
      order.push(key)
    }
    groups.get(key)!.push(row)
  }

  const seasonCounts = new Map<string, number>()
  const items = order.map((key) => {
    const members = groups.get(key)!
    if (members.length === 1) return members[0]
    const chosen = members.find((m) => parseSeasonSlug(m.slug)?.season === now) || members[0]
    seasonCounts.set(chosen.slug, members.length)
    return chosen
  })

  return { items, seasonCounts }
}

export function sortBySeason<T extends { slug: string }>(rows: T[]): T[] {
  return [...rows].sort(
    (a, b) =>
      seasonOrder.indexOf(parseSeasonSlug(a.slug)?.season || 'spring') -
      seasonOrder.indexOf(parseSeasonSlug(b.slug)?.season || 'spring')
  )
}
