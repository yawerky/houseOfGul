import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import JobManager from '@/components/admin/JobManager'

export default async function JobsAdminPage() {
  const session = await getAdminSession()
  if (!session) redirect('/admin/login')

  const rows = await prisma.job.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    select: {
      id: true,
      title: true,
      location: true,
      type: true,
      summary: true,
      description: true,
      isActive: true,
      order: true,
    },
  })

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-serif text-charcoal">Jobs</h1>
          <p className="text-charcoal-light">
            Roles listed on the Careers page. With no job showing, the page says we are not
            hiring and still takes CVs.
          </p>
        </div>
        <JobManager initialJobs={rows} />
      </main>
    </div>
  )
}
