import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import AdminSidebar from '@/components/admin/AdminSidebar'
import ProductDeleteButton from '@/components/admin/ProductDeleteButton'
import GoogleSheetImport from '@/components/admin/GoogleSheetImport'

async function getProducts(category?: string) {
  const where = category && category !== 'all' ? { category } : {}

  return prisma.product.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  })
}

async function getCategories() {
  const products = await prisma.product.findMany({
    select: { category: true },
    distinct: ['category'],
  })
  return products.map(p => p.category)
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const session = await getAdminSession()
  if (!session) redirect('/admin/login')

  const params = await searchParams
  const category = params.category || 'all'
  const products = await getProducts(category)
  const categories = await getCategories()

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-serif text-charcoal">Products</h1>
            <p className="text-charcoal-light">Manage your product catalog</p>
          </div>
          <div className="flex gap-3">
            <GoogleSheetImport />
            <Link
              href="/admin/products/new"
              className="px-4 py-2 bg-gold text-white rounded-lg hover:bg-gold-dark transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Product
            </Link>
          </div>
        </div>

        {/* Category Filter */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            <Link
              href="/admin/products"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                category === 'all'
                  ? 'bg-gold text-white'
                  : 'bg-gray-100 text-charcoal hover:bg-gray-200'
              }`}
            >
              All Products
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/admin/products?category=${cat}`}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                  category === cat
                    ? 'bg-gold text-white'
                    : 'bg-gray-100 text-charcoal hover:bg-gray-200'
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {products.length === 0 ? (
            <div className="p-12 text-center">
              <svg className="w-12 h-12 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <p className="text-charcoal-light mb-4">No products found</p>
              <Link
                href="/admin/products/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gold text-white rounded-lg hover:bg-gold-dark transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Your First Product
              </Link>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-light uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-light uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-light uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-light uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-light uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-light uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {(() => {
                          const images = (() => {
                            try {
                              return JSON.parse(product.images || '[]')
                            } catch {
                              return []
                            }
                          })()
                          return images.length > 0 ? (
                          <img
                            src={images[0]}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )})()}
                        <div>
                          <p className="font-medium text-charcoal">{product.name}</p>
                          <p className="text-sm text-charcoal-light">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-charcoal capitalize">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-charcoal">
                      ${product.price.toFixed(2)}
                      {product.comparePrice && (
                        <span className="text-sm text-charcoal-light line-through ml-2">
                          ${product.comparePrice.toFixed(2)}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`${product.stockCount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {product.stockCount > 0 ? product.stockCount : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {product.featured && (
                          <span className="px-2 py-1 text-xs rounded-full bg-gold/10 text-gold">
                            Featured
                          </span>
                        )}
                        {!product.inStock && (
                          <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                            Unavailable
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="text-gold hover:text-gold-dark font-medium text-sm"
                        >
                          Edit
                        </Link>
                        <ProductDeleteButton productId={product.id} productName={product.name} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  )
}
