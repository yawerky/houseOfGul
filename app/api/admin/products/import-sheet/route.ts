import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'

function extractSheetId(url: string): string | null {
  // Match patterns like:
  // https://docs.google.com/spreadsheets/d/SHEET_ID/edit
  // https://docs.google.com/spreadsheets/d/SHEET_ID/
  const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)
  return match ? match[1] : null
}

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.split('\n').filter(line => line.trim())
  if (lines.length < 2) return []

  // Parse header row
  const headers = parseCSVLine(lines[0]).map(h => h.trim().toLowerCase())

  // Parse data rows
  const rows: Record<string, string>[] = []
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i])
    const row: Record<string, string> = {}
    headers.forEach((header, index) => {
      row[header] = values[index]?.trim() || ''
    })
    rows.push(row)
  }

  return rows
}

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current)
      current = ''
    } else {
      current += char
    }
  }
  result.push(current)

  return result
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { sheetUrl } = await request.json()

    if (!sheetUrl) {
      return NextResponse.json({ error: 'Sheet URL is required' }, { status: 400 })
    }

    const sheetId = extractSheetId(sheetUrl)
    if (!sheetId) {
      return NextResponse.json({ error: 'Invalid Google Sheet URL' }, { status: 400 })
    }

    // Fetch the sheet as CSV
    const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`

    const response = await fetch(csvUrl)
    if (!response.ok) {
      return NextResponse.json({
        error: 'Failed to fetch Google Sheet. Make sure it is publicly accessible (Share → Anyone with the link)'
      }, { status: 400 })
    }

    const csvText = await response.text()
    const rows = parseCSV(csvText)

    if (rows.length === 0) {
      return NextResponse.json({ error: 'No data found in the sheet' }, { status: 400 })
    }

    let success = 0
    let failed = 0
    const errors: string[] = []

    for (const row of rows) {
      try {
        // Skip empty rows
        if (!row.name || !row.price) {
          continue
        }

        const slug = row.slug || generateSlug(row.name)

        // Check if product with same slug exists
        const existing = await prisma.product.findUnique({
          where: { slug }
        })

        if (existing) {
          errors.push(`Product "${row.name}" skipped - slug "${slug}" already exists`)
          failed++
          continue
        }

        // Parse images (comma or newline separated)
        const images = row.images
          ? row.images.split(/[,\n]/).map((s: string) => s.trim()).filter(Boolean)
          : []

        // Parse flowers (comma separated)
        const flowers = row.flowers
          ? row.flowers.split(',').map((s: string) => s.trim()).filter(Boolean)
          : []

        await prisma.product.create({
          data: {
            name: row.name,
            slug,
            price: parseFloat(row.price) || 0,
            comparePrice: row.compareprice ? parseFloat(row.compareprice) : null,
            description: row.description || '',
            story: row.story || null,
            category: row.category || 'Uncategorized',
            occasion: row.occasion || null,
            season: row.season || 'all',
            flowers: JSON.stringify(flowers),
            images: JSON.stringify(images),
            featured: row.featured?.toLowerCase() === 'true' || row.featured === '1',
            inStock: row.instock?.toLowerCase() !== 'false' && row.instock !== '0',
            stockCount: parseInt(row.stockcount) || 100,
            deliveryInfo: row.deliveryinfo || null,
          },
        })

        success++
      } catch (err) {
        failed++
        errors.push(`Failed to import "${row.name}": ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
    }

    return NextResponse.json({
      success,
      failed,
      errors,
      message: `Imported ${success} products successfully${failed > 0 ? `, ${failed} failed` : ''}`
    })

  } catch (error) {
    console.error('Error importing from Google Sheet:', error)
    return NextResponse.json({ error: 'Failed to import products' }, { status: 500 })
  }
}
