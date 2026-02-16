import { Metadata } from 'next'
import Image from 'next/image'
import SectionWrapper from '@/components/ui/SectionWrapper'
import Newsletter from '@/components/home/Newsletter'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://houseofgul.com'

export const metadata: Metadata = {
  title: 'About Us - Best Florist in Jaipur',
  description:
    'House of Gul is Jaipur\'s premier luxury florist. Discover our story, meet our expert florists, and learn why we\'re the most trusted flower delivery service in Jaipur, Rajasthan.',
  keywords: [
    'florist jaipur',
    'best florist in jaipur',
    'flower shop jaipur',
    'jaipur florist',
  ],
  openGraph: {
    title: 'About House of Gul | Best Florist in Jaipur',
    description: 'Jaipur\'s premier luxury florist. Discover our story and commitment to floral excellence.',
    url: `${siteUrl}/about`,
    siteName: 'House of Gul',
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'House of Gul - Best Florist Jaipur',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About House of Gul | Best Florist in Jaipur',
    description: 'Jaipur\'s premier luxury florist.',
    images: [`${siteUrl}/og-image.jpg`],
  },
  alternates: {
    canonical: `${siteUrl}/about`,
  },
}

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1920&q=80"
            alt="House of Gul atelier"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-charcoal/50" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <p className="text-xs md:text-sm tracking-[0.4em] uppercase text-gold mb-4">
            Our Story
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-ivory mb-4">
            The House of Gul
          </h1>
          <div className="w-16 h-px bg-gold mx-auto mb-6" />
          <p className="text-ivory/80 leading-relaxed">
            A sanctuary where nature&apos;s most exquisite creations are
            transformed into works of art.
          </p>
        </div>
      </section>

      {/* Origin Story */}
      <SectionWrapper background="ivory">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-6">
            <p className="luxury-subheading">The Beginning</p>
            <h2 className="font-serif text-3xl md:text-4xl text-charcoal">
              Born from a Love of Beauty
            </h2>
            <div className="w-12 h-px bg-gold" />
            <p className="text-charcoal-light leading-relaxed">
              House of Gul was founded on a simple yet profound belief: that
              flowers possess the power to transform moments into memories. The
              name &ldquo;Gul&rdquo; — meaning flower in Persian — reflects our
              reverence for the ancient art of floristry and its timeless
              elegance.
            </p>
            <p className="text-charcoal-light leading-relaxed">
              Our journey began in a small atelier, where a passion for
              perfection met an unwavering commitment to beauty. Today, we
              continue that legacy, crafting each arrangement with the same
              devotion that inspired our very first bloom.
            </p>
          </div>
          <div className="relative aspect-[4/5] rounded-sm overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=800&q=80"
              alt="Floral arrangement being crafted"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </SectionWrapper>

      {/* Philosophy */}
      <SectionWrapper background="champagne" padding="xl">
        <div className="max-w-4xl mx-auto text-center">
          <p className="luxury-subheading mb-6">Our Philosophy</p>
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal mb-8">
            Flowers as Art
          </h2>
          <blockquote className="font-serif text-2xl md:text-3xl text-charcoal leading-relaxed mb-8 italic">
            &ldquo;We believe that every petal holds a story, every stem carries
            emotion, and every arrangement is an expression of the
            heart.&rdquo;
          </blockquote>
          <div className="luxury-divider mb-8" />
          <p className="text-charcoal-light leading-relaxed">
            At House of Gul, we approach floristry as an art form. Each
            arrangement is thoughtfully composed, balancing color, texture, and
            form to create a visual symphony. We draw inspiration from nature,
            fashion, and the timeless principles of design to craft bouquets
            that transcend the ordinary.
          </p>
        </div>
      </SectionWrapper>

      {/* Craftsmanship */}
      <SectionWrapper background="white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="order-2 lg:order-1 relative aspect-[4/5] rounded-sm overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80"
              alt="Master florist at work"
              fill
              className="object-cover"
            />
          </div>
          <div className="order-1 lg:order-2 space-y-6">
            <p className="luxury-subheading">The Craft</p>
            <h2 className="font-serif text-3xl md:text-4xl text-charcoal">
              Masterful Artistry
            </h2>
            <div className="w-12 h-px bg-gold" />
            <p className="text-charcoal-light leading-relaxed">
              Our master florists bring decades of expertise to every
              arrangement. Trained in the traditions of European floristry and
              inspired by contemporary design, they possess an innate
              understanding of how to bring out the unique beauty of each bloom.
            </p>
            <p className="text-charcoal-light leading-relaxed">
              From the selection of the freshest stems to the final placement of
              each petal, every step is executed with precision and care. The
              result is not merely a bouquet, but a piece of floral couture.
            </p>
            <div className="grid grid-cols-3 gap-6 pt-4">
              <div className="text-center">
                <p className="font-serif text-3xl text-gold mb-1">15+</p>
                <p className="text-xs tracking-widest uppercase text-charcoal-light">
                  Years of Excellence
                </p>
              </div>
              <div className="text-center">
                <p className="font-serif text-3xl text-gold mb-1">50K+</p>
                <p className="text-xs tracking-widest uppercase text-charcoal-light">
                  Bouquets Crafted
                </p>
              </div>
              <div className="text-center">
                <p className="font-serif text-3xl text-gold mb-1">100%</p>
                <p className="text-xs tracking-widest uppercase text-charcoal-light">
                  Fresh Blooms
                </p>
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* Values */}
      <SectionWrapper background="ivory">
        <div className="text-center mb-12">
          <p className="luxury-subheading mb-4">Our Values</p>
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal mb-4">
            What We Stand For
          </h2>
          <div className="luxury-divider" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              title: 'Excellence',
              description:
                'We never compromise on quality, sourcing only the finest blooms from trusted growers worldwide.',
            },
            {
              title: 'Artistry',
              description:
                'Every arrangement is a creative endeavor, designed to evoke emotion and inspire wonder.',
            },
            {
              title: 'Sustainability',
              description:
                'We are committed to ethical sourcing and environmentally conscious practices.',
            },
            {
              title: 'Service',
              description:
                'We treat every order as an opportunity to create a memorable experience for our clients.',
            },
          ].map((value, index) => (
            <div key={index} className="text-center p-6">
              <h3 className="font-serif text-xl text-charcoal mb-3">
                {value.title}
              </h3>
              <p className="text-charcoal-light text-sm leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* Newsletter */}
      <Newsletter />
    </>
  )
}
