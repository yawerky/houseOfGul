import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import BannerManager from '@/components/admin/BannerManager'

async function getBanners() {
  return prisma.banner.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  })
}

export default async function BannersPage() {
  const session = await getAdminSession()
  if (!session) redirect('/admin/login')

  const banners = await getBanners()

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-serif text-charcoal">Banners</h1>
          <p className="text-charcoal-light">Manage homepage banners and promotional images</p>
        </div>

        <BannerManager initialBanners={banners} />
      </main>
    </div>
  )
}
