// Adds or updates the P1–P4 products (all 4 seasons each).
// Safe to run more than once: products are matched by URL slug.
// With --create-only, existing products are left untouched (used on every
// Vercel deploy so edits made in admin are never overwritten).
//
//   Local:  DATABASE_URL="file:./dev.db" npx tsx prisma/seed-products.ts
//   Live:   DATABASE_URL="<your live database URL>" npx tsx prisma/seed-products.ts

import { PrismaClient } from '@prisma/client'
import { readFileSync } from 'fs'
import path from 'path'

interface SeedProduct {
  name: string
  slug: string
  price: number
  category: string
  occasion: string
  season: string
  flowers: string[]
  story: string
  description: string
  deliveryInfo: string
  images: string[]
  featured: boolean
}

const prisma = new PrismaClient()

async function main() {
  const file = path.join(__dirname, 'data', 'products-p1-p4.json')
  const products: SeedProduct[] = JSON.parse(readFileSync(file, 'utf8'))
  const createOnly = process.argv.includes('--create-only')
  let created = 0

  for (const p of products) {
    const data = {
      name: p.name,
      price: p.price,
      description: p.description,
      story: p.story,
      category: p.category,
      occasion: p.occasion,
      season: p.season,
      flowers: JSON.stringify(p.flowers),
      images: JSON.stringify(p.images),
      featured: p.featured,
      inStock: true,
      deliveryInfo: p.deliveryInfo,
    }
    if (createOnly) {
      const exists = await prisma.product.findUnique({ where: { slug: p.slug }, select: { id: true } })
      if (exists) continue
      await prisma.product.create({ data: { slug: p.slug, ...data } })
    } else {
      await prisma.product.upsert({
        where: { slug: p.slug },
        update: data,
        create: { slug: p.slug, ...data },
      })
    }
    created++
    console.log(`✓ ${p.slug}  ₹${p.price}  (${p.images.length} images)`)
  }
  console.log(`\nDone: ${created} of ${products.length} products ${createOnly ? 'added (existing ones kept)' : 'added or updated'}.`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
