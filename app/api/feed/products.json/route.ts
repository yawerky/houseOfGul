import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://houseofgul.com'

  try {
    const products = await prisma.product.findMany({
      where: { inStock: true },
    })

    const feed = {
      version: '1.0',
      title: 'House of Gul - Product Catalog',
      description: 'Premium flower delivery in Jaipur',
      link: siteUrl,
      updated: new Date().toISOString(),
      products: products.map((product) => {
        const images = JSON.parse(product.images || '[]')
        const sku = `HOG-${product.slug.toUpperCase()}`

        return {
          id: sku,
          sku: sku,
          title: product.name,
          description: product.description,
          link: `${siteUrl}/product/${product.slug}`,
          image_link: images[0] || `${siteUrl}/og-image.jpg`,
          additional_images: images.slice(1),
          price: {
            amount: product.price,
            currency: 'INR',
          },
          sale_price: product.comparePrice ? {
            amount: product.price,
            currency: 'INR',
            original_price: product.comparePrice,
          } : null,
          availability: product.inStock ? 'in_stock' : 'out_of_stock',
          condition: 'new',
          brand: 'House of Gul',
          category: product.category,
          product_type: `Flowers > ${product.category}`,
          shipping: {
            country: 'IN',
            region: 'Rajasthan',
            city: 'Jaipur',
            price: 0,
            currency: 'INR',
            delivery_time: {
              min_days: 0,
              max_days: 1,
            },
          },
          return_policy: {
            days: 1,
            type: 'full_refund',
            condition: 'Flowers must be in delivered condition',
          },
        }
      }),
    }

    return NextResponse.json(feed, {
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  } catch (error) {
    console.error('Error generating product feed:', error)
    return NextResponse.json({ error: 'Error generating feed' }, { status: 500 })
  }
}
