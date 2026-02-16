'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Item {
  id: string
  name: string
  slug: string
  description?: string | null
  image?: string | null
  isActive: boolean
  order: number
}

export default function SimpleListManager({
  items: initialItems,
  type,
  title,
}: {
  items: Item[]
  type: 'occasions' | 'categories'
  title: string
}) {
  const router = useRouter()
  const [items, setItems] = useState(initialItems)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Item | null>(null)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    isActive: true,
    order: '0',
  })

  const resetForm = () => {
    setFormData({ name: '', slug: '', description: '', image: '', isActive: true, order: '0' })
    setEditing(null)
    setShowForm(false)
  }

  const handleEdit = (item: Item) => {
    setFormData({
      name: item.name,
      slug: item.slug,
      description: item.description || '',
      image: item.image || '',
      isActive: item.isActive,
      order: item.order.toString(),
    })
    setEditing(item)
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const slug = formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')

    try {
      const url = editing ? `/api/admin/${type}/${editing.id}` : `/api/admin/${type}`

      const response = await fetch(url, {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, slug, order: parseInt(formData.order) }),
      })

      if (response.ok) {
        resetForm()
        router.refresh()
      } else {
        const data = await response.json()
        alert(data.error || `Failed to save ${title.toLowerCase()}`)
      }
    } catch (error) {
      alert(`Error saving ${title.toLowerCase()}`)
    } finally {
      setLoading(false)
    }
  }

  const handleToggle = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/${type}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      })

      if (response.ok) {
        setItems(items.map((i) => (i.id === id ? { ...i, isActive: !isActive } : i)))
      }
    } catch (error) {
      alert('Error updating')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(`Are you sure you want to delete this ${title.toLowerCase()}?`)) return

    try {
      const response = await fetch(`/api/admin/${type}/${id}`, { method: 'DELETE' })
      if (response.ok) {
        setItems(items.filter((i) => i.id !== id))
        router.refresh()
      }
    } catch (error) {
      alert('Error deleting')
    }
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => { resetForm(); setShowForm(true) }}
        className="px-4 py-2 bg-gold text-white rounded-lg hover:bg-gold-dark transition-colors flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add {title}
      </button>

      {showForm && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="font-serif text-lg text-charcoal mb-4">
            {editing ? `Edit ${title}` : `Add New ${title}`}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                  placeholder="auto-generated"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Display Order</label>
                <input
                  type="number"
                  min="0"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 text-gold focus:ring-gold"
              />
              <span className="text-sm text-charcoal">Active</span>
            </label>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-gold text-white rounded-lg hover:bg-gold-dark transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : editing ? 'Update' : 'Create'}
              </button>
              <button type="button" onClick={resetForm} className="px-4 py-2 bg-gray-100 text-charcoal rounded-lg hover:bg-gray-200 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {items.length === 0 ? (
          <div className="p-12 text-center text-charcoal-light">No {title.toLowerCase()}s yet.</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-light uppercase">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-light uppercase">{title}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-light uppercase">Slug</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-light uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-light uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={item.id} className={`hover:bg-gray-50 ${!item.isActive ? 'opacity-50' : ''}`}>
                  <td className="px-6 py-4 text-charcoal">{item.order}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                      )}
                      <span className="font-medium text-charcoal">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-charcoal-light text-sm">{item.slug}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggle(item.id, item.isActive)}
                      className={`px-2 py-1 text-xs rounded-full ${
                        item.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {item.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(item)} className="text-gold hover:text-gold-dark font-medium text-sm">Edit</button>
                      <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700 font-medium text-sm">Delete</button>
                    </div>
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
