import Image from 'next/image'
import { flowerMeanings } from '@/lib/products'
import SectionWrapper from '@/components/ui/SectionWrapper'

export const metadata = {
  title: 'Flower Guide | House of Gul',
  description: 'Discover the meanings, symbolism, and care tips for the world\'s most beloved flowers.',
}

export default function FlowerGuidePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1920&q=80"
            alt="Flower encyclopedia"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-charcoal/40" />
        </div>
        <div className="relative z-10 text-center px-4">
          <p className="text-xs md:text-sm tracking-[0.4em] uppercase text-gold mb-4">
            The Language of Flowers
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-ivory mb-4">
            Flower Guide
          </h1>
          <div className="w-16 h-px bg-gold mx-auto mb-6" />
          <p className="text-ivory/80 max-w-xl mx-auto">
            Explore the rich symbolism and hidden meanings behind nature&apos;s most beautiful creations.
          </p>
        </div>
      </section>

      {/* Flower Encyclopedia */}
      <SectionWrapper background="ivory">
        <div className="text-center mb-12">
          <p className="luxury-subheading mb-4">Discover & Learn</p>
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal mb-4">
            Flower Encyclopedia
          </h2>
          <div className="luxury-divider" />
        </div>

        <div className="space-y-16">
          {flowerMeanings.map((flower, index) => (
            <div
              key={flower.id}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                <div className="relative aspect-[4/3] rounded-sm overflow-hidden">
                  <Image
                    src={flower.image}
                    alt={flower.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                <h3 className="font-serif text-3xl text-charcoal mb-4">{flower.name}</h3>
                <p className="text-xl text-gold mb-4 italic">&ldquo;{flower.meaning}&rdquo;</p>

                <div className="space-y-6">
                  {/* Symbolism */}
                  <div>
                    <h4 className="text-xs tracking-widest uppercase text-charcoal-light mb-2">
                      Symbolism
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {flower.symbolism.map((symbol) => (
                        <span
                          key={symbol}
                          className="px-3 py-1 bg-champagne text-charcoal text-sm rounded-sm"
                        >
                          {symbol}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Color Meanings */}
                  <div>
                    <h4 className="text-xs tracking-widest uppercase text-charcoal-light mb-2">
                      Color Meanings
                    </h4>
                    <ul className="space-y-1">
                      {flower.colors.map((color) => (
                        <li key={color} className="text-sm text-charcoal-light">
                          {color}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-blush-dark/20">
                    <div>
                      <p className="text-xs tracking-widest uppercase text-charcoal-light mb-1">
                        Best Season
                      </p>
                      <p className="text-charcoal">{flower.season}</p>
                    </div>
                    <div>
                      <p className="text-xs tracking-widest uppercase text-charcoal-light mb-1">
                        Care Level
                      </p>
                      <p className="text-charcoal">{flower.careLevel}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* Quick Reference */}
      <SectionWrapper background="champagne">
        <div className="text-center mb-12">
          <p className="luxury-subheading mb-4">Quick Reference</p>
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal mb-4">
            Flowers by Occasion
          </h2>
          <div className="luxury-divider" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { occasion: 'Romance', flowers: ['Red Roses', 'Peonies', 'Tulips'] },
            { occasion: 'Sympathy', flowers: ['White Lilies', 'White Roses', 'Orchids'] },
            { occasion: 'Celebration', flowers: ['Mixed Bouquets', 'Sunflowers', 'Gerberas'] },
            { occasion: 'Gratitude', flowers: ['Pink Roses', 'Hydrangeas', 'Sweet Peas'] },
            { occasion: 'New Beginnings', flowers: ['White Tulips', 'Daffodils', 'Freesias'] },
            { occasion: 'Friendship', flowers: ['Yellow Roses', 'Daisies', 'Chrysanthemums'] },
          ].map((item) => (
            <div key={item.occasion} className="bg-white p-6 rounded-sm">
              <h3 className="font-serif text-xl text-charcoal mb-3">{item.occasion}</h3>
              <ul className="space-y-1">
                {item.flowers.map((flower) => (
                  <li key={flower} className="text-sm text-charcoal-light flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-gold rounded-full" />
                    {flower}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </SectionWrapper>
    </>
  )
}
