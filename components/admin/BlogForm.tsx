'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  image: string
  category: string
  published: boolean
  author: string
}

const categories = [
  'Flower Care',
  'Gift Ideas',
  'Occasions',
  'Behind the Scenes',
  'Trends',
  'Tips & Tricks',
]

export default function BlogForm({ post }: { post?: BlogPost }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    content: post?.content || '',
    excerpt: post?.excerpt || '',
    image: post?.image || '',
    category: post?.category || '',
    published: post?.published || false,
    author: post?.author || '',
  })

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const payload = {
        title: formData.title,
        slug: formData.slug || generateSlug(formData.title),
        content: formData.content,
        excerpt: formData.excerpt,
        image: formData.image,
        category: formData.category,
        published: formData.published,
        author: formData.author,
      }

      const url = post
        ? `/api/admin/blog/${post.id}`
        : '/api/admin/blog'

      const response = await fetch(url, {
        method: post ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        router.push('/admin/blog')
        router.refresh()
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to save blog post')
      }
    } catch (err) {
      setError('An error occurred while saving the blog post')
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
        <h2 className="font-serif text-lg text-charcoal mb-4">Post Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-charcoal mb-1">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={handleTitleChange}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
              placeholder="Enter post title"
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
              placeholder="post-url-slug"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              Author
            </label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
              placeholder="Author name"
            />
          </div>

        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-charcoal mb-1">
            Featured Image URL *
          </label>
          <input
            type="url"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-charcoal mb-1">
            Excerpt
          </label>
          <textarea
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            rows={2}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
            placeholder="Brief summary of the post (displayed in blog listing)"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-charcoal mb-1">
            Content *
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            required
            rows={15}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 font-mono text-sm"
            placeholder="Write your blog post content here. You can use HTML for formatting."
          />
          <p className="text-sm text-charcoal-light mt-1">
            Supports HTML formatting (e.g., &lt;p&gt;, &lt;h2&gt;, &lt;ul&gt;, &lt;strong&gt;)
          </p>
        </div>

        <div className="mt-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-gold focus:ring-gold"
            />
            <span className="text-sm text-charcoal">Publish this post</span>
          </label>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-gold text-white rounded-lg hover:bg-gold-dark transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : post ? 'Update Post' : 'Create Post'}
        </button>
        <Link
          href="/admin/blog"
          className="px-6 py-2 bg-gray-100 text-charcoal rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancel
        </Link>
      </div>
    </form>
  )
}
