import Image from 'next/image'
import Link from 'next/link'
import LuxuryButton from '@/components/ui/LuxuryButton'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory px-4">
      <div className="text-center max-w-md">
        <Image
          src="/images/logo.png"
          alt="House of Gul"
          width={160}
          height={80}
          className="h-20 w-auto object-contain mx-auto mb-8 opacity-50"
        />
        <h1 className="font-serif text-8xl text-gold mb-4">404</h1>
        <h2 className="font-serif text-2xl md:text-3xl text-charcoal mb-4">
          Page Not Found
        </h2>
        <p className="text-charcoal-light mb-8">
          The page you&apos;re looking for seems to have wandered off like a petal
          in the wind.
        </p>
        <Link href="/">
          <LuxuryButton variant="primary">Return Home</LuxuryButton>
        </Link>
      </div>
    </div>
  )
}
