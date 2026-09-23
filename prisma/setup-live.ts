// Prepares a database for the live site: admin login, categories, occasions
// and the P1–P7 products. Runs automatically on every Vercel build (see the
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
import { defaultJournalPosts, journalTextFixes, journalRewrites } from '../lib/journalDefaults'
import { jaipurPincodes, JAIPUR_DELIVERY_CHARGE } from '../lib/jaipurPincodes'

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

    // Flowers added to the guide after the first launch. Each batch runs once
    // and is then marked done, so a flower deleted in admin never comes back.
    const addedBatchKey = 'setup:flowerGuide:lily-carnation'
    if (!(await prisma.setting.findUnique({ where: { key: addedBatchKey } }))) {
      const laterFlowers = ['Lily', 'Carnation']
      let added = 0
      const toAdd: typeof defaultFlowerGuide = []
      for (const name of laterFlowers) {
        if (await prisma.flowerGuide.findFirst({ where: { name } })) continue
        const f = defaultFlowerGuide.find((d) => d.name === name)
        if (f) toAdd.push(f)
      }
      // They belong at 5 and 6, so make room by pushing everything from 5
      // down two places. Relative order of the existing flowers is kept.
      if (toAdd.length) {
        const lowest = Math.min(...toAdd.map((f) => f.order))
        await prisma.flowerGuide.updateMany({
          where: { order: { gte: lowest } },
          data: { order: { increment: toAdd.length } },
        })
      }
      for (const f of toAdd) {
        await prisma.flowerGuide.create({
          data: { ...f, symbolism: JSON.stringify(f.symbolism), colors: JSON.stringify(f.colors) },
        })
        added++
      }
      await prisma.setting.create({ data: { key: addedBatchKey, value: new Date().toISOString() } })
      console.log(`✓ Flower Guide: ${added} later flower(s) added`)
    }
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

  // Delivery-policy wording: update product delivery info and articles that
  // still carry the old midnight-delivery sentence (anything edited is left alone).
  const oldDeliveryInfo = "Same-day delivery across Jaipur. Midnight delivery available on request."
  const newDeliveryInfo = "Same-day delivery across Jaipur: order by 2 PM for delivery by 6 PM; later orders arrive by 12 PM."
  const oldInfoProducts = await prisma.product.findMany({ where: { deliveryInfo: { contains: oldDeliveryInfo } } })
  for (const p of oldInfoProducts) {
    await prisma.product.update({
      where: { id: p.id },
      data: { deliveryInfo: (p.deliveryInfo || '').replace(oldDeliveryInfo, newDeliveryInfo) },
    })
  }
  let fixedPosts = 0
  for (const fix of journalTextFixes) {
    const posts = await prisma.blogPost.findMany({ where: { content: { contains: fix.from } } })
    for (const post of posts) {
      await prisma.blogPost.update({ where: { id: post.id }, data: { content: post.content.replace(fix.from, fix.to) } })
      fixedPosts++
    }
  }
  if (oldInfoProducts.length || fixedPosts) {
    console.log(`✓ Delivery wording updated: ${oldInfoProducts.length} products, ${fixedPosts} articles`)
  }

  // Articles rewritten for search. Applied only where the article still carries
  // its original photo — a changed photo means it was edited in admin, so it is
  // left alone.
  let rewritten = 0
  for (const r of journalRewrites) {
    const post = defaultJournalPosts.find((d) => d.slug === r.slug)
    if (!post) continue
    const res = await prisma.blogPost.updateMany({
      where: { slug: r.slug, image: r.onlyIfImage },
      data: { title: post.title, excerpt: post.excerpt, content: post.content, image: post.image },
    })
    rewritten += res.count
  }
  if (rewritten) console.log(`✓ Journal: ${rewritten} article(s) rewritten`)

  // houseofgul.com belongs to someone else — never send order alerts there.
  await prisma.setting.updateMany({ where: { key: 'storeEmail', value: 'contact@houseofgul.com' }, data: { value: '' } })

  // Free delivery everywhere: switch old default charges and wording
  // (values that were changed in admin to something else are left alone).
  await prisma.setting.updateMany({ where: { key: 'defaultDeliveryCharge', value: '99' }, data: { value: '0' } })
  await prisma.setting.updateMany({ where: { key: 'freeDeliveryThreshold', value: '999' }, data: { value: '0' } })
  const oldFreeText = 'Free delivery on orders above ₹999.'
  const paidInfo = await prisma.product.findMany({ where: { deliveryInfo: { contains: oldFreeText } } })
  for (const p of paidInfo) {
    await prisma.product.update({
      where: { id: p.id },
      data: { deliveryInfo: (p.deliveryInfo || '').replace(oldFreeText, 'Free delivery across Jaipur.') },
    })
  }
  if (paidInfo.length) console.log(`✓ Free delivery wording updated on ${paidInfo.length} products`)
  const freedAreas = await prisma.pincode.updateMany({
    where: { city: 'Jaipur', deliveryCharge: 99 },
    data: { deliveryCharge: 0 },
  })
  if (freedAreas.count) console.log(`✓ Free delivery set on ${freedAreas.count} Jaipur pincodes`)

  // Delivery areas: add Jaipur city pincodes once, when none exist yet.
  if ((await prisma.pincode.count({ where: { city: 'Jaipur' } })) === 0) {
    for (const p of jaipurPincodes) {
      await prisma.pincode.upsert({
        where: { code: p.code },
        update: {},
        create: {
          code: p.code,
          area: p.area,
          city: 'Jaipur',
          state: 'Rajasthan',
          deliveryZone: p.zone || 'same-day',
          deliveryCharge: JAIPUR_DELIVERY_CHARGE,
          isActive: p.active !== false,
        },
      })
    }
    console.log(`✓ Delivery areas: ${jaipurPincodes.length} Jaipur pincodes added`)
  } else {
    // Pincodes added to the list after the first launch. Each batch runs once
    // and is then marked done, so an area switched off in admin never comes
    // back. Bump the key when more pincodes are added to the list.
    const areaBatchKey = 'setup:pincodes:2026-09-city-and-district'
    if (!(await prisma.setting.findUnique({ where: { key: areaBatchKey } }))) {
      let added = 0
      for (const p of jaipurPincodes) {
        if (await prisma.pincode.findUnique({ where: { code: p.code } })) continue
        await prisma.pincode.create({
          data: {
            code: p.code,
            area: p.area,
            city: 'Jaipur',
            state: 'Rajasthan',
            deliveryZone: p.zone || 'same-day',
            deliveryCharge: JAIPUR_DELIVERY_CHARGE,
            isActive: p.active !== false,
          },
        })
        added++
      }
      await prisma.setting.create({ data: { key: areaBatchKey, value: new Date().toISOString() } })
      if (added) console.log(`✓ Delivery areas: ${added} later pincode(s) added`)
    }

    // The far district areas were switched on before the cost of reaching them
    // was known. Switch them off once — anything turned back on in admin stays
    // on, because this runs a single time.
    const farOffKey = 'setup:pincodes:far-district-off'
    if (!(await prisma.setting.findUnique({ where: { key: farOffKey } }))) {
      const far = jaipurPincodes.filter((p) => p.active === false).map((p) => p.code)
      const res = await prisma.pincode.updateMany({
        where: { code: { in: far }, isActive: true },
        data: { isActive: false },
      })
      await prisma.setting.create({ data: { key: farOffKey, value: new Date().toISOString() } })
      if (res.count) console.log(`✓ Delivery areas: ${res.count} far district pincode(s) switched off`)
    }

    console.log('✓ Delivery areas already set up')
  }

  // Journal: publish the first articles once (matched by slug, never overwritten).
  let addedPosts = 0
  for (const [i, post] of defaultJournalPosts.entries()) {
    if (await prisma.blogPost.findUnique({ where: { slug: post.slug } })) continue
    await prisma.blogPost.create({
      data: {
        ...post,
        author: 'House of Gul',
        published: true,
        publishedAt: new Date(Date.now() - i * 60 * 1000),
      },
    })
    addedPosts++
  }
  console.log(`✓ Journal: ${addedPosts} articles published (${defaultJournalPosts.length - addedPosts} already there)`)

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
