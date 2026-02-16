import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import SimpleListManager from '@/components/admin/SimpleListManager'

async function getOccasions() {
  const occasions = await prisma.occasion.findMany({
    orderBy: [{ order: 'asc' }, { name: 'asc' }],
  })
  // Serialize for client component
  return occasions.map((o) => ({
    id: o.id,
    name: o.name,
    slug: o.slug,
    description: o.description,
    image: o.image,
    isActive: o.isActive,
    order: o.order,
  }))
}

export default async function OccasionsPage() {
  const session = await getAdminSession()
  if (!session) redirect('/admin/login')

  const occasions = await getOccasions()

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-serif text-charcoal">Occasions</h1>
          <p className="text-charcoal-light">Manage shop by occasion categories</p>
        </div>

        <SimpleListManager
          items={occasions}
          type="occasions"
          title="Occasion"
        />
      </main>
    </div>
  )
}
