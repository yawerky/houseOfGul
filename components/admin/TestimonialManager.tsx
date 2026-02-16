'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Testimonial {
  id: string
  name: string
  title: string
  content: string
  rating: number
  image: string | null
  featured: boolean
  isActive: boolean
  order: number
}

export default function TestimonialManager({
  initialTestimonials,
}: {
  initialTestimonials: Testimonial[]
}) {
  const router = useRouter()
  const [testimonials, setTestimonials] = useState(initialTestimonials)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Testimonial | null>(null)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    title: '',
    content: '',
    rating: '5',
    image: '',
    featured: false,
    isActive: true,
    order: '0',
  })

  const resetForm = () => {
    setFormData({
      name: '',
      title: '',
      content: '',
      rating: '5',
      image: '',
      featured: false,
      isActive: true,
      order: '0',
    })
    setEditing(null)
    setShowForm(false)
  }

  const handleEdit = (testimonial: Testimonial) => {
    setFormData({
      name: testimonial.name,
      title: testimonial.title,
      content: testimonial.content,
      rating: testimonial.rating.toString(),
      image: testimonial.image || '',
      featured: testimonial.featured,
      isActive: testimonial.isActive,
      order: testimonial.order.toString(),
    })
    setEditing(testimonial)
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = editing
        ? `/api/admin/testimonials/${editing.id}`
        : '/api/admin/testimonials'

      const response = await fetch(url, {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          rating: parseInt(formData.rating),
          order: parseInt(formData.order),
        }),
      })

      if (response.ok) {
        resetForm()
        router.refresh()
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to save testimonial')
      }
    } catch (error) {
      alert('Error saving testimonial')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return

    try {
      const response = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setTestimonials(testimonials.filter((t) => t.id !== id))
        router.refresh()
      } else {
        alert('Failed to delete testimonial')
      }
    } catch (error) {
      alert('Error deleting testimonial')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <button
          onClick={() => {
            resetForm()
            setShowForm(true)
          }}
          className="px-4 py-2 bg-gold text-white rounded-lg hover:bg-gold-dark transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Testimonial
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="font-serif text-lg text-charcoal mb-4">
            {editing ? 'Edit Testimonial' : 'Add New Testimonial'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Customer Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                  placeholder="Victoria S."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Title/Role *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                  placeholder="Bride"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Testimonial Content *</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                placeholder="What the customer said about your service..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Rating</label>
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                >
                  {[5, 4, 3, 2, 1].map((r) => (
                    <option key={r} value={r}>{r} Stars</option>
                  ))}
                </select>
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
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-gold focus:ring-gold"
                />
                <span className="text-sm text-charcoal">Featured</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-gold focus:ring-gold"
                />
                <span className="text-sm text-charcoal">Active</span>
              </label>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-gold text-white rounded-lg hover:bg-gold-dark transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : editing ? 'Update' : 'Create'}
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
        {testimonials.length === 0 ? (
          <div className="p-12 text-center text-charcoal-light">
            No testimonials yet. Add your first customer testimonial.
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-light uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-light uppercase">Content</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-light uppercase">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-light uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-light uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {testimonials.map((t) => (
                <tr key={t.id} className={`hover:bg-gray-50 ${!t.isActive ? 'opacity-50' : ''}`}>
                  <td className="px-6 py-4">
                    <p className="font-medium text-charcoal">{t.name}</p>
                    <p className="text-sm text-charcoal-light">{t.title}</p>
                  </td>
                  <td className="px-6 py-4 text-charcoal text-sm max-w-md truncate">
                    {t.content.substring(0, 100)}...
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex text-gold">
                      {[...Array(t.rating)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {t.featured && (
                        <span className="px-2 py-1 text-xs rounded-full bg-gold/10 text-gold">Featured</span>
                      )}
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        t.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {t.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(t)}
                        className="text-gold hover:text-gold-dark font-medium text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="text-red-500 hover:text-red-700 font-medium text-sm"
                      >
                        Delete
                      </button>
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
