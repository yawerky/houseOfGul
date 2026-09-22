import Image from 'next/image'
import Link from 'next/link'
import LuxuryButton from '@/components/ui/LuxuryButton'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '410 - Page Removed',
  robots: {
    index: false,
    follow: false,
  },
}

export default function GonePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory px-4 pt-20">
      <div className="text-center max-w-md">
        <Image
          src="/images/logo.png"
          alt="House of Gul"
          width={160}
          height={80}
          className="h-20 w-auto object-contain mx-auto mb-8 opacity-50"
        />
        <h1 className="font-serif text-8xl text-charcoal-light mb-4">410</h1>
        <h2 className="font-serif text-2xl md:text-3xl text-charcoal mb-4">
          This Page Has Been Removed
        </h2>
        <p className="text-charcoal-light mb-8">
          This product or page is no longer available. It may have been discontinued
          or replaced with something even more beautiful.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/shop">
            <LuxuryButton variant="primary">Browse Our Collection</LuxuryButton>
          </Link>
          <Link href="/">
            <LuxuryButton variant="secondary">Return Home</LuxuryButton>
          </Link>
        </div>
      </div>
    </div>
  )
}
