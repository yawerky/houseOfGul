import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://houseofgul.com'

  try {
    const products = await prisma.product.findMany({
      where: { inStock: true },
    })

    const xmlItems = products.map((product) => {
      const images = JSON.parse(product.images || '[]')
      const imageUrl = images[0] || `${siteUrl}/og-image.jpg`
      const sku = product.sku || `HOG-${product.slug.toUpperCase()}`

      return `
    <item>
      <g:id>${sku}</g:id>
      <g:title><![CDATA[${product.name}]]></g:title>
      <g:description><![CDATA[${product.description || `${product.name} - Fresh flower delivery in Jaipur`}]]></g:description>
      <g:link>${siteUrl}/product/${product.slug}</g:link>
      <g:image_link>${imageUrl}</g:image_link>
      ${images.slice(1, 10).map((img: string) => `<g:additional_image_link>${img}</g:additional_image_link>`).join('\n      ')}
      <g:availability>${product.inStock ? 'in_stock' : 'out_of_stock'}</g:availability>
      <g:price>${product.price.toFixed(2)} INR</g:price>
      ${product.comparePrice ? `<g:sale_price>${product.price.toFixed(2)} INR</g:sale_price>` : ''}
      <g:brand>House of Gul</g:brand>
      <g:condition>new</g:condition>
      <g:product_type><![CDATA[Flowers > ${product.category}]]></g:product_type>
      <g:google_product_category>2671</g:google_product_category>
      <g:identifier_exists>false</g:identifier_exists>
      <g:mpn>${sku}</g:mpn>
      <g:shipping>
        <g:country>IN</g:country>
        <g:region>Rajasthan</g:region>
        <g:service>Standard</g:service>
        <g:price>0 INR</g:price>
      </g:shipping>
      <g:shipping_label>free_shipping</g:shipping_label>
      <g:return_policy_label>1_day_returns</g:return_policy_label>
    </item>`
    }).join('')

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>House of Gul - Flower Delivery Jaipur</title>
    <link>${siteUrl}</link>
    <description>Premium flower delivery in Jaipur. Fresh bouquets, wedding flowers, and same-day delivery.</description>
    ${xmlItems}
  </channel>
</rss>`

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  } catch (error) {
    console.error('Error generating product feed:', error)
    return new NextResponse('Error generating feed', { status: 500 })
  }
}
