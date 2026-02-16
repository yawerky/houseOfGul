import { Metadata } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://houseofgul.com'

export const metadata: Metadata = {
  title: 'Wedding & Event Flowers Jaipur | Corporate Events',
  description:
    'Book wedding flower decoration in Jaipur. House of Gul offers bridal bouquets, mandap decoration, venue decoration, corporate event flowers & party floral arrangements in Jaipur.',
  keywords: [
    'wedding flowers jaipur',
    'wedding decoration jaipur',
    'wedding florist jaipur',
    'mandap decoration jaipur',
    'bridal bouquet jaipur',
    'corporate event flowers jaipur',
    'party decoration jaipur',
    'flower decoration jaipur',
    'venue decoration jaipur',
    'rajasthani wedding flowers',
  ],
  openGraph: {
    title: 'Wedding & Event Flowers | House of Gul Jaipur',
    description: 'Premium wedding flower decoration and event floral services in Jaipur. Bridal bouquets, venue decoration & more.',
    url: `${siteUrl}/events`,
    siteName: 'House of Gul',
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Wedding Flowers Jaipur - House of Gul',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wedding & Event Flowers | House of Gul Jaipur',
    description: 'Premium wedding flower decoration in Jaipur.',
    images: [`${siteUrl}/og-image.jpg`],
  },
  alternates: {
    canonical: `${siteUrl}/events`,
  },
}

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
