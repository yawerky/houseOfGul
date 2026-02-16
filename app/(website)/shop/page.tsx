import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import ProductGrid from '@/components/shop/ProductGrid'
import SectionWrapper from '@/components/ui/SectionWrapper'
import Image from 'next/image'
import { Product } from '@/lib/products'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://houseofgul.com'

export const metadata: Metadata = {
  title: 'Buy Flowers Online in Jaipur | Shop Bouquets',
  description: 'Shop premium flower bouquets online in Jaipur. Fresh roses, lilies, orchids & mixed arrangements. Same-day flower delivery across Jaipur. Order now!',
  keywords: [
    'buy flowers online jaipur',
    'flower bouquet jaipur',
    'rose bouquet jaipur',
    'fresh flowers jaipur',
    'order flowers online jaipur',
  ],
  openGraph: {
    title: 'Buy Flowers Online in Jaipur | House of Gul',
    description: 'Shop premium flower bouquets in Jaipur. Same-day delivery available.',
    url: `${siteUrl}/shop`,
    siteName: 'House of Gul',
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Buy Flowers Online Jaipur - House of Gul',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Buy Flowers Online in Jaipur | House of Gul',
    description: 'Shop premium flower bouquets in Jaipur with same-day delivery.',
    images: [`${siteUrl}/og-image.jpg`],
  },
  alternates: {
    canonical: `${siteUrl}/shop`,
  },
}

async function getProducts(): Promise<Product[]> {
  const dbProducts = await prisma.product.findMany({
    where: { inStock: true },
    orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
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

export default async function ShopPage() {
  const products = await getProducts()

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=1920&q=80"
            alt="Luxury floral collection"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-charcoal/40" />
        </div>
        <div className="relative z-10 text-center px-4">
          <p className="text-xs md:text-sm tracking-[0.4em] uppercase text-gold mb-4">
            The Collection
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-ivory mb-4">
            Shop Bouquets
          </h1>
          <div className="w-16 h-px bg-gold mx-auto" />
        </div>
      </section>

      {/* Products Section */}
      <SectionWrapper background="ivory">
        {/* Filters Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12 pb-8 border-b border-blush-dark/20">
          <p className="text-charcoal-light">
            Showing <span className="text-charcoal">{products.length}</span>{' '}
            curated arrangements
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs tracking-widest uppercase text-charcoal-light">
              Sort by
            </span>
            <select className="bg-transparent border border-blush-dark/30 text-charcoal px-4 py-2 text-sm focus:outline-none focus:border-gold cursor-pointer">
              <option>Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <ProductGrid products={products} />
      </SectionWrapper>

      {/* Bottom Banner */}
      <section className="bg-champagne py-16 text-center">
        <div className="luxury-container">
          <p className="luxury-subheading mb-4">Bespoke Service</p>
          <h2 className="font-serif text-2xl md:text-3xl text-charcoal mb-4">
            Looking for Something Unique?
          </h2>
          <p className="text-charcoal-light max-w-xl mx-auto mb-6">
            Our master florists can create custom arrangements tailored to your
            vision. Contact us for bespoke floral design services.
          </p>
          <a
            href="/about"
            className="inline-flex items-center gap-2 text-gold hover:text-gold-dark transition-colors duration-300"
          >
            <span className="text-sm tracking-widest uppercase">
              Contact Us
            </span>
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
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </div>
      </section>
    </>
  )
}
