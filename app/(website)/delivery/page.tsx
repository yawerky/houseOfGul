import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import SectionWrapper from '@/components/ui/SectionWrapper'
import DeliveryDateChecker from '@/components/ui/DeliveryDateChecker'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://houseofgul.in'

// Areas come from Admin → Pincodes, so the list here is always the list the
// checkout actually accepts.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Delivery in Jaipur — Areas, Timings and Charges',
  description:
    'Free flower delivery across Jaipur city and district. Order by 2 PM for delivery by 6 PM the same day in the city. District areas arrive the next day. No delivery charge anywhere.',
  alternates: { canonical: `${siteUrl}/delivery` },
}

export default async function DeliveryPage() {
  const [sameDay, nextDay] = await Promise.all([
    prisma.pincode.count({ where: { isActive: true, city: 'Jaipur', deliveryZone: 'same-day' } }).catch(() => 0),
    prisma.pincode.count({ where: { isActive: true, city: 'Jaipur', deliveryZone: 'next-day' } }).catch(() => 0),
  ])

  return (
    <>
      <section className="pt-32 lg:pt-44 pb-12">
        <div className="luxury-container text-center">
          <p className="luxury-subheading mb-4">Where and when</p>
          <h1 className="font-serif text-4xl md:text-5xl text-charcoal mb-4">Delivery</h1>
          <div className="luxury-divider" />
        </div>
      </section>

      {/* Timings */}
      <SectionWrapper background="ivory" padding="md">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-2xl text-charcoal mb-6">When it arrives</h2>
          <div className="border border-blush-dark/20 bg-white">
            <div className="grid grid-cols-1 sm:grid-cols-2 border-b border-blush-dark/20">
              <div className="p-6 sm:border-r border-blush-dark/20">
                <p className="text-xs tracking-widest uppercase text-gold mb-2">If you order</p>
                <p className="text-charcoal">6:00 AM to 2:00 PM</p>
              </div>
              <div className="p-6">
                <p className="text-xs tracking-widest uppercase text-gold mb-2">It arrives by</p>
                <p className="text-charcoal">6:00 PM the same day</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2">
              <div className="p-6 sm:border-r border-blush-dark/20">
                <p className="text-xs tracking-widest uppercase text-gold mb-2">If you order</p>
                <p className="text-charcoal">2:00 PM to 6:00 AM</p>
              </div>
              <div className="p-6">
                <p className="text-xs tracking-widest uppercase text-gold mb-2">It arrives by</p>
                <p className="text-charcoal">12:00 noon the next day</p>
              </div>
            </div>
          </div>
          <p className="text-charcoal-light mt-6 leading-relaxed">
            Those are the only two windows we offer. We do not promise anything faster, because we
            would rather arrive when we said than take the order and hope.
          </p>
        </div>
      </SectionWrapper>

      {/* Charge */}
      <SectionWrapper background="white" padding="md">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-2xl text-charcoal mb-4">What it costs</h2>
          <p className="font-serif text-4xl text-gold mb-4">Nothing</p>
          <p className="text-charcoal-light leading-relaxed">
            Delivery is free everywhere we go, on every order, whatever the size. There is no
            minimum and no surcharge for a far pincode. We drive it ourselves.
          </p>
        </div>
      </SectionWrapper>

      {/* Areas */}
      <SectionWrapper background="champagne" padding="md">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-2xl text-charcoal mb-2">Where we deliver</h2>
          <p className="text-charcoal-light mb-8 leading-relaxed">
            {sameDay + nextDay > 0
              ? `${sameDay + nextDay} pincodes. The ${sameDay} across Jaipur city are same-day; the ${nextDay} around the district — Chomu, Bassi, Chaksu, Phulera, Kotputli and the villages near them — arrive the next day. Free either way.`
              : 'Across Jaipur city and the district around it. Check your pincode below.'}
          </p>

          <DeliveryDateChecker />

          <p className="text-charcoal-light mt-10 leading-relaxed">
            Not on the list? Write to{' '}
            <a
              href="mailto:contact@houseofgul.in"
              className="text-gold hover:text-charcoal transition-colors duration-300"
            >
              contact@houseofgul.in
            </a>{' '}
            or call{' '}
            <a
              href="tel:+919461900344"
              className="text-gold hover:text-charcoal transition-colors duration-300"
            >
              +91 94619 00344
            </a>
            . We will tell you honestly whether we can reach you.
          </p>
        </div>
      </SectionWrapper>
    </>
  )
}
