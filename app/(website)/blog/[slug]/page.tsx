import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import SectionWrapper from '@/components/ui/SectionWrapper'
import BlogCard from '@/components/blog/BlogCard'
import BlogPostSchema from '@/components/seo/BlogPostSchema'

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  image: string
  date: string
  category: string
  author: string
}

async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const post = await prisma.blogPost.findFirst({
    where: { slug, published: true },
  })

  if (!post) return null

  return {
    id: post.slug,
    title: post.title,
    excerpt: post.excerpt || '',
    content: post.content,
    image: post.image || 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=800&q=80',
    date: post.publishedAt
      ? post.publishedAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      : '',
    category: post.category || 'General',
    author: post.author || 'House of Gul',
  }
}

async function getRelatedPosts(excludeSlug: string) {
  const posts = await prisma.blogPost.findMany({
    where: { published: true, slug: { not: excludeSlug } },
    take: 3,
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
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const dbPost = await prisma.blogPost.findFirst({
    where: { slug, published: true },
  })

  if (!dbPost) {
    return {
      title: 'Article Not Found',
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://houseofgul.com'
  const postImage = dbPost.image || `${siteUrl}/og-image.jpg`

  return {
    title: `${dbPost.title} | House of Gul Journal`,
    description: dbPost.excerpt || dbPost.title,
    openGraph: {
      title: dbPost.title,
      description: dbPost.excerpt || dbPost.title,
      url: `${siteUrl}/blog/${dbPost.slug}`,
      siteName: 'House of Gul',
      images: [
        {
          url: postImage,
          width: 1200,
          height: 630,
          alt: dbPost.title,
        },
      ],
      type: 'article',
      publishedTime: dbPost.publishedAt?.toISOString(),
      modifiedTime: dbPost.updatedAt.toISOString(),
      authors: [dbPost.author || 'House of Gul'],
    },
    twitter: {
      card: 'summary_large_image',
      title: dbPost.title,
      description: dbPost.excerpt || dbPost.title,
      images: [postImage],
    },
    alternates: {
      canonical: `${siteUrl}/blog/${dbPost.slug}`,
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params

  // Get raw post data for schema
  const dbPost = await prisma.blogPost.findFirst({
    where: { slug, published: true },
  })

  if (!dbPost) {
    notFound()
  }

  const post = await getBlogPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = await getRelatedPosts(slug)

  return (
    <>
      <BlogPostSchema
        title={dbPost.title}
        description={dbPost.excerpt || dbPost.title}
        slug={dbPost.slug}
        image={dbPost.image}
        publishedAt={dbPost.publishedAt || dbPost.createdAt}
        updatedAt={dbPost.updatedAt}
        author={dbPost.author || 'House of Gul'}
      />

      {/* Hero */}
      <section className="relative h-[60vh] min-h-[500px] flex items-end overflow-hidden pt-20">
        <div className="absolute inset-0">
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/30 to-transparent" />
        </div>
        <div className="relative z-10 luxury-container pb-16">
          <div className="max-w-3xl">
            <div className="flex items-center gap-4 text-xs tracking-widest uppercase text-ivory/80 mb-4">
              <span>{post.category}</span>
              <span className="w-1 h-1 rounded-full bg-gold" />
              <span>{post.date}</span>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-ivory mb-4">
              {post.title}
            </h1>
            <p className="text-ivory/80 text-lg">{post.excerpt}</p>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <SectionWrapper background="ivory">
        <div className="max-w-3xl mx-auto">
          {/* Author */}
          <div className="flex items-center gap-4 mb-12 pb-8 border-b border-blush-dark/20">
            <div className="w-12 h-12 rounded-full bg-champagne flex items-center justify-center">
              <span className="font-serif text-lg text-gold">G</span>
            </div>
            <div>
              <p className="text-charcoal font-medium">{post.author}</p>
              <p className="text-sm text-charcoal-light">{post.date}</p>
            </div>
          </div>

          {/* Content */}
          <article className="prose prose-lg max-w-none">
            {post.content.split('\n\n').map((paragraph, index) => (
              <p
                key={index}
                className="text-charcoal-light leading-relaxed mb-6"
              >
                {paragraph}
              </p>
            ))}
          </article>

          {/* Share */}
          <div className="mt-12 pt-8 border-t border-blush-dark/20">
            <p className="text-xs tracking-widest uppercase text-charcoal-light mb-4">
              Share This Article
            </p>
            <div className="flex gap-4">
              {['Facebook', 'Twitter', 'Pinterest'].map((platform) => (
                <button
                  key={platform}
                  className="text-charcoal hover:text-gold transition-colors duration-300"
                >
                  {platform}
                </button>
              ))}
            </div>
          </div>

          {/* Back Link */}
          <div className="mt-12">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-gold hover:text-gold-dark transition-colors duration-300"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16l-4-4m0 0l4-4m-4 4h18"
                />
              </svg>
              <span className="text-sm tracking-widest uppercase">
                Back to Journal
              </span>
            </Link>
          </div>
        </div>
      </SectionWrapper>

      {/* Related Articles */}
      <SectionWrapper background="champagne">
        <div className="text-center mb-12">
          <p className="luxury-subheading mb-4">Continue Reading</p>
          <h2 className="font-serif text-3xl text-charcoal mb-4">
            Related Articles
          </h2>
          <div className="luxury-divider" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {relatedPosts.map((relatedPost) => (
            <BlogCard key={relatedPost.id} post={relatedPost} />
          ))}
        </div>
      </SectionWrapper>
    </>
  )
}
