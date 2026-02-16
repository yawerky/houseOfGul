'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Banner {
  id: string
  title: string
  subtitle: string | null
  buttonText: string | null
  buttonLink: string | null
  image: string
  position: string
  isActive: boolean
  order: number
}

export default function BannerManager({ initialBanners }: { initialBanners: Banner[] }) {
  const router = useRouter()
  const [banners, setBanners] = useState(initialBanners)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Banner | null>(null)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    buttonText: '',
    buttonLink: '',
    image: '',
    position: 'hero',
    isActive: true,
    order: '0',
  })

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      buttonText: '',
      buttonLink: '',
      image: '',
      position: 'hero',
      isActive: true,
      order: '0',
    })
    setEditing(null)
    setShowForm(false)
  }

  const handleEdit = (banner: Banner) => {
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || '',
      buttonText: banner.buttonText || '',
      buttonLink: banner.buttonLink || '',
      image: banner.image,
      position: banner.position,
      isActive: banner.isActive,
      order: banner.order.toString(),
    })
    setEditing(banner)
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = editing ? `/api/admin/banners/${editing.id}` : '/api/admin/banners'

      const response = await fetch(url, {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          order: parseInt(formData.order),
        }),
      })

      if (response.ok) {
        resetForm()
        router.refresh()
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to save banner')
      }
    } catch (error) {
      alert('Error saving banner')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return

    try {
      const response = await fetch(`/api/admin/banners/${id}`, { method: 'DELETE' })
      if (response.ok) {
        setBanners(banners.filter((b) => b.id !== id))
        router.refresh()
      }
    } catch (error) {
      alert('Error deleting banner')
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
        Add Banner
      </button>

      {showForm && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="font-serif text-lg text-charcoal mb-4">
            {editing ? 'Edit Banner' : 'Add New Banner'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Subtitle</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Image URL *</label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                placeholder="https://..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Button Text</label>
                <input
                  type="text"
                  value={formData.buttonText}
                  onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                  placeholder="Shop Now"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Button Link</label>
                <input
                  type="text"
                  value={formData.buttonLink}
                  onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                  placeholder="/shop"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Position</label>
                <select
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                >
                  <option value="hero">Hero (Main)</option>
                  <option value="secondary">Secondary</option>
                  <option value="popup">Popup</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Order</label>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.length === 0 ? (
          <div className="col-span-2 bg-white rounded-lg shadow-sm p-12 text-center text-charcoal-light">
            No banners yet. Add your first banner.
          </div>
        ) : (
          banners.map((banner) => (
            <div key={banner.id} className={`bg-white rounded-lg shadow-sm overflow-hidden ${!banner.isActive ? 'opacity-50' : ''}`}>
              <div className="aspect-video bg-gray-100 relative">
                <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                <span className={`absolute top-2 right-2 px-2 py-1 text-xs rounded-full ${
                  banner.position === 'hero' ? 'bg-gold text-white' :
                  banner.position === 'secondary' ? 'bg-blue-500 text-white' : 'bg-purple-500 text-white'
                }`}>
                  {banner.position}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-charcoal">{banner.title}</h3>
                {banner.subtitle && <p className="text-sm text-charcoal-light">{banner.subtitle}</p>}
                <div className="flex gap-2 mt-4">
                  <button onClick={() => handleEdit(banner)} className="text-gold hover:text-gold-dark text-sm font-medium">Edit</button>
                  <button onClick={() => handleDelete(banner.id)} className="text-red-500 hover:text-red-700 text-sm font-medium">Delete</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
