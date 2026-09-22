import Image from 'next/image'
import Link from 'next/link'
import LuxuryButton from '@/components/ui/LuxuryButton'
import type { BannerContent } from '@/lib/banners'

export default function SignatureBanner({ banner }: { banner?: BannerContent | null }) {
  return (
    <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={banner?.image || "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=1920&q=80"}
          alt={banner?.title || "Curated blooms"}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-charcoal/50" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        <p className="text-xs md:text-sm tracking-[0.4em] uppercase text-gold mb-6">
          The Art of Floristry
        </p>
        <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl text-ivory mb-6">
          {banner ? (
            banner.title
          ) : (
            <>
              Curated Blooms.
              <br />
              Timeless Elegance.
            </>
          )}
        </h2>
        <div className="w-16 h-px bg-gold mx-auto mb-8" />
        <p className="text-ivory/80 mb-10 leading-relaxed">
          {banner?.subtitle ||
            'Experience the extraordinary. Our master florists source the rarest blooms from around the world, creating arrangements that transcend the ordinary.'}
        </p>
        <Link href={banner?.buttonLink || '/shop'}>
          <LuxuryButton variant="gold" size="lg">
            {banner?.buttonText || 'Explore Collection'}
          </LuxuryButton>
        </Link>
      </div>
    </section>
  )
}
