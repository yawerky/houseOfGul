import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'

async function getCustomers() {
  return prisma.customer.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      orders: {
        select: { id: true, total: true },
      },
    },
  })
}

export default async function CustomersPage() {
  const session = await getAdminSession()
  if (!session) redirect('/admin/login')

  const customers = await getCustomers()

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-serif text-charcoal">Customers</h1>
          <p className="text-charcoal-light">View your customer base</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-charcoal-light text-sm">Total Customers</p>
            <p className="text-3xl font-serif text-charcoal mt-1">{customers.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-charcoal-light text-sm">Customers with Orders</p>
            <p className="text-3xl font-serif text-charcoal mt-1">
              {customers.filter((c) => c.orders.length > 0).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-charcoal-light text-sm">Total Revenue</p>
            <p className="text-3xl font-serif text-charcoal mt-1">
              $
              {customers
                .reduce((acc, c) => acc + c.orders.reduce((sum, o) => sum + o.total, 0), 0)
                .toLocaleString()}
            </p>
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {customers.length === 0 ? (
            <div className="p-12 text-center">
              <svg
                className="w-12 h-12 mx-auto text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <p className="text-charcoal-light">No customers yet</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-light uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-light uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-light uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-light uppercase tracking-wider">
                    Orders
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-light uppercase tracking-wider">
                    Total Spent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-light uppercase tracking-wider">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center">
                          <span className="text-gold font-medium">
                            {customer.firstName?.[0] || customer.email[0].toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-charcoal">
                            {customer.firstName || customer.lastName
                              ? `${customer.firstName || ''} ${customer.lastName || ''}`.trim()
                              : 'No Name'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-charcoal">{customer.email}</td>
                    <td className="px-6 py-4 text-charcoal">{customer.phone || '-'}</td>
                    <td className="px-6 py-4 text-charcoal">{customer.orders.length}</td>
                    <td className="px-6 py-4 text-charcoal font-medium">
                      ${customer.orders.reduce((sum, o) => sum + o.total, 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-charcoal-light text-sm">
                      {new Date(customer.createdAt).toLocaleDateString()}
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
