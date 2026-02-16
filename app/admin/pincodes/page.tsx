import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import PincodeManager from '@/components/admin/PincodeManager'

async function getPincodes() {
  return prisma.pincode.findMany({
    orderBy: [
      { isActive: 'desc' },
      { city: 'asc' },
      { code: 'asc' },
    ],
  })
}

export default async function PincodesPage() {
  const session = await getAdminSession()
  if (!session) redirect('/admin/login')

  const pincodes = await getPincodes()

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-serif text-charcoal">Delivery Pincodes</h1>
          <p className="text-charcoal-light">Manage delivery areas and pricing</p>
        </div>

        <PincodeManager initialPincodes={pincodes} />
      </main>
    </div>
  )
}
