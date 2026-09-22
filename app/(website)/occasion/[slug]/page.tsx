import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { mapDbProduct } from '@/lib/productMapper'
import { groupSeasonVariants } from '@/lib/variants'
import ProductCard from '@/components/shop/ProductCard'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import SectionWrapper from '@/components/ui/SectionWrapper'

interface OccasionPageProps {
  params: Promise<{
    slug: string
  }>
}

async function getOccasion(slug: string) {
  try {
    const occasion = await prisma.occasion.findFirst({
      where: { slug, isActive: true },
    })
    return occasion
  } catch {
    return null
  }
}

// Admin saves the occasion's slug on products; older products may have the name.
async function getOccasionProducts(occasionName: string, occasionSlug: string) {
  try {
    const products = await prisma.product.findMany({
      where: { inStock: true, OR: [{ occasion: occasionSlug }, { occasion: occasionName }] },
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    })
    return groupSeasonVariants(products)
  } catch {
    return []
  }
}

async function getRelatedOccasions(currentSlug: string) {
  try {
    const occasions = await prisma.occasion.findMany({
      where: { isActive: true, slug: { not: currentSlug } },
      take: 4,
    })
    return occasions
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: OccasionPageProps): Promise<Metadata> {
  const { slug } = await params
  const occasion = await getOccasion(slug)

  if (!occasion) {
    return { title: 'Occasion Not Found' }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://houseofgul.com'

  return {
    title: `${occasion.name} Flowers Jaipur | Same Day Delivery`,
    description: `Order ${occasion.name.toLowerCase()} flowers online in Jaipur. Beautiful ${occasion.name.toLowerCase()} bouquets with same-day delivery. Shop now at House of Gul.`,
    openGraph: {
      title: `${occasion.name} Flowers | House of Gul Jaipur`,
      description: `Shop ${occasion.name.toLowerCase()} flowers online with same-day delivery in Jaipur.`,
      url: `${siteUrl}/occasion/${slug}`,
      images: [{ url: occasion.image || `${siteUrl}/og-image.jpg` }],
    },
    alternates: {
      canonical: `${siteUrl}/occasion/${slug}`,
    },
  }
}

export default async function OccasionPage({ params }: OccasionPageProps) {
  const { slug } = await params
  const occasion = await getOccasion(slug)

  if (!occasion) {
    notFound()
  }

  const products = await getOccasionProducts(occasion.name, occasion.slug)
  const relatedOccasions = await getRelatedOccasions(slug)

  const mappedProducts = products.map((p) => mapDbProduct(p))

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <Image
            src={occasion.image || 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=1920&q=80'}
            alt={occasion.name}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-charcoal/50" />
        </div>
        <div className="relative z-10 text-center px-4">
          <p className="text-xs md:text-sm tracking-[0.4em] uppercase text-gold mb-4">
            Shop by Occasion
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-ivory mb-4">
            {occasion.name} Flowers
          </h1>
          <p className="text-ivory/80 max-w-xl mx-auto">
            Perfect flowers for {occasion.name.toLowerCase()} celebrations
          </p>
        </div>
      </section>

      {/* Breadcrumbs & Products */}
      <SectionWrapper background="ivory">
        <Breadcrumbs
          items={[
            { label: 'Shop', href: '/shop' },
            { label: occasion.name },
          ]}
        />

        {/* Product Count */}
        <p className="text-charcoal-light mb-8">
          Showing <span className="text-charcoal font-medium">{products.length}</span> {occasion.name.toLowerCase()} arrangements
        </p>

        {/* Products Grid */}
        {mappedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {mappedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-charcoal-light mb-4">No products for this occasion yet.</p>
            <Link href="/shop" className="text-gold hover:text-gold-dark">
              Browse all products →
            </Link>
          </div>
        )}
      </SectionWrapper>

      {/* Related Occasions - Interlinking */}
      {relatedOccasions.length > 0 && (
        <SectionWrapper background="champagne">
          <div className="text-center mb-12">
            <p className="luxury-subheading mb-4">More Occasions</p>
            <h2 className="font-serif text-3xl text-charcoal mb-4">
              Shop by Occasion
            </h2>
            <div className="luxury-divider" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedOccasions.map((occ) => (
              <Link
                key={occ.id}
                href={`/occasion/${occ.slug}`}
                className="group relative aspect-square rounded-sm overflow-hidden"
              >
                <Image
                  src={occ.image || 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=400&q=80'}
                  alt={occ.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-charcoal/40 group-hover:bg-charcoal/60 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-serif text-xl text-ivory">{occ.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </SectionWrapper>
      )}

      {/* SEO Content Block */}
      <SectionWrapper background="white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-2xl text-charcoal mb-4">
            {occasion.name} Flower Delivery in Jaipur
          </h2>
          <p className="text-charcoal-light leading-relaxed">
            Make your {occasion.name.toLowerCase()} celebration special with fresh flowers from
            House of Gul. We deliver beautiful {occasion.name.toLowerCase()} bouquets across Jaipur
            with same-day delivery. Whether you&apos;re in Malviya Nagar, C-Scheme, Vaishali Nagar,
            or anywhere in Jaipur, we&apos;ll bring joy to your doorstep.
          </p>
        </div>
      </SectionWrapper>
    </>
  )
}
