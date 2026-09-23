import type { Metadata } from 'next'
import SectionWrapper from '@/components/ui/SectionWrapper'
import ContactForm from './ContactForm'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://houseofgul.in'

export const metadata: Metadata = {
  title: 'Contact Us — Flower Studio in Jhotwara, Jaipur',
  description:
    'Reach House of Gul in Jhotwara, Jaipur. Call +91 94619 00344, write to contact@houseofgul.in, or send us a message. Free delivery across 30 Jaipur pincodes.',
  alternates: { canonical: `${siteUrl}/contact` },
}

export default function ContactPage() {
  return (
    <>
      <section className="pt-32 lg:pt-44 pb-12">
        <div className="luxury-container text-center">
          <p className="luxury-subheading mb-4">Get in touch</p>
          <h1 className="font-serif text-4xl md:text-5xl text-charcoal mb-4">Contact Us</h1>
          <div className="luxury-divider" />
        </div>
      </section>

      <SectionWrapper background="ivory" padding="md">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Details */}
          <div>
            <h2 className="font-serif text-2xl text-charcoal mb-6">The studio</h2>
            <address className="not-italic space-y-6 text-charcoal-light">
              <div>
                <p className="text-xs tracking-widest uppercase text-gold mb-2">Where we are</p>
                <p className="leading-relaxed">
                  WTL Manzil, Jagannath Puri, Hamza Street
                  <br />
                  Jhotwara, Jaipur 302012
                  <br />
                  Rajasthan, India
                </p>
              </div>
              <div>
                <p className="text-xs tracking-widest uppercase text-gold mb-2">Phone</p>
                <a href="tel:+919461900344" className="hover:text-gold transition-colors duration-300">
                  +91 94619 00344
                </a>
              </div>
              <div>
                <p className="text-xs tracking-widest uppercase text-gold mb-2">Email</p>
                <a
                  href="mailto:contact@houseofgul.in"
                  className="hover:text-gold transition-colors duration-300"
                >
                  contact@houseofgul.in
                </a>
              </div>
            </address>

            <h2 className="font-serif text-2xl text-charcoal mt-12 mb-6">Delivery</h2>
            <div className="space-y-3 text-charcoal-light">
              <p className="leading-relaxed">
                Order between 6:00 AM and 2:00 PM and your flowers arrive by 6:00 PM the same day.
              </p>
              <p className="leading-relaxed">
                Order between 2:00 PM and 6:00 AM and they arrive by 12:00 noon the next day.
              </p>
              <p className="leading-relaxed">
                Delivery is free across all 30 Jaipur pincodes, 302001 to 302039.
              </p>
            </div>
          </div>

          {/* Form */}
          <div>
            <h2 className="font-serif text-2xl text-charcoal mb-6">Send a message</h2>
            <p className="text-charcoal-light mb-8 leading-relaxed">
              Tell us what you need and we will write back. For a wedding or a corporate order,
              a line about the date and the size helps us answer properly.
            </p>
            <ContactForm />
          </div>
        </div>
      </SectionWrapper>
    </>
  )
}
