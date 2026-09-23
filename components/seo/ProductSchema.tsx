interface ProductSchemaProps {
  name: string
  description: string
  slug: string
  price: number
  comparePrice?: number | null
  images: string[]
  inStock: boolean
  category: string
  sku?: string
}

export default function ProductSchema({
  name,
  description,
  slug,
  price,
  comparePrice,
  images,
  inStock,
  category,
  sku,
}: ProductSchemaProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://houseofgul.in'
  const productSku = sku || `HOG-${slug.toUpperCase()}`

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${siteUrl}/product/${slug}#product`,
    name: name,
    description: `${description} Available for same-day flower delivery in Jaipur.`,
    url: `${siteUrl}/product/${slug}`,
    image: images.length > 0 ? images : [`${siteUrl}/og-image.jpg`],
    sku: productSku,
    mpn: productSku,
    brand: {
      '@type': 'Brand',
      name: 'House of Gul',
    },
    category: category,
    offers: {
      '@type': 'Offer',
      url: `${siteUrl}/product/${slug}`,
      priceCurrency: 'INR',
      price: price,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'House of Gul',
        url: siteUrl,
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'IN',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 1,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn',
        returnPolicySeasonalOverride: {
          '@type': 'MerchantReturnPolicySeasonalOverride',
          merchantReturnDays: 0,
          returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted',
        },
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: 'INR',
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'IN',
          addressRegion: 'Rajasthan',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 0,
            maxValue: 1,
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 0,
            maxValue: 1,
            unitCode: 'DAY',
          },
        },
      },
      ...(comparePrice && {
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: price,
          priceCurrency: 'INR',
          valueAddedTaxIncluded: true,
          referenceQuantity: {
            '@type': 'QuantitativeValue',
            value: 1,
          },
        },
      }),
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
        name: 'Shop Flowers',
        item: `${siteUrl}/shop`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: name,
        item: `${siteUrl}/product/${slug}`,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
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
