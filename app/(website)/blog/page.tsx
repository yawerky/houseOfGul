import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import BlogCard from '@/components/blog/BlogCard'
import SectionWrapper from '@/components/ui/SectionWrapper'
import Image from 'next/image'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://houseofgul.com'

export const metadata: Metadata = {
  title: 'Flower Blog | Jaipur Florist Tips & Guides',
  description:
    'Read our flower blog for Jaipur flower delivery tips, flower care guides, wedding flower ideas, gifting inspiration and floral arrangement tutorials from Jaipur\'s best florist.',
  keywords: [
    'flower blog jaipur',
    'flower care tips',
    'wedding flowers jaipur',
    'flower arrangement ideas',
    'jaipur florist blog',
  ],
  openGraph: {
    title: 'Flower Blog | House of Gul Jaipur',
    description: 'Floral inspiration, flower care guides, and gifting tips from Jaipur\'s best florist.',
    url: `${siteUrl}/blog`,
    siteName: 'House of Gul',
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'House of Gul Flower Blog Jaipur',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Flower Blog | House of Gul Jaipur',
    description: 'Floral inspiration and guides from Jaipur\'s best florist.',
    images: [`${siteUrl}/og-image.jpg`],
  },
  alternates: {
    canonical: `${siteUrl}/blog`,
  },
}

async function getBlogPosts() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
    })

    return posts.map((post) => ({
      id: post.slug,
      title: post.title,
      excerpt: post.excerpt || '',
      image: post.image || 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=800&q=80',
      date: post.publishedAt
        ? post.publishedAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        : '',
      category: post.category || 'General',
    }))
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
}

export default async function BlogPage() {
  const blogPosts = await getBlogPosts()
  const featuredPost = blogPosts[0]
  const otherPosts = blogPosts.slice(1)

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1494972308805-463bc619d34e?w=1920&q=80"
            alt="House of Gul journal"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-charcoal/40" />
        </div>
        <div className="relative z-10 text-center px-4">
          <p className="text-xs md:text-sm tracking-[0.4em] uppercase text-gold mb-4">
            Stories & Inspiration
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-ivory mb-4">
            The Journal
          </h1>
          <div className="w-16 h-px bg-gold mx-auto" />
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <SectionWrapper background="ivory">
          <div className="mb-12">
            <p className="luxury-subheading mb-4">Featured</p>
            <div className="luxury-divider ml-0" />
          </div>
          <BlogCard post={featuredPost} featured />
        </SectionWrapper>
      )}

      {/* Other Posts */}
      {otherPosts.length > 0 ? (
        <SectionWrapper background="champagne">
          <div className="text-center mb-12">
            <p className="luxury-subheading mb-4">Latest Articles</p>
            <h2 className="font-serif text-3xl text-charcoal mb-4">
              From Our Journal
            </h2>
            <div className="luxury-divider" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </SectionWrapper>
      ) : !featuredPost && (
        <SectionWrapper background="ivory">
          <div className="text-center py-12">
            <p className="text-charcoal-light">No articles published yet. Check back soon!</p>
          </div>
        </SectionWrapper>
      )}

      {/* Categories */}
      <SectionWrapper background="white" padding="md">
        <div className="flex flex-wrap justify-center gap-4">
          {['All', 'Gifting Guide', 'Trends', 'Flower Meanings', 'Care Guide'].map(
            (category) => (
              <button
                key={category}
                className="px-6 py-2 text-sm tracking-widest uppercase text-charcoal border border-blush-dark/30 hover:border-gold hover:text-gold transition-colors duration-300"
              >
                {category}
              </button>
            )
          )}
        </div>
      </SectionWrapper>
    </>
  )
}
