import { getActiveBanner } from '@/lib/banners'
import EventsPageClient from './EventsPageClient'

// Banner image comes from Admin → Banners ("Events — Top banner").
export const dynamic = 'force-dynamic'

export default async function EventsPage() {
  const pageBanner = await getActiveBanner('events')
  return <EventsPageClient heroImage={pageBanner?.image} />
}
