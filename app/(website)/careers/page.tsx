import type { Metadata } from 'next'
import SectionWrapper from '@/components/ui/SectionWrapper'
import CareersBoard from './CareersBoard'
import { getOpenJobs } from '@/lib/jobs'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://houseofgul.in'

// Reads the open jobs from the database on every request.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Careers — Work With Us in Jhotwara, Jaipur',
  description:
    'Open roles at House of Gul, a flower box workshop in Jhotwara, Jaipur. Send your CV even when nothing is listed and we will read it when a role opens.',
  alternates: { canonical: `${siteUrl}/careers` },
}

export default async function CareersPage() {
  const jobs = await getOpenJobs()

  return (
    <>
      <section className="pt-32 lg:pt-44 pb-12">
        <div className="luxury-container text-center">
          <p className="luxury-subheading mb-4">Work with us</p>
          <h1 className="font-serif text-4xl md:text-5xl text-charcoal mb-4">Careers</h1>
          <div className="luxury-divider" />
        </div>
      </section>

      <SectionWrapper background="ivory" padding="md">
        <div className="max-w-2xl mx-auto">
          <p className="text-charcoal-light leading-relaxed">
            House of Gul is a small workshop in Jhotwara, Jaipur. We cut and fold our own boxes,
            arrange the flowers that go in them, and drive them across the city the same day.
          </p>
          <p className="text-charcoal-light leading-relaxed mt-4">
            The work is done by hand and most of it is learned at the bench. If that is the kind
            of day you want, we would like to know about you.
          </p>
        </div>
      </SectionWrapper>

      <CareersBoard jobs={jobs} />
    </>
  )
}
