import { getAdminSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import ProductForm from '@/components/admin/ProductForm'

export default async function NewProductPage() {
  const session = await getAdminSession()
  if (!session) redirect('/admin/login')

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-serif text-charcoal">Add New Product</h1>
          <p className="text-charcoal-light">Create a new product for your catalog</p>
        </div>

        <ProductForm />
      </main>
    </div>
  )
}
