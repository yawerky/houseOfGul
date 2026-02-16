import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import InquiryManager from '@/components/admin/InquiryManager'

async function getInquiries() {
  return prisma.inquiry.findMany({
    orderBy: { createdAt: 'desc' },
  })
}

export default async function InquiriesPage() {
  const session = await getAdminSession()
  if (!session) redirect('/admin/login')

  const inquiries = await getInquiries()

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-serif text-charcoal">Inquiries</h1>
          <p className="text-charcoal-light">Manage event inquiries and contact form submissions</p>
        </div>

        <InquiryManager initialInquiries={inquiries} />
      </main>
    </div>
  )
}
