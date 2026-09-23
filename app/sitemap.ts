import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

// Always read the latest products, banners and posts from the database.
export const dynamic = 'force-dynamic'


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://houseofgul.in'

  // Static pages - optimized for Jaipur local SEO
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/flower-guide`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/gul-club`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/track-order`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  try {
    // Get all products
    const products = await prisma.product.findMany({
      where: { inStock: true },
      select: { slug: true, updatedAt: true },
    })

    // Get all blog posts
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    })

    // Get all categories
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      select: { slug: true },
    })

    // Get all occasions
    const occasions = await prisma.occasion.findMany({
      where: { isActive: true },
      select: { slug: true },
    })

    // Category pages (dedicated cluster pages)
    const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
      url: `${baseUrl}/category/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }))

    // Occasion pages (dedicated cluster pages)
    const occasionPages: MetadataRoute.Sitemap = occasions.map((occ) => ({
      url: `${baseUrl}/occasion/${occ.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }))

    // Web Stories
    const storyPages: MetadataRoute.Sitemap = products.slice(0, 10).map((product) => ({
      url: `${baseUrl}/stories/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    // Product pages
    const productPages: MetadataRoute.Sitemap = products.map((product) => ({
      url: `${baseUrl}/product/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    // Blog pages
    const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

    return [...staticPages, ...categoryPages, ...occasionPages, ...productPages, ...blogPages, ...storyPages]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return staticPages
  }
}
