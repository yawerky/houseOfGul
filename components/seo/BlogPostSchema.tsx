interface BlogPostSchemaProps {
  title: string
  description: string
  slug: string
  image: string | null
  publishedAt: Date
  updatedAt: Date
  author?: string
}

export default function BlogPostSchema({
  title,
  description,
  slug,
  image,
  publishedAt,
  updatedAt,
  author = 'House of Gul',
}: BlogPostSchemaProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://houseofgul.com'

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${siteUrl}/blog/${slug}#article`,
    headline: title,
    description,
    url: `${siteUrl}/blog/${slug}`,
    image: image || `${siteUrl}/og-image.jpg`,
    datePublished: publishedAt.toISOString(),
    dateModified: updatedAt.toISOString(),
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'House of Gul',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/blog/${slug}`,
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${siteUrl}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: title,
        item: `${siteUrl}/blog/${slug}`,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
    </>
  )
}
