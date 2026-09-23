'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { applicationStatuses } from '@/lib/jobs'

interface Application {
  id: string
  jobTitle: string
  name: string
  email: string
  phone: string
  cvName: string
  cvSize: number
  note: string | null
  status: string
  adminNote: string | null
  createdAt: string
}

const statusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800',
  reviewing: 'bg-yellow-100 text-yellow-800',
  shortlisted: 'bg-purple-100 text-purple-800',
  hired: 'bg-green-100 text-green-800',
  'not-suitable': 'bg-gray-100 text-gray-800',
  archived: 'bg-gray-100 text-gray-800',
}

const statusLabel = (status: string) => status.replace('-', ' ')

const fileSize = (bytes: number) =>
  bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`

export default function JobApplicationManager({ initialApplications }: { initialApplications: Application[] }) {
  const router = useRouter()
  const [applications, setApplications] = useState(initialApplications)
  const [selected, setSelected] = useState<Application | null>(null)
  const [filter, setFilter] = useState('all')

  const shown = filter === 'all' ? applications : applications.filter((a) => a.status === filter)

  const update = async (id: string, data: Partial<Application>) => {
    const res = await fetch(`/api/admin/job-applications/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      alert('Could not update this application. Please try again.')
      return
    }
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, ...data } : a)))
    setSelected((prev) => (prev && prev.id === id ? { ...prev, ...data } : prev))
    router.refresh()
  }

  const remove = async (application: Application) => {
    if (
      !confirm(
        `Delete the application from ${application.name}? The CV is deleted with it and cannot be brought back.`
      )
    )
      return
    const res = await fetch(`/api/admin/job-applications/${application.id}`, { method: 'DELETE' })
    if (res.ok) {
      setApplications((prev) => prev.filter((a) => a.id !== application.id))
      setSelected(null)
      router.refresh()
    } else {
      alert('Could not delete this application. Please try again.')
    }
  }

  const counts = [
    { label: 'All', value: 'all', count: applications.length },
    { label: 'New', value: 'new', count: applications.filter((a) => a.status === 'new').length },
    { label: 'Reviewing', value: 'reviewing', count: applications.filter((a) => a.status === 'reviewing').length },
    { label: 'Shortlisted', value: 'shortlisted', count: applications.filter((a) => a.status === 'shortlisted').length },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {counts.map((item) => (
          <button
            key={item.value}
            onClick={() => setFilter(item.value)}
            className={`p-4 rounded-lg text-left transition-colors ${
              filter === item.value ? 'bg-gold text-white' : 'bg-white hover:bg-gray-50'
            }`}
          >
            <p className={`text-2xl font-serif ${filter === item.value ? 'text-white' : 'text-charcoal'}`}>
              {item.count}
            </p>
            <p className={`text-sm ${filter === item.value ? 'text-white/80' : 'text-charcoal-light'}`}>
              {item.label}
            </p>
          </button>
        ))}
      </div>

      <div className="flex gap-6">
        {/* List */}
        <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden">
          {shown.length === 0 ? (
            <div className="p-12 text-center text-charcoal-light">
              {applications.length === 0
                ? 'No applications yet. They arrive from the Careers page.'
                : 'No applications with that status.'}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {shown.map((application) => (
                <button
                  key={application.id}
                  onClick={() => setSelected(application)}
                  className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                    selected?.id === application.id ? 'bg-gold/5 border-l-4 border-gold' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-2 gap-4">
                    <div className="min-w-0">
                      <h3 className="font-medium text-charcoal truncate">{application.name}</h3>
                      <p className="text-sm text-charcoal-light truncate">{application.jobTitle}</p>
                    </div>
                    <span className={`flex-shrink-0 px-2 py-1 text-xs rounded-full capitalize ${statusColors[application.status] || statusColors.archived}`}>
                      {statusLabel(application.status)}
                    </span>
                  </div>
                  <div className="flex gap-2 text-xs text-charcoal-light">
                    <span>{new Date(application.createdAt).toLocaleDateString('en-IN')}</span>
                    <span>·</span>
                    <span className="truncate">{application.email}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Detail */}
        {selected && (
          <div className="w-96 flex-shrink-0 bg-white rounded-lg shadow-sm p-6 self-start">
            <div className="flex justify-between items-start mb-4">
              <h2 className="font-serif text-lg text-charcoal">{selected.name}</h2>
              <button onClick={() => setSelected(null)} className="text-charcoal-light hover:text-charcoal" aria-label="Close">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <p className="text-charcoal-light">Applying for</p>
                <p className="text-charcoal">{selected.jobTitle}</p>
              </div>

              <div>
                <p className="text-charcoal-light">Email</p>
                <a href={`mailto:${selected.email}`} className="text-gold hover:underline break-all">
                  {selected.email}
                </a>
              </div>

              <div>
                <p className="text-charcoal-light">Phone</p>
                <a href={`tel:${selected.phone}`} className="text-gold hover:underline">
                  {selected.phone}
                </a>
              </div>

              <div>
                <p className="text-charcoal-light">Received</p>
                <p className="text-charcoal">
                  {new Date(selected.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
              </div>

              {selected.note && (
                <div>
                  <p className="text-charcoal-light">Their note</p>
                  <p className="text-charcoal whitespace-pre-wrap">{selected.note}</p>
                </div>
              )}

              <div>
                <p className="text-charcoal-light mb-2">CV</p>
                <a
                  href={`/api/admin/job-applications/${selected.id}/cv`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gold text-white rounded-lg hover:bg-gold-dark transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download CV
                </a>
                <p className="text-xs text-charcoal-light mt-2 break-all">
                  {selected.cvName} · {fileSize(selected.cvSize)}
                </p>
              </div>

              <div>
                <p className="text-charcoal-light mb-2">Status</p>
                <div className="flex gap-2 flex-wrap">
                  {applicationStatuses.map((status) => (
                    <button
                      key={status}
                      onClick={() => update(selected.id, { status })}
                      className={`px-3 py-1 text-xs rounded-full capitalize transition-colors ${
                        selected.status === status
                          ? statusColors[status]
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {statusLabel(status)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="application-note" className="block text-charcoal-light mb-2">
                  Your note
                </label>
                <textarea
                  id="application-note"
                  rows={3}
                  defaultValue={selected.adminNote || ''}
                  key={selected.id}
                  onBlur={(e) => {
                    const value = e.target.value.trim()
                    if (value !== (selected.adminNote || '')) {
                      update(selected.id, { adminNote: value })
                    }
                  }}
                  placeholder="Called on Tuesday. Coming in to meet."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
                <p className="text-xs text-charcoal-light">Saved when you click away.</p>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <button
                  onClick={() => remove(selected)}
                  className="text-xs text-red-600 hover:text-red-700"
                >
                  Delete this application and its CV
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
