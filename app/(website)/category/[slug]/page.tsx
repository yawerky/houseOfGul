import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { mapDbProduct } from '@/lib/productMapper'
import { alternateDesigns } from '@/lib/variants'
import ProductCard from '@/components/shop/ProductCard'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import SectionWrapper from '@/components/ui/SectionWrapper'

interface CategoryPageProps {
  params: Promise<{
    slug: string
  }>
}

async function getCategory(slug: string) {
  try {
    const category = await prisma.category.findFirst({
      where: { slug, isActive: true },
    })
    return category
  } catch {
    return null
  }
}

async function getCategoryProducts(categoryName: string) {
  try {
    const products = await prisma.product.findMany({
      where: { category: categoryName, inStock: true },
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    })
    return alternateDesigns(products)
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategory(slug)

  if (!category) {
    return { title: 'Category Not Found' }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://houseofgul.in'

  return {
    title: `${category.name} Flowers | Buy Online in Jaipur`,
    description: `Shop ${category.name} flowers online in Jaipur. Fresh ${category.name.toLowerCase()} bouquets with same-day delivery. Order now from House of Gul.`,
    openGraph: {
      title: `${category.name} Flowers | House of Gul Jaipur`,
      description: `Shop ${category.name} flowers online with same-day delivery in Jaipur.`,
      url: `${siteUrl}/category/${slug}`,
      images: [{ url: category.image || `${siteUrl}/og-image.jpg` }],
    },
    alternates: {
      canonical: `${siteUrl}/category/${slug}`,
    },
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const category = await getCategory(slug)

  if (!category) {
    notFound()
  }

  const products = await getCategoryProducts(category.name)

  const mappedProducts = products.map((p) => mapDbProduct(p))

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <Image
            src={category.image || 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=1920&q=80'}
            alt={category.name}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-charcoal/50" />
        </div>
        <div className="relative z-10 text-center px-4">
          <p className="text-xs md:text-sm tracking-[0.4em] uppercase text-gold mb-4">
            Shop by Category
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-ivory mb-4">
            {category.name} Flowers
          </h1>
          <p className="text-ivory/80 max-w-xl mx-auto">
            Discover our beautiful collection of {category.name.toLowerCase()} arrangements
          </p>
        </div>
      </section>

      {/* Breadcrumbs & Products */}
      <SectionWrapper background="ivory">
        <Breadcrumbs
          items={[
            { label: 'Shop', href: '/shop' },
            { label: category.name },
          ]}
        />

        {/* Product Count */}
        <p className="text-charcoal-light mb-8">
          Showing <span className="text-charcoal font-medium">{products.length}</span> {category.name.toLowerCase()} arrangements
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
            <p className="text-charcoal-light mb-4">No products in this category yet.</p>
            <Link href="/shop" className="text-gold hover:text-gold-dark">
              Browse all products →
            </Link>
          </div>
        )}
      </SectionWrapper>

      {/* SEO Content Block */}
      <SectionWrapper background="white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-2xl text-charcoal mb-4">
            {category.name} Flower Delivery in Jaipur
          </h2>
          <p className="text-charcoal-light leading-relaxed">
            Order fresh {category.name.toLowerCase()} flowers online from House of Gul, Jaipur&apos;s premier
            online florist. We offer same-day delivery across Jaipur including Malviya Nagar,
            C-Scheme, Vaishali Nagar, Mansarovar, and all other areas. Our {category.name.toLowerCase()}
            arrangements are handcrafted with the freshest blooms for all your special occasions.
          </p>
        </div>
      </SectionWrapper>
    </>
  )
}
