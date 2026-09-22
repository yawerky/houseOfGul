import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Product } from '@/lib/products'
import { generateReviews, calculateRatingSummary, generateFAQs } from '@/lib/reviews'
import ProductPageClient from '@/components/product/ProductPageClient'
import ProductCard from '@/components/shop/ProductCard'
import SectionWrapper from '@/components/ui/SectionWrapper'
import ProductSchema from '@/components/seo/ProductSchema'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import QuickSummary from '@/components/product/QuickSummary'
import ProductSpecifications from '@/components/product/ProductSpecifications'
import ProductReviews from '@/components/product/ProductReviews'
import ProductFAQ from '@/components/product/ProductFAQ'
import type { SeasonOption } from '@/components/product/SeasonPicker'
import { mapDbProduct } from '@/lib/productMapper'
import { collapseSeasonVariants, currentSeason, parseSeasonSlug, seasonInfo, sortBySeason } from '@/lib/variants'

interface ProductPageProps {
  params: Promise<{
    id: string
  }>
}

async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const dbProduct = await prisma.product.findFirst({
      where: { slug, inStock: true },
    })

    if (!dbProduct) return null

    return {
      id: dbProduct.slug,
      name: dbProduct.name,
      price: dbProduct.price,
      description: dbProduct.description || '',
      story: dbProduct.story || '',
      flowers: JSON.parse(dbProduct.flowers || '[]'),
      images: JSON.parse(dbProduct.images || '[]'),
      category: dbProduct.category || 'Uncategorized',
      featured: dbProduct.featured,
      deliveryInfo: dbProduct.deliveryInfo || 'Same-day delivery available in select areas.',
      occasions: dbProduct.occasion ? [dbProduct.occasion] : [],
      season: dbProduct.season || 'all',
      rating: dbProduct.rating || 4.5,
      reviewCount: dbProduct.reviewCount || 0,
    }
  } catch {
    return null
  }
}

async function getRelatedProducts(excludeSlug: string, category: string): Promise<Product[]> {
  try {
    const base = parseSeasonSlug(excludeSlug)?.base
    const notSameProduct = (slug: string) =>
      slug !== excludeSlug && (!base || parseSeasonSlug(slug)?.base !== base)

    // First try products from the same category, then featured products
    const sameCategory = await prisma.product.findMany({
      where: { inStock: true, slug: { not: excludeSlug }, category },
      take: 16,
    })
    let candidates = sameCategory.filter((p) => notSameProduct(p.slug))

    if (collapseSeasonVariants(candidates).items.length < 4) {
      const featured = await prisma.product.findMany({
        where: {
          inStock: true,
          slug: { not: excludeSlug, notIn: candidates.map((p) => p.slug) },
          featured: true,
        },
        take: 16,
      })
      candidates = [...candidates, ...featured.filter((p) => notSameProduct(p.slug))]
    }

    const { items, seasonCounts } = collapseSeasonVariants(candidates)
    return items.slice(0, 4).map((p) => mapDbProduct(p, seasonCounts.get(p.slug)))
  } catch {
    return []
  }
}

async function getSeasonOptions(slug: string): Promise<SeasonOption[]> {
  const parsed = parseSeasonSlug(slug)
  if (!parsed) return []
  try {
    const siblings = await prisma.product.findMany({
      where: { inStock: true, slug: { startsWith: `${parsed.base}-` } },
    })
    const group = sortBySeason(siblings.filter((p) => parseSeasonSlug(p.slug)?.base === parsed.base))
    if (group.length < 2) return []
    const now = currentSeason()
    return group.map((p) => {
      const season = parseSeasonSlug(p.slug)!.season
      let image: string | null = null
      try {
        image = (JSON.parse(p.images || '[]') as string[])[0] || null
      } catch {
        image = null
      }
      return {
        slug: p.slug,
        season,
        label: seasonInfo[season].label,
        months: seasonInfo[season].months,
        price: p.price,
        image,
        isCurrentSeason: season === now,
      }
    })
  } catch {
    return []
  }
}

async function getCategorySlug(categoryName: string) {
  try {
    const category = await prisma.category.findFirst({
      where: { name: categoryName, isActive: true },
      select: { slug: true },
    })
    return category?.slug
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params

  try {
    const dbProduct = await prisma.product.findFirst({
      where: { slug: id, inStock: true },
    })

    if (!dbProduct) {
      return { title: 'Product Not Found' }
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://houseofgul.com'
    const images = JSON.parse(dbProduct.images || '[]')
    const productImage = images[0] || `${siteUrl}/og-image.jpg`

    return {
      title: `${dbProduct.name} - Buy Online | Flower Delivery Jaipur`,
      description: `Buy ${dbProduct.name} online in Jaipur. ${dbProduct.description || 'Premium quality floral arrangement.'} Same-day flower delivery across Jaipur. Order now!`,
      keywords: [
        `${dbProduct.name.toLowerCase()} jaipur`,
        `buy ${dbProduct.name.toLowerCase()} online jaipur`,
        `${dbProduct.category?.toLowerCase()} flowers jaipur`,
        'flower delivery jaipur',
      ],
      openGraph: {
        title: `${dbProduct.name} | Flower Delivery Jaipur`,
        description: `Buy ${dbProduct.name} online with same-day delivery in Jaipur.`,
        url: `${siteUrl}/product/${dbProduct.slug}`,
        siteName: 'House of Gul',
        images: [{ url: productImage, width: 800, height: 800, alt: dbProduct.name }],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${dbProduct.name} | House of Gul`,
        description: dbProduct.description || `Buy ${dbProduct.name} from House of Gul`,
        images: [productImage],
      },
      alternates: {
        canonical: `${siteUrl}/product/${dbProduct.slug}`,
      },
    }
  } catch {
    return { title: 'Product Not Found' }
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params

  let dbProduct
  try {
    dbProduct = await prisma.product.findFirst({
      where: { slug: id, inStock: true },
    })
  } catch {
    notFound()
  }

  if (!dbProduct) {
    notFound()
  }

  const product = await getProductBySlug(id)

  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(id, dbProduct.category || '')
  const seasonOptions = await getSeasonOptions(id)
  const categorySlug = await getCategorySlug(dbProduct.category || '')
  const images = JSON.parse(dbProduct.images || '[]')
  const flowers = JSON.parse(dbProduct.flowers || '[]')

  // Generate reviews and FAQs
  const reviews = generateReviews(id, 50)
  const ratingSummary = calculateRatingSummary(reviews)
  const faqs = generateFAQs(id)

  return (
    <>
      <ProductSchema
        name={dbProduct.name}
        description={dbProduct.description || ''}
        slug={dbProduct.slug}
        price={dbProduct.price}
        comparePrice={dbProduct.comparePrice}
        images={images}
        inStock={dbProduct.inStock}
        category={dbProduct.category || 'Flowers'}
        ratingValue={ratingSummary.average}
        reviewCount={ratingSummary.total}
      />

      {/* Product Section */}
      <section className="pt-28 md:pt-32 pb-8 bg-ivory">
        <div className="luxury-container">
          {/* Breadcrumbs */}
          <Breadcrumbs
            items={[
              { label: 'Shop', href: '/shop' },
              ...(categorySlug
                ? [{ label: dbProduct.category || 'Flowers', href: `/category/${categorySlug}` }]
                : [{ label: dbProduct.category || 'Flowers' }]
              ),
              { label: dbProduct.name },
            ]}
          />

          <ProductPageClient product={product} seasonOptions={seasonOptions} />
        </div>
      </section>

      {/* Quick Summary */}
      <QuickSummary
        name={dbProduct.name}
        category={dbProduct.category || 'Flowers'}
        flowers={flowers}
        deliveryInfo={dbProduct.deliveryInfo || 'Same-day delivery in Jaipur'}
        occasion={dbProduct.occasion}
      />

      {/* Product Specifications / Description / Care */}
      <ProductSpecifications
        name={dbProduct.name}
        description={dbProduct.description || `${dbProduct.name} is a beautiful floral arrangement perfect for any occasion. Hand-crafted by our expert florists in Jaipur using the freshest flowers.`}
        story={dbProduct.story || undefined}
        flowers={flowers}
        category={dbProduct.category || 'Flowers'}
        occasion={dbProduct.occasion || undefined}
        deliveryInfo={dbProduct.deliveryInfo || 'Same-day delivery available in Jaipur'}
        season={dbProduct.season || 'all'}
      />

      {/* Customer Reviews */}
      <ProductReviews
        reviews={reviews}
        summary={ratingSummary}
        productName={dbProduct.name}
      />

      {/* FAQs */}
      <ProductFAQ
        faqs={faqs}
        productName={dbProduct.name}
      />

      {/* Interlinking - Category & Occasion */}
      <SectionWrapper background="white" padding="md">
        <div className="flex flex-wrap justify-center gap-3">
          {categorySlug && (
            <Link
              href={`/category/${categorySlug}`}
              className="px-4 py-2 bg-champagne text-charcoal rounded-sm hover:bg-gold hover:text-white transition-colors text-sm"
            >
              More {dbProduct.category} Flowers →
            </Link>
          )}
          {dbProduct.occasion && (
            <Link
              href={`/occasion/${dbProduct.occasion.toLowerCase().replace(/\s+/g, '-')}`}
              className="px-4 py-2 bg-champagne text-charcoal rounded-sm hover:bg-gold hover:text-white transition-colors text-sm"
            >
              More {dbProduct.occasion} Flowers →
            </Link>
          )}
          <Link
            href="/shop"
            className="px-4 py-2 bg-champagne text-charcoal rounded-sm hover:bg-gold hover:text-white transition-colors text-sm"
          >
            Browse All Flowers →
          </Link>
        </div>
      </SectionWrapper>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <SectionWrapper background="champagne">
          <div className="text-center mb-12">
            <p className="luxury-subheading mb-4">Complete Your Selection</p>
            <h2 className="font-serif text-3xl text-charcoal mb-4">
              You May Also Love
            </h2>
            <div className="luxury-divider" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </SectionWrapper>
      )}
    </>
  )
}
