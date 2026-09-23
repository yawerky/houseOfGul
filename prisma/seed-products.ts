// Adds or updates the P1–P7 products (all 4 seasons each).
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
  sku: string
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
  const files = ['products-p1-p4.json', 'products-p5-p6.json', 'products-p7.json']
  const products: SeedProduct[] = files.flatMap((name) =>
    JSON.parse(readFileSync(path.join(__dirname, 'data', name), 'utf8'))
  )
  const createOnly = process.argv.includes('--create-only')
  let created = 0

  for (const p of products) {
    const data = {
      sku: p.sku,
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
      const exists = await prisma.product.findUnique({ where: { slug: p.slug }, select: { id: true, sku: true } })
      if (exists) {
        // Only fill in a missing SKU; never change anything else.
        if (!exists.sku) {
          const taken = await prisma.product.findFirst({ where: { sku: p.sku }, select: { id: true } })
          if (!taken) {
            await prisma.product.update({ where: { id: exists.id }, data: { sku: p.sku } })
            console.log(`✓ ${p.slug}  SKU set to ${p.sku}`)
          }
        }
        continue
      }
      await prisma.product.create({ data: { slug: p.slug, ...data } })
    } else {
      await prisma.product.upsert({
        where: { slug: p.slug },
        update: data,
        create: { slug: p.slug, ...data },
      })
    }
    created++
    console.log(`✓ ${p.slug}  ${p.sku}  ₹${p.price}  (${p.images.length} images)`)
  }
  console.log(`\nDone: ${created} of ${products.length} products ${createOnly ? 'added (existing ones kept)' : 'added or updated'}.`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
