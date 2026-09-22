import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import FlowerGuideManager from '@/components/admin/FlowerGuideManager'
import { mapFlower } from '@/lib/flowerGuide'

export default async function FlowerGuideAdminPage() {
  const session = await getAdminSession()
  if (!session) redirect('/admin/login')

  const rows = await prisma.flowerGuide.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'asc' }] })

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-serif text-charcoal">Flower Guide</h1>
          <p className="text-charcoal-light">
            The Flower Encyclopedia on the Flower Guide page. The top banner is set in Banners → &quot;Flower Guide — Top banner&quot;.
          </p>
        </div>
        <FlowerGuideManager initialFlowers={rows.map(mapFlower)} />
      </main>
    </div>
  )
}
