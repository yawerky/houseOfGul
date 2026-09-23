import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import JobApplicationManager from '@/components/admin/JobApplicationManager'

export default async function ApplicationsAdminPage() {
  const session = await getAdminSession()
  if (!session) redirect('/admin/login')

  const rows = await prisma.jobApplication.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      jobTitle: true,
      name: true,
      email: true,
      phone: true,
      cvName: true,
      cvSize: true,
      note: true,
      status: true,
      adminNote: true,
      createdAt: true,
    },
  })

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-serif text-charcoal">Applications</h1>
          <p className="text-charcoal-light">
            CVs sent through the Careers page. A CV opens only from here, behind this login.
          </p>
        </div>

        <JobApplicationManager
          initialApplications={rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }))}
        />
      </main>
    </div>
  )
}
