import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import ProductForm from '@/components/admin/ProductForm'

async function getProduct(id: string) {
  return prisma.product.findUnique({
    where: { id },
  })
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getAdminSession()
  if (!session) redirect('/admin/login')

  const { id } = await params
  const product = await getProduct(id)

  if (!product) {
    notFound()
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-serif text-charcoal">Edit Product</h1>
          <p className="text-charcoal-light">Update product details</p>
        </div>

        <ProductForm product={product} />
      </main>
    </div>
  )
}
