import { redirect } from 'next/navigation'

// The Events page is hidden for now. To bring it back, restore the previous
// version of this file (it rendered EventsPageClient with the "events" banner),
// the Events link in components/layout/Navbar.tsx, the sitemap entry and the
// "events" banner position in lib/bannerPositions.ts.
export default function EventsPage() {
  redirect('/')
}
