'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function OrderDeleteButton({ orderId, orderNumber }: { orderId: string; orderNumber: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm(`Delete order ${orderNumber}? This can't be undone.`)) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      router.push('/admin/orders')
      router.refresh()
    } catch {
      alert('Could not delete this order. Please try again.')
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="w-full py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
    >
      {loading ? 'Deleting…' : 'Delete Order'}
    </button>
  )
}
