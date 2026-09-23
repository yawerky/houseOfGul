import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'

interface StoryPageProps {
  params: Promise<{
    slug: string
  }>
}

async function getProduct(slug: string) {
  try {
    return await prisma.product.findFirst({
      where: { slug, inStock: true },
    })
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: StoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    return { title: 'Story Not Found' }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://houseofgul.in'
  const images = JSON.parse(product.images || '[]')

  return {
    title: `${product.name} | Story`,
    description: product.description || `Discover ${product.name}`,
    openGraph: {
      title: product.name,
      description: product.description || '',
      images: images[0] ? [{ url: images[0] }] : [],
      type: 'article',
    },
    other: {
      'amp-story': 'true',
    },
  }
}

export default async function StoryPage({ params }: StoryPageProps) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    notFound()
  }

  const images = JSON.parse(product.images || '[]')
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://houseofgul.in'

  // Generate Web Story HTML
  const storyHtml = `
<!DOCTYPE html>
<html amp lang="en">
<head>
  <meta charset="utf-8">
  <script async src="https://cdn.ampproject.org/v0.js"></script>
  <script async custom-element="amp-story" src="https://cdn.ampproject.org/v0/amp-story-1.0.js"></script>
  <title>${product.name} - House of Gul</title>
  <link rel="canonical" href="${siteUrl}/stories/${slug}">
  <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
  <style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style>
  <noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
  <style amp-custom>
    amp-story-page { background: #1a1a1a; }
    .title { font-family: serif; font-size: 2rem; color: #D4AF37; }
    .subtitle { font-size: 1rem; color: #fff; opacity: 0.8; }
    .price { font-size: 1.5rem; color: #D4AF37; font-weight: bold; }
    .cta { background: #D4AF37; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; }
  </style>
</head>
<body>
  <amp-story
    standalone
    title="${product.name}"
    publisher="House of Gul"
    publisher-logo-src="${siteUrl}/images/logo.png"
    poster-portrait-src="${images[0] || `${siteUrl}/og-image.jpg`}"
  >
    <!-- Cover Page -->
    <amp-story-page id="cover">
      <amp-story-grid-layer template="fill">
        <amp-img src="${images[0] || `${siteUrl}/og-image.jpg`}" width="720" height="1280" layout="responsive" alt="${product.name}"></amp-img>
      </amp-story-grid-layer>
      <amp-story-grid-layer template="vertical" class="bottom">
        <h1 class="title">${product.name}</h1>
        <p class="subtitle">Flower Delivery Jaipur</p>
      </amp-story-grid-layer>
    </amp-story-page>

    ${images.slice(1, 4).map((img: string, i: number) => `
    <!-- Image Page ${i + 2} -->
    <amp-story-page id="page-${i + 2}">
      <amp-story-grid-layer template="fill">
        <amp-img src="${img}" width="720" height="1280" layout="responsive" alt="${product.name}"></amp-img>
      </amp-story-grid-layer>
    </amp-story-page>
    `).join('')}

    <!-- Price Page -->
    <amp-story-page id="price">
      <amp-story-grid-layer template="fill">
        <amp-img src="${images[0] || `${siteUrl}/og-image.jpg`}" width="720" height="1280" layout="responsive" alt="${product.name}"></amp-img>
      </amp-story-grid-layer>
      <amp-story-grid-layer template="vertical" class="center">
        <p class="price">₹${product.price}</p>
        <h2 class="title">${product.name}</h2>
        <p class="subtitle">Same-day delivery in Jaipur</p>
      </amp-story-grid-layer>
    </amp-story-page>

    <!-- CTA Page -->
    <amp-story-page id="cta">
      <amp-story-grid-layer template="fill">
        <amp-img src="${images[0] || `${siteUrl}/og-image.jpg`}" width="720" height="1280" layout="responsive" alt="${product.name}"></amp-img>
      </amp-story-grid-layer>
      <amp-story-grid-layer template="vertical" class="center">
        <h2 class="title">Order Now</h2>
        <p class="subtitle">Free delivery across Jaipur</p>
        <a href="${siteUrl}/product/${slug}" class="cta">Shop Now</a>
      </amp-story-grid-layer>
      <amp-story-cta-layer>
        <a href="${siteUrl}/product/${slug}" class="cta">Buy ${product.name}</a>
      </amp-story-cta-layer>
    </amp-story-page>
  </amp-story>
</body>
</html>
  `.trim()

  return (
    <div dangerouslySetInnerHTML={{ __html: storyHtml }} />
  )
}
