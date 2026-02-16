import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import SubscriberList from '@/components/admin/SubscriberList'

async function getSubscribers() {
  const subscribers = await prisma.subscriber.findMany({
    orderBy: { createdAt: 'desc' },
  })
  // Serialize for client component
  return subscribers.map((s) => ({
    id: s.id,
    email: s.email,
    name: s.name,
    source: s.source,
    isSubscribed: s.isSubscribed,
    createdAt: s.createdAt.toISOString(),
  }))
}

export default async function SubscribersPage() {
  const session = await getAdminSession()
  if (!session) redirect('/admin/login')

  const subscribers = await getSubscribers()

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-serif text-charcoal">Newsletter Subscribers</h1>
          <p className="text-charcoal-light">Manage your email subscriber list</p>
        </div>

        <SubscriberList subscribers={subscribers} />
      </main>
    </div>
  )
}
