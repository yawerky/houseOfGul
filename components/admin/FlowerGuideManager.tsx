'use client'

import { useState } from 'react'
import ImageUploader from '@/components/admin/ImageUploader'
import type { FlowerGuideEntry } from '@/lib/flowerGuideDefaults'

const emptyForm = {
  name: '',
  meaning: '',
  symbolism: '',
  colors: '',
  season: '',
  careLevel: 'Easy',
  image: '',
  order: '0',
  isActive: true,
}

const inputClass =
  'w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50'

export default function FlowerGuideManager({ initialFlowers }: { initialFlowers: FlowerGuideEntry[] }) {
  const [flowers, setFlowers] = useState(initialFlowers)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<FlowerGuideEntry | null>(null)
  const [formData, setFormData] = useState(emptyForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const sorted = [...flowers].sort((a, b) => a.order - b.order)

  const resetForm = () => {
    setFormData(emptyForm)
    setEditing(null)
    setShowForm(false)
    setError('')
  }

  const startAdd = () => {
    const nextOrder = flowers.reduce((max, f) => Math.max(max, f.order), 0) + 1
    setFormData({ ...emptyForm, order: String(nextOrder) })
    setEditing(null)
    setShowForm(true)
    setError('')
  }

  const startEdit = (flower: FlowerGuideEntry) => {
    setFormData({
      name: flower.name,
      meaning: flower.meaning,
      symbolism: flower.symbolism.join(', '),
      colors: flower.colors.join('\n'),
      season: flower.season,
      careLevel: flower.careLevel,
      image: flower.image || '',
      order: String(flower.order),
      isActive: flower.isActive,
    })
    setEditing(flower)
    setShowForm(true)
    setError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const payload = (data: typeof formData) => ({
    name: data.name,
    meaning: data.meaning,
    symbolism: data.symbolism.split(',').map((s) => s.trim()).filter(Boolean),
    colors: data.colors.split('\n').map((s) => s.trim()).filter(Boolean),
    season: data.season,
    careLevel: data.careLevel,
    image: data.image,
    order: Number(data.order) || 0,
    isActive: data.isActive,
  })

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(editing ? `/api/admin/flower-guide/${editing.id}` : '/api/admin/flower-guide', {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload(formData)),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save flower')
      setFlowers((prev) => (editing ? prev.map((f) => (f.id === data.id ? data : f)) : [...prev, data]))
      resetForm()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const toggleVisible = async (flower: FlowerGuideEntry) => {
    const res = await fetch(`/api/admin/flower-guide/${flower.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...flower, isActive: !flower.isActive }),
    })
    if (res.ok) {
      const data = await res.json()
      setFlowers((prev) => prev.map((f) => (f.id === data.id ? data : f)))
    } else {
      alert('Could not update this flower. Please try again.')
    }
  }

  const move = async (flower: FlowerGuideEntry, direction: -1 | 1) => {
    const index = sorted.findIndex((f) => f.id === flower.id)
    const other = sorted[index + direction]
    if (!other) return
    const updates = [
      { ...flower, order: other.order },
      { ...other, order: flower.order === other.order ? flower.order + direction : flower.order },
    ]
    const results = await Promise.all(
      updates.map((f) =>
        fetch(`/api/admin/flower-guide/${f.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(f),
        }).then((r) => (r.ok ? r.json() : null))
      )
    )
    setFlowers((prev) => prev.map((f) => results.find((r) => r && r.id === f.id) || f))
  }

  const remove = async (flower: FlowerGuideEntry) => {
    if (!confirm(`Delete "${flower.name}" from the Flower Guide?`)) return
    const res = await fetch(`/api/admin/flower-guide/${flower.id}`, { method: 'DELETE' })
    if (res.ok) setFlowers((prev) => prev.filter((f) => f.id !== flower.id))
    else alert('Could not delete this flower. Please try again.')
  }

  return (
    <div className="space-y-6">
      {!showForm && (
        <button onClick={startAdd} className="px-6 py-2 bg-gold text-white rounded-lg hover:bg-gold-dark transition-colors">
          Add Flower
        </button>
      )}

      {showForm && (
        <form onSubmit={save} className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          <h2 className="font-serif text-lg text-charcoal">{editing ? `Edit ${editing.name}` : 'Add Flower'}</h2>

          {error && <p className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="flower-name" className="block text-sm font-medium text-charcoal mb-1">Flower name *</label>
              <input id="flower-name" className={inputClass} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Rose" required />
            </div>
            <div>
              <label htmlFor="flower-meaning" className="block text-sm font-medium text-charcoal mb-1">Meaning (shown as a quote) *</label>
              <input id="flower-meaning" className={inputClass} value={formData.meaning} onChange={(e) => setFormData({ ...formData, meaning: e.target.value })} placeholder="e.g., Love, passion and beauty" required />
            </div>
          </div>

          <div>
            <label htmlFor="flower-symbolism" className="block text-sm font-medium text-charcoal mb-1">Symbolism (comma separated)</label>
            <input id="flower-symbolism" className={inputClass} value={formData.symbolism} onChange={(e) => setFormData({ ...formData, symbolism: e.target.value })} placeholder="Romance, Devotion, Admiration, Gratitude" />
          </div>

          <div>
            <label htmlFor="flower-colors" className="block text-sm font-medium text-charcoal mb-1">Colour meanings (one per line)</label>
            <textarea id="flower-colors" rows={4} className={inputClass} value={formData.colors} onChange={(e) => setFormData({ ...formData, colors: e.target.value })} placeholder={'Red – Deep love\nPink – Grace and gratitude'} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="flower-season" className="block text-sm font-medium text-charcoal mb-1">Best season</label>
              <input id="flower-season" className={inputClass} value={formData.season} onChange={(e) => setFormData({ ...formData, season: e.target.value })} placeholder="All year · best Nov – Mar" />
            </div>
            <div>
              <label htmlFor="flower-care" className="block text-sm font-medium text-charcoal mb-1">Care level</label>
              <select id="flower-care" className={inputClass} value={formData.careLevel} onChange={(e) => setFormData({ ...formData, careLevel: e.target.value })}>
                <option value="Easy">Easy</option>
                <option value="Moderate">Moderate</option>
                <option value="Delicate">Delicate</option>
              </select>
            </div>
            <div>
              <label htmlFor="flower-order" className="block text-sm font-medium text-charcoal mb-1">Order</label>
              <input id="flower-order" type="number" className={inputClass} value={formData.order} onChange={(e) => setFormData({ ...formData, order: e.target.value })} />
            </div>
          </div>

          <div>
            <p className="block text-sm font-medium text-charcoal mb-1">Photo</p>
            <ImageUploader
              images={formData.image ? [formData.image] : []}
              onChange={(list) => setFormData((prev) => ({ ...prev, image: list[0] || '' }))}
              folder="flowers"
              multiple={false}
            />
            <p className="text-xs text-charcoal-light mt-1">Best size: 4:3 landscape, 1600 × 1200.</p>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="w-4 h-4" />
            <span className="text-sm text-charcoal">Show on website</span>
          </label>

          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="px-6 py-2 bg-gold text-white rounded-lg hover:bg-gold-dark transition-colors disabled:opacity-50">
              {loading ? 'Saving…' : editing ? 'Save Changes' : 'Add Flower'}
            </button>
            <button type="button" onClick={resetForm} className="px-6 py-2 bg-gray-100 text-charcoal rounded-lg hover:bg-gray-200 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      )}

      {sorted.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center text-charcoal-light">
          No flowers yet. Add your first flower.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-100">
          {sorted.map((flower, i) => (
            <div key={flower.id} className={`flex items-center gap-4 p-4 ${flower.isActive ? '' : 'opacity-50'}`}>
              <div className="w-24 aspect-[4/3] rounded bg-gray-100 overflow-hidden flex-shrink-0">
                {flower.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={flower.image} alt={flower.name} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-charcoal">
                  {flower.name}
                  {!flower.isActive && <span className="ml-2 text-xs text-charcoal-light">(hidden)</span>}
                </p>
                <p className="text-sm text-gold italic truncate">&ldquo;{flower.meaning}&rdquo;</p>
                <p className="text-xs text-charcoal-light truncate">
                  {flower.season}{flower.season && flower.careLevel ? ' · ' : ''}{flower.careLevel} care
                </p>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <button onClick={() => move(flower, -1)} disabled={i === 0} className="px-2 py-1 text-charcoal-light hover:text-gold disabled:opacity-30" aria-label={`Move ${flower.name} up`}>↑</button>
                <button onClick={() => move(flower, 1)} disabled={i === sorted.length - 1} className="px-2 py-1 text-charcoal-light hover:text-gold disabled:opacity-30" aria-label={`Move ${flower.name} down`}>↓</button>
                <button onClick={() => toggleVisible(flower)} className="px-3 py-1 text-charcoal-light hover:text-gold">
                  {flower.isActive ? 'Hide' : 'Show'}
                </button>
                <button onClick={() => startEdit(flower)} className="px-3 py-1 text-gold hover:text-gold-dark">Edit</button>
                <button onClick={() => remove(flower)} className="px-3 py-1 text-red-600 hover:text-red-700">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
