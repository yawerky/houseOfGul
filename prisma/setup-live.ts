// Prepares a database for the live site: admin login, categories, occasions
// and the P1–P4 products. Runs automatically on every Vercel build (see the
// "build" script in package.json) and only ADDS what is missing — it never
// changes or deletes anything already in the database.
//
// Admin login is created from the ADMIN_EMAIL and ADMIN_PASSWORD settings
// (set them in Vercel → Environment Variables). If an admin with that email
// already exists, its password is not changed — use Admin → Settings for that.

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { execFileSync } from 'child_process'
import path from 'path'
import { defaultFlowerGuide, previousFlowerImages } from '../lib/flowerGuideDefaults'
import { defaultBanners, replacedBannerImages } from '../lib/bannerDefaults'

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
  if (!process.env.DATABASE_URL) {
    console.log('setup-live: no DATABASE_URL, skipping.')
    return
  }

  const email = process.env.ADMIN_EMAIL?.trim()
  const password = process.env.ADMIN_PASSWORD
  if (email && password && password.length >= 10) {
    const existing = await prisma.admin.findUnique({ where: { email } })
    if (!existing) {
      await prisma.admin.create({
        data: { email, password: await bcrypt.hash(password, 12), name: 'Admin', role: 'admin' },
      })
      console.log(`✓ Admin login created: ${email}`)
    } else {
      console.log(`✓ Admin login exists: ${email}`)
    }
  } else if (email || password) {
    console.log('! ADMIN_PASSWORD must be at least 10 characters — admin login not created.')
  } else {
    console.log('! ADMIN_EMAIL / ADMIN_PASSWORD not set — admin login not created.')
  }

  for (const c of categories) {
    await prisma.category.upsert({ where: { slug: c.slug }, update: {}, create: c })
  }
  for (const o of occasions) {
    await prisma.occasion.upsert({ where: { slug: o.slug }, update: {}, create: o })
  }
  console.log(`✓ ${categories.length} categories and ${occasions.length} occasions ready`)

  // Flower Guide: add the starting flowers only when the guide is empty,
  // so flowers deleted in admin never come back.
  if ((await prisma.flowerGuide.count()) === 0) {
    for (const f of defaultFlowerGuide) {
      await prisma.flowerGuide.create({
        data: { ...f, symbolism: JSON.stringify(f.symbolism), colors: JSON.stringify(f.colors) },
      })
    }
    console.log(`✓ Flower Guide: ${defaultFlowerGuide.length} flowers added`)
  } else {
    // Swap temporary product photos for the proper flower photos, only where
    // the photo hasn't been changed in admin.
    let updated = 0
    for (const [oldImage, newImage] of Object.entries(previousFlowerImages)) {
      const res = await prisma.flowerGuide.updateMany({ where: { image: oldImage }, data: { image: newImage } })
      updated += res.count
    }
    console.log(`✓ Flower Guide already set up${updated ? ` (${updated} photos updated)` : ''}`)
  }

  for (const [oldImage, newImage] of Object.entries(replacedBannerImages)) {
    const res = await prisma.banner.updateMany({ where: { image: oldImage }, data: { image: newImage } })
    if (res.count) console.log(`✓ Banners: ${res.count} switched to ${newImage}`)
  }

  // Banners: add the shipped banner for any position that has none yet.
  let addedBanners = 0
  for (const b of defaultBanners) {
    if ((await prisma.banner.count({ where: { position: b.position } })) > 0) continue
    await prisma.banner.create({ data: { ...b, isActive: true, order: 0 } })
    addedBanners++
  }
  console.log(`✓ Banners: ${addedBanners} added (${defaultBanners.length - addedBanners} positions already had one)`)

  await prisma.$disconnect()

  execFileSync(process.execPath, [require.resolve('tsx/cli'), path.join(__dirname, 'seed-products.ts'), '--create-only'], {
    stdio: 'inherit',
    env: process.env,
  })
}

main().catch(async (error) => {
  console.error(error.message || error)
  await prisma.$disconnect()
  process.exit(1)
})
