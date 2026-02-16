import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import SimpleListManager from '@/components/admin/SimpleListManager'

async function getCategories() {
  const categories = await prisma.category.findMany({
    orderBy: [{ order: 'asc' }, { name: 'asc' }],
  })
  // Serialize for client component
  return categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    image: c.image,
    isActive: c.isActive,
    order: c.order,
  }))
}

export default async function CategoriesPage() {
  const session = await getAdminSession()
  if (!session) redirect('/admin/login')

  const categories = await getCategories()

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-serif text-charcoal">Categories</h1>
          <p className="text-charcoal-light">Manage product categories</p>
        </div>

        <SimpleListManager
          items={categories}
          type="categories"
          title="Category"
        />
      </main>
    </div>
  )
}
