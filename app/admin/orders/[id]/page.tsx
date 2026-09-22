import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import AdminSidebar from '@/components/admin/AdminSidebar'
import OrderStatusUpdate from '@/components/admin/OrderStatusUpdate'

async function getOrder(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      items: { include: { product: { select: { sku: true } } } },
      timeline: { orderBy: { createdAt: 'asc' } },
    },
  })
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getAdminSession()
  if (!session) redirect('/admin/login')

  const { id } = await params
  const order = await getOrder(id)

  if (!order) {
    notFound()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-blue-100 text-blue-800'
      case 'processing': return 'bg-purple-100 text-purple-800'
      case 'shipped': return 'bg-indigo-100 text-indigo-800'
      case 'out-for-delivery': return 'bg-cyan-100 text-cyan-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'refunded': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="mb-8">
          <Link
            href="/admin/orders"
            className="text-gold hover:text-gold-dark text-sm mb-4 inline-flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Orders
          </Link>
          <div className="flex justify-between items-start mt-2">
            <div>
              <h1 className="text-2xl font-serif text-charcoal">Order {order.orderNumber}</h1>
              <p className="text-charcoal-light">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div className="flex gap-2">
              <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
              <span className={`px-3 py-1 text-sm rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
                Payment: {order.paymentStatus}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="font-serif text-lg text-charcoal">Order Items</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-medium text-charcoal">{item.name}</h3>
                        <p className="text-sm text-charcoal-light">
                          {item.product?.sku && <span className="font-mono mr-2">{item.product.sku}</span>}
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-charcoal">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                        <p className="text-sm text-charcoal-light">₹{item.price.toLocaleString('en-IN')} each</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200 space-y-2">
                  <div className="flex justify-between text-charcoal-light">
                    <span>Subtotal</span>
                    <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-charcoal-light">
                    <span>Delivery</span>
                    <span>₹{order.deliveryCharge.toLocaleString('en-IN')}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-₹{order.discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-semibold text-charcoal pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span>₹{order.total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Gift Options */}
            {(order.isGift || order.giftMessage) && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="font-serif text-lg text-charcoal">Gift Options</h2>
                </div>
                <div className="p-6">
                  {order.isGift && order.giftWrapType && (
                    <p className="text-charcoal mb-2">
                      <span className="font-medium">Gift Wrap:</span> {order.giftWrapType}
                    </p>
                  )}
                  {order.senderName && (
                    <p className="text-charcoal mb-2">
                      <span className="font-medium">From:</span> {order.senderName}
                    </p>
                  )}
                  {order.hidePrice && (
                    <p className="text-charcoal mb-2 font-medium">Do not show the price to the recipient.</p>
                  )}
                  {order.giftMessage && (
                    <div>
                      <span className="font-medium text-charcoal">Gift Message:</span>
                      <p className="mt-1 p-3 bg-cream rounded-lg text-charcoal-light italic">
                        &ldquo;{order.giftMessage}&rdquo;
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Timeline */}
            {order.timeline.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="font-serif text-lg text-charcoal">Timeline</h2>
                </div>
                <ul className="p-6 space-y-3">
                  {order.timeline.map((t) => (
                    <li key={t.id} className="flex justify-between gap-4 text-sm">
                      <span className="text-charcoal">
                        <span className="font-medium capitalize">{t.status.replace(/-/g, ' ')}</span> — {t.message}
                      </span>
                      <span className="text-charcoal-light whitespace-nowrap">
                        {new Date(t.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Customer Note */}
            {order.customerNote && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="font-serif text-lg text-charcoal">Customer Note</h2>
                </div>
                <div className="p-6">
                  <p className="text-charcoal-light">{order.customerNote}</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Update Status */}
            <OrderStatusUpdate
              orderId={order.id}
              currentStatus={order.status}
              currentPaymentStatus={order.paymentStatus}
            />

            {/* Customer Info */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="font-serif text-lg text-charcoal">Customer</h2>
              </div>
              <div className="p-6">
                <p className="font-medium text-charcoal">{order.shippingFirstName} {order.shippingLastName}</p>
                <p className="text-charcoal-light">{order.email}</p>
                <p className="text-charcoal-light">{order.phone}</p>
                <div className="flex gap-2 mt-4">
                  <a
                    href={`https://wa.me/91${order.phone.replace(/\D/g, '').slice(-10)}?text=${encodeURIComponent(
                      `Hello ${order.shippingFirstName}, this is House of Gul about your order ${order.orderNumber}. `
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center px-3 py-2 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700"
                  >
                    WhatsApp
                  </a>
                  <a
                    href={`tel:+91${order.phone.replace(/\D/g, '').slice(-10)}`}
                    className="flex-1 text-center px-3 py-2 text-sm rounded-lg border border-gray-200 text-charcoal hover:bg-gray-50"
                  >
                    Call
                  </a>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="font-serif text-lg text-charcoal">Shipping Address</h2>
              </div>
              <div className="p-6 text-charcoal-light">
                <p>{order.shippingFirstName} {order.shippingLastName}</p>
                <p>{order.shippingAddress}</p>
                {order.shippingApartment && <p>{order.shippingApartment}</p>}
                <p>{order.shippingCity}, {order.shippingState} {order.shippingPincode}</p>
                <p className="text-sm">Phone: {order.shippingPhone}</p>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="font-serif text-lg text-charcoal">Delivery</h2>
              </div>
              <div className="p-6 text-charcoal-light">
                {order.deliveryZone && (
                  <p><span className="font-medium text-charcoal">Zone:</span> {order.deliveryZone}</p>
                )}
                {order.deliveryDate && (
                  <p><span className="font-medium text-charcoal">Date:</span> {new Date(order.deliveryDate).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', year: 'numeric' })}</p>
                )}
                {order.deliverySlot && (
                  <p><span className="font-medium text-charcoal">Time Slot:</span> {order.deliverySlot}</p>
                )}
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="font-serif text-lg text-charcoal">Payment</h2>
              </div>
              <div className="p-6 text-charcoal-light">
                <p><span className="font-medium text-charcoal">Method:</span> {order.paymentMethod === 'cod' ? 'Pay on delivery' : order.paymentMethod === 'razorpay' ? 'Online (Razorpay)' : order.paymentMethod || 'N/A'}</p>
                <p><span className="font-medium text-charcoal">Status:</span> {order.paymentStatus}</p>
                {order.adminNote && <p className="mt-2 text-sm whitespace-pre-line">{order.adminNote}</p>}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
