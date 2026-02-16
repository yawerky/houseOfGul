import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import TestimonialManager from '@/components/admin/TestimonialManager'

async function getTestimonials() {
  return prisma.testimonial.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  })
}

export default async function TestimonialsPage() {
  const session = await getAdminSession()
  if (!session) redirect('/admin/login')

  const testimonials = await getTestimonials()

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-serif text-charcoal">Testimonials</h1>
          <p className="text-charcoal-light">Manage customer testimonials displayed on the website</p>
        </div>

        <TestimonialManager initialTestimonials={testimonials} />
      </main>
    </div>
  )
}
