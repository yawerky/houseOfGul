import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import CouponManager from '@/components/admin/CouponManager'

async function getCoupons() {
  return prisma.coupon.findMany({
    orderBy: { createdAt: 'desc' },
  })
}

export default async function CouponsPage() {
  const session = await getAdminSession()
  if (!session) redirect('/admin/login')

  const coupons = await getCoupons()

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-serif text-charcoal">Discount Coupons</h1>
          <p className="text-charcoal-light">Manage discount codes and promotions</p>
        </div>

        <CouponManager initialCoupons={coupons} />
      </main>
    </div>
  )
}
