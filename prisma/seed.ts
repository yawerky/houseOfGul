import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)

  const admin = await prisma.admin.upsert({
    where: { email: 'admin@houseofgul.com' },
    update: {},
    create: {
      email: 'admin@houseofgul.com',
      password: hashedPassword,
      name: 'Admin',
      role: 'admin',
    },
  })

  console.log('Admin user created:', admin.email)

  // Create sample categories
  const categories = [
    { name: 'Signature Collection', slug: 'signature-collection', order: 1 },
    { name: 'Romantic', slug: 'romantic', order: 2 },
    { name: 'Sympathy', slug: 'sympathy', order: 3 },
    { name: 'Celebration', slug: 'celebration', order: 4 },
    { name: 'Seasonal', slug: 'seasonal', order: 5 },
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    })
  }

  console.log('Categories created')

  // Create sample pincodes
  const pincodes = [
    { code: '110001', area: 'Connaught Place', city: 'New Delhi', state: 'Delhi', deliveryZone: 'same-day', deliveryCharge: 0, minOrderFree: 200 },
    { code: '110002', area: 'Darya Ganj', city: 'New Delhi', state: 'Delhi', deliveryZone: 'same-day', deliveryCharge: 0, minOrderFree: 200 },
    { code: '110003', area: 'Civil Lines', city: 'New Delhi', state: 'Delhi', deliveryZone: 'same-day', deliveryCharge: 0, minOrderFree: 200 },
    { code: '400001', area: 'Fort', city: 'Mumbai', state: 'Maharashtra', deliveryZone: 'next-day', deliveryCharge: 50, minOrderFree: 300 },
    { code: '400002', area: 'Kalbadevi', city: 'Mumbai', state: 'Maharashtra', deliveryZone: 'next-day', deliveryCharge: 50, minOrderFree: 300 },
    { code: '560001', area: 'MG Road', city: 'Bangalore', state: 'Karnataka', deliveryZone: 'next-day', deliveryCharge: 50, minOrderFree: 300 },
  ]

  for (const pincode of pincodes) {
    await prisma.pincode.upsert({
      where: { code: pincode.code },
      update: {},
      create: pincode,
    })
  }

  console.log('Pincodes created')

  // Create sample products
  const products = [
    {
      name: 'Eternal Elegance',
      slug: 'eternal-elegance',
      price: 189,
      description: 'A stunning arrangement of premium roses and orchids.',
      story: 'Crafted for those special moments that deserve perfection.',
      category: 'Signature Collection',
      occasion: 'anniversary',
      season: 'all',
      flowers: JSON.stringify(['Roses', 'Orchids', 'Eucalyptus']),
      images: JSON.stringify(['/images/products/bouquet-1.jpg']),
      featured: true,
      deliveryInfo: 'Same-day delivery available',
    },
    {
      name: 'Blushing Romance',
      slug: 'blushing-romance',
      price: 159,
      description: 'Delicate pink peonies paired with garden roses.',
      story: 'A tender expression of love and admiration.',
      category: 'Romantic',
      occasion: 'romance',
      season: 'spring',
      flowers: JSON.stringify(['Peonies', 'Garden Roses', 'Ranunculus']),
      images: JSON.stringify(['/images/products/bouquet-2.jpg']),
      featured: true,
      deliveryInfo: 'Same-day delivery available',
    },
    {
      name: 'Midnight Velvet',
      slug: 'midnight-velvet',
      price: 229,
      description: 'Deep burgundy roses with dramatic dark foliage.',
      story: 'For moments that call for drama and sophistication.',
      category: 'Signature Collection',
      occasion: 'anniversary',
      season: 'all',
      flowers: JSON.stringify(['Burgundy Roses', 'Calla Lilies', 'Dark Foliage']),
      images: JSON.stringify(['/images/products/bouquet-3.jpg']),
      featured: true,
      deliveryInfo: 'Same-day delivery available',
    },
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    })
  }

  console.log('Products created')

  console.log('\n✅ Seed completed!')
  console.log('\nAdmin Login Credentials:')
  console.log('Email: admin@houseofgul.com')
  console.log('Password: admin123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
