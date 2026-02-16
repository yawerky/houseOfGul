'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Coupon {
  id: string
  code: string
  description: string | null
  discountType: string
  discountValue: number
  minOrderAmount: number | null
  maxDiscount: number | null
  usageLimit: number | null
  usedCount: number
  isActive: boolean
  startDate: Date | null
  endDate: Date | null
}

export default function CouponManager({ initialCoupons }: { initialCoupons: Coupon[] }) {
  const router = useRouter()
  const [coupons, setCoupons] = useState(initialCoupons)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderAmount: '',
    maxDiscount: '',
    usageLimit: '',
    isActive: true,
  })

  const resetForm = () => {
    setFormData({
      code: '',
      description: '',
      discountType: 'percentage',
      discountValue: '',
      minOrderAmount: '',
      maxDiscount: '',
      usageLimit: '',
      isActive: true,
    })
    setShowForm(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          discountValue: parseFloat(formData.discountValue),
          minOrderAmount: formData.minOrderAmount ? parseFloat(formData.minOrderAmount) : null,
          maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : null,
          usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
        }),
      })

      if (response.ok) {
        resetForm()
        router.refresh()
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to create coupon')
      }
    } catch (error) {
      alert('Error creating coupon')
    } finally {
      setLoading(false)
    }
  }

  const handleToggle = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/coupons/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      })

      if (response.ok) {
        setCoupons(coupons.map((c) => (c.id === id ? { ...c, isActive: !isActive } : c)))
      }
    } catch (error) {
      alert('Error updating coupon')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return

    try {
      const response = await fetch(`/api/admin/coupons/${id}`, { method: 'DELETE' })
      if (response.ok) {
        setCoupons(coupons.filter((c) => c.id !== id))
        router.refresh()
      }
    } catch (error) {
      alert('Error deleting coupon')
    }
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => setShowForm(true)}
        className="px-4 py-2 bg-gold text-white rounded-lg hover:bg-gold-dark transition-colors flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Create Coupon
      </button>

      {showForm && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="font-serif text-lg text-charcoal mb-4">Create New Coupon</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Coupon Code *</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 uppercase"
                  placeholder="WELCOME20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Discount Type *</label>
                <select
                  value={formData.discountType}
                  onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount ($)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">
                  Discount Value * {formData.discountType === 'percentage' ? '(%)' : '($)'}
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.discountValue}
                  onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                  placeholder={formData.discountType === 'percentage' ? '20' : '50'}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                placeholder="Welcome discount for new customers"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Min Order Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.minOrderAmount}
                  onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                  placeholder="100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Max Discount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.maxDiscount}
                  onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                  placeholder="50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Usage Limit</label>
                <input
                  type="number"
                  min="1"
                  value={formData.usageLimit}
                  onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                  placeholder="Unlimited"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-gold text-white rounded-lg hover:bg-gold-dark transition-colors disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Coupon'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-100 text-charcoal rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {coupons.length === 0 ? (
          <div className="p-12 text-center text-charcoal-light">No coupons yet.</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-light uppercase">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-light uppercase">Discount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-light uppercase">Min Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-light uppercase">Usage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-light uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-light uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {coupons.map((coupon) => (
                <tr key={coupon.id} className={`hover:bg-gray-50 ${!coupon.isActive ? 'opacity-50' : ''}`}>
                  <td className="px-6 py-4">
                    <p className="font-mono font-bold text-charcoal">{coupon.code}</p>
                    {coupon.description && <p className="text-sm text-charcoal-light">{coupon.description}</p>}
                  </td>
                  <td className="px-6 py-4 text-charcoal">
                    {coupon.discountType === 'percentage'
                      ? `${coupon.discountValue}%`
                      : `$${coupon.discountValue}`}
                    {coupon.maxDiscount && (
                      <span className="text-sm text-charcoal-light block">Max: ${coupon.maxDiscount}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-charcoal">
                    {coupon.minOrderAmount ? `$${coupon.minOrderAmount}` : '-'}
                  </td>
                  <td className="px-6 py-4 text-charcoal">
                    {coupon.usedCount} / {coupon.usageLimit || '∞'}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggle(coupon.id, coupon.isActive)}
                      className={`px-2 py-1 text-xs rounded-full ${
                        coupon.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {coupon.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(coupon.id)}
                      className="text-red-500 hover:text-red-700 font-medium text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
