'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  comparePrice: number | null
  description: string
  story: string | null
  category: string
  occasion: string | null
  season: string | null
  flowers: string
  images: string
  featured: boolean
  inStock: boolean
  stockCount: number
  deliveryInfo: string | null
}

interface CategoryOption {
  id: string
  name: string
  slug: string
}

interface OccasionOption {
  id: string
  name: string
  slug: string
}

const seasons = ['all', 'spring', 'summer', 'fall', 'winter']

export default function ProductForm({ product }: { product?: Product }) {
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [occasions, setOccasions] = useState<OccasionOption[]>([])

  useEffect(() => {
    // Fetch categories
    fetch('/api/admin/categories')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data.filter((c: CategoryOption & { isActive?: boolean }) => c.isActive !== false))
        }
      })
      .catch(() => {})

    // Fetch occasions
    fetch('/api/admin/occasions')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setOccasions(data.filter((o: OccasionOption & { isActive?: boolean }) => o.isActive !== false))
        }
      })
      .catch(() => {})
  }, [])
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const parseJson = (str: string | undefined) => {
    if (!str) return []
    try {
      return JSON.parse(str)
    } catch {
      return []
    }
  }

  const [formData, setFormData] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    price: product?.price?.toString() || '',
    comparePrice: product?.comparePrice?.toString() || '',
    description: product?.description || '',
    story: product?.story || '',
    category: product?.category || '',
    occasion: product?.occasion || '',
    season: product?.season || 'all',
    flowers: parseJson(product?.flowers).join(', '),
    images: parseJson(product?.images).join('\n'),
    featured: product?.featured || false,
    inStock: product?.inStock ?? true,
    stockCount: product?.stockCount?.toString() || '100',
    deliveryInfo: product?.deliveryInfo || '',
  })

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setFormData((prev) => ({
      ...prev,
      name,
      slug: prev.slug || generateSlug(name),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const payload = {
        name: formData.name,
        slug: formData.slug || generateSlug(formData.name),
        price: parseFloat(formData.price),
        comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : null,
        description: formData.description,
        story: formData.story || null,
        category: formData.category,
        occasion: formData.occasion || null,
        season: formData.season || 'all',
        flowers: formData.flowers.split(',').map((s: string) => s.trim()).filter(Boolean),
        images: formData.images.split('\n').map((s: string) => s.trim()).filter(Boolean),
        featured: formData.featured,
        inStock: formData.inStock,
        stockCount: parseInt(formData.stockCount) || 100,
        deliveryInfo: formData.deliveryInfo || null,
      }

      const url = product
        ? `/api/admin/products/${product.id}`
        : '/api/admin/products'

      const response = await fetch(url, {
        method: product ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        router.push('/admin/products')
        router.refresh()
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to save product')
      }
    } catch (err) {
      setError('An error occurred while saving the product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="font-serif text-lg text-charcoal mb-4">Basic Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              Product Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={handleNameChange}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
              placeholder="e.g., Classic Rose Bouquet"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              URL Slug *
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
              placeholder="e.g., classic-rose-bouquet"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 capitalize"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name} className="capitalize">
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              Occasion
            </label>
            <select
              value={formData.occasion}
              onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
            >
              <option value="">Select occasion</option>
              {occasions.map((occ) => (
                <option key={occ.id} value={occ.slug} className="capitalize">
                  {occ.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              Season
            </label>
            <select
              value={formData.season}
              onChange={(e) => setFormData({ ...formData, season: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
            >
              {seasons.map((s) => (
                <option key={s} value={s} className="capitalize">
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              Flowers (comma separated)
            </label>
            <input
              type="text"
              value={formData.flowers}
              onChange={(e) => setFormData({ ...formData, flowers: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
              placeholder="e.g., Roses, Orchids, Eucalyptus"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-charcoal mb-1">
            Story / Short Description
          </label>
          <input
            type="text"
            value={formData.story}
            onChange={(e) => setFormData({ ...formData, story: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
            placeholder="The story behind this arrangement"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-charcoal mb-1">
            Full Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            rows={4}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
            placeholder="Detailed product description"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="font-serif text-lg text-charcoal mb-4">Pricing & Inventory</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              Price ($) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              Compare at Price ($)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.comparePrice}
              onChange={(e) => setFormData({ ...formData, comparePrice: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
              placeholder="Original price for sale items"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              Stock Quantity
            </label>
            <input
              type="number"
              min="0"
              value={formData.stockCount}
              onChange={(e) => setFormData({ ...formData, stockCount: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
            />
          </div>
        </div>

        <div className="mt-4 flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.inStock}
              onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-gold focus:ring-gold"
            />
            <span className="text-sm text-charcoal">In Stock</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-gold focus:ring-gold"
            />
            <span className="text-sm text-charcoal">Featured Product</span>
          </label>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="font-serif text-lg text-charcoal mb-4">Images</h2>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">
            Image URLs (one per line)
          </label>
          <textarea
            value={formData.images}
            onChange={(e) => setFormData({ ...formData, images: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
            placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
          />
          <p className="text-sm text-charcoal-light mt-1">
            Enter image URLs, one per line. The first image will be used as the main product image.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="font-serif text-lg text-charcoal mb-4">Additional Information</h2>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">
            Delivery Information
          </label>
          <textarea
            value={formData.deliveryInfo}
            onChange={(e) => setFormData({ ...formData, deliveryInfo: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
            placeholder="Specific delivery details for this product (e.g., Same-day delivery available)"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-gold text-white rounded-lg hover:bg-gold-dark transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
        </button>
        <Link
          href="/admin/products"
          className="px-6 py-2 bg-gray-100 text-charcoal rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancel
        </Link>
      </div>
    </form>
  )
}
