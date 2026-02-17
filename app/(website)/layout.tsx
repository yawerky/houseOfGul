import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import LiveChat from '@/components/ui/LiveChat'
import PageTransition from '@/components/ui/PageTransition'

// Force all pages in (website) to be dynamically rendered
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <LiveChat />
    </>
  )
}
