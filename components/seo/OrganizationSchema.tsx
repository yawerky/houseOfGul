export default function OrganizationSchema() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://houseofgul.com'

  // Online Florist Business Schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Florist',
    '@id': `${siteUrl}/#organization`,
    name: 'House of Gul',
    alternateName: ['House of Gul Jaipur', 'House of Gul Luxury Floral Atelier', 'Online Florist Jaipur'],
    url: siteUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${siteUrl}/logo.png`,
      width: 200,
      height: 60,
    },
    image: `${siteUrl}/og-image.jpg`,
    description:
      'Online flower delivery in Jaipur. House of Gul is a luxury floral atelier offering same-day flower delivery, wedding flowers, birthday bouquets, and custom floral arrangements across Jaipur, Rajasthan.',
    telephone: '+91-9461900344',
    email: 'hello@houseofgul.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Jaipur',
      addressRegion: 'Rajasthan',
      addressCountry: 'IN',
    },
    areaServed: [
      {
        '@type': 'City',
        name: 'Jaipur',
        '@id': 'https://www.wikidata.org/wiki/Q10711',
      },
      {
        '@type': 'State',
        name: 'Rajasthan',
      },
    ],
    serviceArea: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: 26.9124,
        longitude: 75.7873,
      },
      geoRadius: '50000',
    },
    priceRange: '₹₹',
    currenciesAccepted: 'INR',
    paymentAccepted: 'Credit Card, Debit Card, UPI, Net Banking',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '09:00',
        closes: '21:00',
      },
    ],
    sameAs: [
      'https://www.instagram.com/houseofgul',
      'https://www.facebook.com/houseofgul',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Online Flower Delivery Jaipur',
      itemListElement: [
        {
          '@type': 'OfferCatalog',
          name: 'Romantic Flowers Jaipur',
        },
        {
          '@type': 'OfferCatalog',
          name: 'Birthday Flowers Jaipur',
        },
        {
          '@type': 'OfferCatalog',
          name: 'Wedding Flowers Jaipur',
        },
        {
          '@type': 'OfferCatalog',
          name: 'Same Day Flower Delivery Jaipur',
        },
      ],
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '150',
      bestRating: '5',
      worstRating: '1',
    },
  }

  // Service Schema for Online Flower Delivery
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${siteUrl}/#service`,
    name: 'Online Flower Delivery Jaipur',
    description: 'Same-day online flower delivery service in Jaipur. Order fresh flowers, bouquets, and floral arrangements online with doorstep delivery.',
    provider: {
      '@id': `${siteUrl}/#organization`,
    },
    serviceType: 'Flower Delivery',
    areaServed: {
      '@type': 'City',
      name: 'Jaipur',
      containedInPlace: {
        '@type': 'State',
        name: 'Rajasthan',
      },
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Flower Delivery Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Same Day Flower Delivery',
            description: 'Order before 4 PM for same-day delivery in Jaipur',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Midnight Flower Delivery',
            description: 'Surprise your loved ones with midnight flower delivery',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Wedding Flower Services',
            description: 'Complete wedding floral decoration and bridal bouquets',
          },
        },
      ],
    },
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: siteUrl,
      servicePhone: '+91-9461900344',
      serviceSmsNumber: '+91-9461900344',
    },
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    url: siteUrl,
    name: 'House of Gul',
    description: 'Online Flower Delivery in Jaipur - Premium bouquets and floral arrangements with same-day delivery',
    publisher: {
      '@id': `${siteUrl}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/shop?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
    </>
  )
}
