import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import { WishlistProvider } from '@/context/WishlistContext'
import { CurrencyProvider } from '@/context/CurrencyContext'
import { RecentlyViewedProvider } from '@/context/RecentlyViewedContext'
import OrganizationSchema from '@/components/seo/OrganizationSchema'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://houseofgul.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'House of Gul | Flower Delivery in Jaipur | Luxury Florist',
    template: '%s | House of Gul Jaipur',
  },
  description:
    'Best flower delivery in Jaipur. Order premium bouquets, wedding flowers, birthday flowers & romantic arrangements online. Same-day flower delivery across Jaipur, Rajasthan. Fresh flowers guaranteed.',
  keywords: [
    // Primary Jaipur keywords
    'flower delivery jaipur',
    'florist in jaipur',
    'online flower delivery jaipur',
    'same day flower delivery jaipur',
    'best florist jaipur',
    'send flowers jaipur',
    'flowers jaipur',
    'bouquet delivery jaipur',
    // Occasion-based Jaipur keywords
    'birthday flowers jaipur',
    'wedding flowers jaipur',
    'anniversary flowers jaipur',
    'romantic flowers jaipur',
    'valentine flowers jaipur',
    'rose bouquet jaipur',
    // General keywords
    'luxury flowers jaipur',
    'premium bouquets jaipur',
    'fresh flowers jaipur',
    'flower shop jaipur',
    'online florist jaipur',
    'midnight flower delivery jaipur',
    // Area-specific
    'flower delivery malviya nagar jaipur',
    'flower delivery c scheme jaipur',
    'flower delivery vaishali nagar jaipur',
    'flower delivery mansarovar jaipur',
    // Hindi/Local terms
    'phool delivery jaipur',
    'gulab ka guldasta jaipur',
  ],
  authors: [{ name: 'House of Gul' }],
  creator: 'House of Gul',
  publisher: 'House of Gul',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteUrl,
    siteName: 'House of Gul',
    title: 'House of Gul | Best Flower Delivery in Jaipur',
    description:
      'Order premium flowers online in Jaipur. Same-day delivery of fresh bouquets for birthdays, weddings, anniversaries & all occasions. Luxury florist in Jaipur.',
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'House of Gul - Flower Delivery Jaipur',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'House of Gul | Flower Delivery Jaipur',
    description:
      'Best flower delivery in Jaipur. Order premium bouquets online with same-day delivery.',
    images: [`${siteUrl}/og-image.jpg`],
    creator: '@houseofgul',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
  alternates: {
    canonical: siteUrl,
  },
  other: {
    'geo.region': 'IN-RJ',
    'geo.placename': 'Jaipur',
    'geo.position': '26.9124;75.7873',
    'ICBM': '26.9124, 75.7873',
  },
}

export const viewport: Viewport = {
  themeColor: '#D4AF37',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <OrganizationSchema />
      </head>
      <body className="font-sans">
        <CurrencyProvider>
          <CartProvider>
            <WishlistProvider>
              <RecentlyViewedProvider>
                {children}
              </RecentlyViewedProvider>
            </WishlistProvider>
          </CartProvider>
        </CurrencyProvider>
      </body>
    </html>
  )
}
