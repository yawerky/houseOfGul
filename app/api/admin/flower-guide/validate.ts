const list = (value: unknown): string[] =>
  (Array.isArray(value) ? value : [])
    .map((v) => String(v).trim())
    .filter(Boolean)
    .slice(0, 12)

const text = (value: unknown, max = 200) => (typeof value === 'string' ? value.trim().slice(0, max) : '')

export function flowerError(body: Record<string, unknown>): string {
  if (!text(body.name)) return 'Please enter the flower name.'
  if (!text(body.meaning)) return 'Please enter what the flower means.'
  return ''
}

export function flowerData(body: Record<string, unknown>) {
  return {
    name: text(body.name, 80),
    meaning: text(body.meaning, 200),
    symbolism: JSON.stringify(list(body.symbolism)),
    colors: JSON.stringify(list(body.colors)),
    season: text(body.season, 80),
    careLevel: text(body.careLevel, 40),
    image: text(body.image, 1000) || null,
    order: Number.isFinite(Number(body.order)) ? Math.round(Number(body.order)) : 0,
    isActive: body.isActive !== false,
  }
}
