import Image from 'next/image'
import { subscriptionPlans } from '@/lib/products'
import SectionWrapper from '@/components/ui/SectionWrapper'
import LuxuryButton from '@/components/ui/LuxuryButton'
import { cn } from '@/lib/utils'

export const metadata = {
  title: 'Gul Club | House of Gul',
  description: 'Join our exclusive flower subscription for regular deliveries of luxury blooms.',
}

export default function GulClubPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=1920&q=80"
            alt="Gul Club subscription"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-charcoal/50" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <p className="text-xs md:text-sm tracking-[0.4em] uppercase text-gold mb-4">
            Exclusive Membership
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-ivory mb-4">
            The Gul Club
          </h1>
          <div className="w-16 h-px bg-gold mx-auto mb-6" />
          <p className="text-ivory/80 leading-relaxed max-w-xl mx-auto">
            Experience the joy of fresh, luxury blooms delivered to your door.
            Choose your perfect subscription and let beauty become a ritual.
          </p>
        </div>
      </section>

      {/* Subscription Plans */}
      <SectionWrapper background="ivory">
        <div className="text-center mb-12">
          <p className="luxury-subheading mb-4">Choose Your Plan</p>
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal mb-4">
            Subscription Tiers
          </h2>
          <div className="luxury-divider" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {subscriptionPlans.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                'relative bg-white rounded-sm p-8 transition-all duration-300 hover:shadow-xl',
                plan.popular ? 'ring-2 ring-gold shadow-lg' : 'shadow-sm'
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-white text-xs tracking-widest uppercase px-4 py-1">
                  Most Popular
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="font-serif text-2xl text-charcoal mb-2">{plan.name}</h3>
                <p className="text-charcoal-light text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="font-serif text-4xl text-gold">${plan.price}</span>
                  <span className="text-charcoal-light">/{plan.interval}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3 text-sm text-charcoal-light">
                    <svg className="w-5 h-5 text-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <LuxuryButton
                variant={plan.popular ? 'gold' : 'secondary'}
                className="w-full"
              >
                Subscribe Now
              </LuxuryButton>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* How It Works */}
      <SectionWrapper background="champagne">
        <div className="text-center mb-12">
          <p className="luxury-subheading mb-4">Simple & Elegant</p>
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal mb-4">
            How It Works
          </h2>
          <div className="luxury-divider" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            {
              step: '01',
              title: 'Choose Your Plan',
              description: 'Select the subscription tier that suits your lifestyle and floral preferences.',
            },
            {
              step: '02',
              title: 'We Curate',
              description: 'Our master florists handpick the finest seasonal blooms for your arrangement.',
            },
            {
              step: '03',
              title: 'Delivered Fresh',
              description: 'Receive your luxury bouquet at your door, beautifully packaged and ready to display.',
            },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <span className="font-serif text-5xl text-gold/30 block mb-4">{item.step}</span>
              <h3 className="font-serif text-xl text-charcoal mb-2">{item.title}</h3>
              <p className="text-charcoal-light text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* Benefits */}
      <SectionWrapper background="white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="luxury-subheading mb-4">Member Benefits</p>
            <h2 className="font-serif text-3xl md:text-4xl text-charcoal mb-6">
              Why Join the Gul Club?
            </h2>
            <ul className="space-y-4">
              {[
                'Exclusive access to rare and seasonal blooms',
                'Complimentary luxury vase with annual subscriptions',
                'Priority booking for events and weddings',
                'Personal florist consultation',
                '15% off all additional purchases',
                'Flexible delivery scheduling',
                'Pause or cancel anytime',
              ].map((benefit, index) => (
                <li key={index} className="flex items-center gap-3 text-charcoal-light">
                  <svg className="w-5 h-5 text-gold flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative aspect-[4/5] rounded-sm overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&q=80"
              alt="Gul Club benefits"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </SectionWrapper>
    </>
  )
}
