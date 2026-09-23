'use client'

import { useState } from 'react'
import { jobTypeLabel, jobTypes, type JobEntry } from '@/lib/jobs'

const emptyForm = {
  title: '',
  location: 'Jhotwara, Jaipur',
  type: 'full-time',
  summary: '',
  description: '',
  order: '0',
  isActive: true,
}

const inputClass =
  'w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50'

export default function JobManager({ initialJobs }: { initialJobs: JobEntry[] }) {
  const [jobs, setJobs] = useState(initialJobs)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<JobEntry | null>(null)
  const [formData, setFormData] = useState(emptyForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const sorted = [...jobs].sort((a, b) => a.order - b.order)

  const resetForm = () => {
    setFormData(emptyForm)
    setEditing(null)
    setShowForm(false)
    setError('')
  }

  const startAdd = () => {
    const nextOrder = jobs.reduce((max, j) => Math.max(max, j.order), 0) + 1
    setFormData({ ...emptyForm, order: String(nextOrder) })
    setEditing(null)
    setShowForm(true)
    setError('')
  }

  const startEdit = (job: JobEntry) => {
    setFormData({
      title: job.title,
      location: job.location,
      type: job.type,
      summary: job.summary || '',
      description: job.description,
      order: String(job.order),
      isActive: job.isActive,
    })
    setEditing(job)
    setShowForm(true)
    setError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const payload = (data: typeof formData) => ({
    title: data.title,
    location: data.location,
    type: data.type,
    summary: data.summary,
    description: data.description,
    order: Number(data.order) || 0,
    isActive: data.isActive,
  })

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(editing ? `/api/admin/jobs/${editing.id}` : '/api/admin/jobs', {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload(formData)),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save job')
      setJobs((prev) => (editing ? prev.map((j) => (j.id === data.id ? data : j)) : [...prev, data]))
      resetForm()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const toggleVisible = async (job: JobEntry) => {
    const res = await fetch(`/api/admin/jobs/${job.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...job, isActive: !job.isActive }),
    })
    if (res.ok) {
      const data = await res.json()
      setJobs((prev) => prev.map((j) => (j.id === data.id ? data : j)))
    } else {
      alert('Could not update this job. Please try again.')
    }
  }

  const move = async (job: JobEntry, direction: -1 | 1) => {
    const index = sorted.findIndex((j) => j.id === job.id)
    const other = sorted[index + direction]
    if (!other) return
    const updates = [
      { ...job, order: other.order },
      { ...other, order: job.order === other.order ? job.order + direction : job.order },
    ]
    const results = await Promise.all(
      updates.map((j) =>
        fetch(`/api/admin/jobs/${j.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(j),
        }).then((r) => (r.ok ? r.json() : null))
      )
    )
    setJobs((prev) => prev.map((j) => results.find((r) => r && r.id === j.id) || j))
  }

  const remove = async (job: JobEntry) => {
    if (!confirm(`Delete "${job.title}"? Applications already sent for it are kept.`)) return
    const res = await fetch(`/api/admin/jobs/${job.id}`, { method: 'DELETE' })
    if (res.ok) setJobs((prev) => prev.filter((j) => j.id !== job.id))
    else alert('Could not delete this job. Please try again.')
  }

  return (
    <div className="space-y-6">
      {!showForm && (
        <button onClick={startAdd} className="px-6 py-2 bg-gold text-white rounded-lg hover:bg-gold-dark transition-colors">
          Add Job
        </button>
      )}

      {showForm && (
        <form onSubmit={save} className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          <h2 className="font-serif text-lg text-charcoal">{editing ? `Edit ${editing.title}` : 'Add Job'}</h2>

          {error && <p className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="job-title" className="block text-sm font-medium text-charcoal mb-1">Job title *</label>
              <input id="job-title" className={inputClass} value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="e.g., Florist" required />
            </div>
            <div>
              <label htmlFor="job-location" className="block text-sm font-medium text-charcoal mb-1">Location</label>
              <input id="job-location" className={inputClass} value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="Jhotwara, Jaipur" />
            </div>
          </div>

          <div>
            <label htmlFor="job-summary" className="block text-sm font-medium text-charcoal mb-1">One line under the title</label>
            <input id="job-summary" className={inputClass} value={formData.summary} onChange={(e) => setFormData({ ...formData, summary: e.target.value })} placeholder="e.g., Mornings at the bench, arranging the day's boxes." />
          </div>

          <div>
            <label htmlFor="job-description" className="block text-sm font-medium text-charcoal mb-1">Description *</label>
            <textarea id="job-description" rows={10} className={inputClass} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder={'One paragraph per line.\n\nWhat the work is. What the hours are. What you need to already know.'} required />
            <p className="text-xs text-charcoal-light mt-1">Each line becomes a paragraph on the Careers page. Leave a blank line between them if it helps you read it.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="job-type" className="block text-sm font-medium text-charcoal mb-1">Employment type</label>
              <select id="job-type" className={inputClass} value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                {jobTypes.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="job-order" className="block text-sm font-medium text-charcoal mb-1">Order</label>
              <input id="job-order" type="number" className={inputClass} value={formData.order} onChange={(e) => setFormData({ ...formData, order: e.target.value })} />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="w-4 h-4" />
            <span className="text-sm text-charcoal">Show on the Careers page</span>
          </label>

          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="px-6 py-2 bg-gold text-white rounded-lg hover:bg-gold-dark transition-colors disabled:opacity-50">
              {loading ? 'Saving…' : editing ? 'Save Changes' : 'Add Job'}
            </button>
            <button type="button" onClick={resetForm} className="px-6 py-2 bg-gray-100 text-charcoal rounded-lg hover:bg-gray-200 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      )}

      {sorted.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center text-charcoal-light">
          No jobs posted. The Careers page says we are not hiring and still takes CVs.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-100">
          {sorted.map((job, i) => (
            <div key={job.id} className={`flex items-center gap-4 p-4 ${job.isActive ? '' : 'opacity-50'}`}>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-charcoal">
                  {job.title}
                  {!job.isActive && <span className="ml-2 text-xs text-charcoal-light">(hidden)</span>}
                </p>
                <p className="text-xs text-charcoal-light">
                  {jobTypeLabel(job.type)}{job.location ? ` · ${job.location}` : ''}
                </p>
                {job.summary && <p className="text-sm text-charcoal-light truncate mt-1">{job.summary}</p>}
              </div>
              <div className="flex items-center gap-1 text-sm">
                <button onClick={() => move(job, -1)} disabled={i === 0} className="px-2 py-1 text-charcoal-light hover:text-gold disabled:opacity-30" aria-label={`Move ${job.title} up`}>↑</button>
                <button onClick={() => move(job, 1)} disabled={i === sorted.length - 1} className="px-2 py-1 text-charcoal-light hover:text-gold disabled:opacity-30" aria-label={`Move ${job.title} down`}>↓</button>
                <button onClick={() => toggleVisible(job)} className="px-3 py-1 text-charcoal-light hover:text-gold">
                  {job.isActive ? 'Hide' : 'Show'}
                </button>
                <button onClick={() => startEdit(job)} className="px-3 py-1 text-gold hover:text-gold-dark">Edit</button>
                <button onClick={() => remove(job)} className="px-3 py-1 text-red-600 hover:text-red-700">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
