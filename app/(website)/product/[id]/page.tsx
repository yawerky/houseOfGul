import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { Product } from '@/lib/products'
import ProductPageClient from '@/components/product/ProductPageClient'
import ProductCard from '@/components/shop/ProductCard'
import SectionWrapper from '@/components/ui/SectionWrapper'
import ProductSchema from '@/components/seo/ProductSchema'

interface ProductPageProps {
  params: Promise<{
    id: string
  }>
}

async function getProductBySlug(slug: string): Promise<Product | null> {
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
}

async function getRelatedProducts(excludeSlug: string): Promise<Product[]> {
  const dbProducts = await prisma.product.findMany({
    where: { inStock: true, slug: { not: excludeSlug }, featured: true },
    take: 4,
  })

  return dbProducts.map((p) => ({
    id: p.slug,
    name: p.name,
    price: p.price,
    description: p.description || '',
    story: p.story || '',
    flowers: JSON.parse(p.flowers || '[]'),
    images: JSON.parse(p.images || '[]'),
    category: p.category || 'Uncategorized',
    featured: p.featured,
    deliveryInfo: p.deliveryInfo || 'Same-day delivery available in select areas.',
    occasions: p.occasion ? [p.occasion] : [],
    season: p.season || 'all',
    rating: p.rating || 4.5,
    reviewCount: p.reviewCount || 0,
  }))
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params
  const dbProduct = await prisma.product.findFirst({
    where: { slug: id, inStock: true },
  })

  if (!dbProduct) {
    return {
      title: 'Product Not Found',
    }
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
      images: [
        {
          url: productImage,
          width: 800,
          height: 800,
          alt: dbProduct.name,
        },
      ],
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
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params

  // Fetch raw product for schema
  const dbProduct = await prisma.product.findFirst({
    where: { slug: id, inStock: true },
  })

  if (!dbProduct) {
    notFound()
  }

  const product = await getProductBySlug(id)

  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(id)
  const images = JSON.parse(dbProduct.images || '[]')

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
      />

      {/* Product Section */}
      <section className="pt-28 md:pt-32 pb-16 md:pb-24 bg-ivory">
        <div className="luxury-container">
          <ProductPageClient product={product} />
        </div>
      </section>

      {/* Related Products */}
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
    </>
  )
}
