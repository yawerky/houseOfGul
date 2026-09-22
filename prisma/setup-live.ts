// One-time setup for a new (live) database: admin login, categories,
// occasions and the P1–P4 products. Safe to run again — it updates instead
// of duplicating.
//
//   ADMIN_EMAIL="you@example.com" ADMIN_PASSWORD="a-strong-password" \
//   DATABASE_URL="<live database URL>" npx tsx prisma/setup-live.ts

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { execFileSync } from 'child_process'
import path from 'path'

const prisma = new PrismaClient()

const categories = [
  { name: 'Signature Collection', slug: 'signature-collection', order: 1 },
  { name: 'Romantic', slug: 'romantic', order: 2 },
  { name: 'Celebration', slug: 'celebration', order: 3 },
  { name: 'Seasonal', slug: 'seasonal', order: 4 },
  { name: 'Sympathy', slug: 'sympathy', order: 5 },
]

const occasions = [
  { name: 'Birthday', slug: 'birthday', order: 1 },
  { name: 'Anniversary', slug: 'anniversary', order: 2 },
  { name: 'Romance', slug: 'romance', order: 3 },
  { name: 'Thank You', slug: 'thank-you', order: 4 },
  { name: 'Congratulations', slug: 'congratulations', order: 5 },
  { name: 'Wedding', slug: 'wedding', order: 6 },
  { name: 'New Baby', slug: 'new-baby', order: 7 },
  { name: 'Sympathy', slug: 'sympathy', order: 8 },
]

async function main() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD
  if (!email || !password || password.length < 10) {
    throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD (at least 10 characters).')
  }

  await prisma.admin.upsert({
    where: { email },
    update: { password: await bcrypt.hash(password, 12) },
    create: { email, password: await bcrypt.hash(password, 12), name: 'Admin', role: 'admin' },
  })
  console.log(`✓ Admin login: ${email}`)

  for (const c of categories) {
    await prisma.category.upsert({ where: { slug: c.slug }, update: {}, create: c })
  }
  console.log(`✓ ${categories.length} categories`)

  for (const o of occasions) {
    await prisma.occasion.upsert({ where: { slug: o.slug }, update: {}, create: o })
  }
  console.log(`✓ ${occasions.length} occasions\n`)

  await prisma.$disconnect()

  // Products (same script used locally)
  execFileSync('npx', ['tsx', path.join(__dirname, 'seed-products.ts')], { stdio: 'inherit', env: process.env })
}

main().catch(async (error) => {
  console.error(error.message || error)
  await prisma.$disconnect()
  process.exit(1)
})
