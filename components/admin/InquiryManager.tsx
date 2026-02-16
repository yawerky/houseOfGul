'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Inquiry {
  id: string
  name: string
  email: string
  phone: string | null
  type: string
  eventDate: Date | null
  budget: string | null
  guests: string | null
  message: string
  status: string
  adminNote: string | null
  createdAt: Date
}

const statusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800',
  contacted: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  archived: 'bg-gray-100 text-gray-800',
}

export default function InquiryManager({ initialInquiries }: { initialInquiries: Inquiry[] }) {
  const router = useRouter()
  const [inquiries, setInquiries] = useState(initialInquiries)
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
  const [filter, setFilter] = useState('all')

  const filteredInquiries = filter === 'all'
    ? inquiries
    : inquiries.filter((i) => i.status === filter)

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        setInquiries(inquiries.map((i) => (i.id === id ? { ...i, status } : i)))
        if (selectedInquiry?.id === id) {
          setSelectedInquiry({ ...selectedInquiry, status })
        }
        router.refresh()
      }
    } catch (error) {
      alert('Error updating inquiry')
    }
  }

  const newCount = inquiries.filter((i) => i.status === 'new').length

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'All', value: 'all', count: inquiries.length },
          { label: 'New', value: 'new', count: inquiries.filter((i) => i.status === 'new').length },
          { label: 'Contacted', value: 'contacted', count: inquiries.filter((i) => i.status === 'contacted').length },
          { label: 'Completed', value: 'completed', count: inquiries.filter((i) => i.status === 'completed').length },
        ].map((item) => (
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
        {/* Inquiry List */}
        <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden">
          {filteredInquiries.length === 0 ? (
            <div className="p-12 text-center text-charcoal-light">No inquiries found.</div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredInquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  onClick={() => setSelectedInquiry(inquiry)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedInquiry?.id === inquiry.id ? 'bg-gold/5 border-l-4 border-gold' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-charcoal">{inquiry.name}</h3>
                      <p className="text-sm text-charcoal-light">{inquiry.email}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${statusColors[inquiry.status]}`}>
                      {inquiry.status}
                    </span>
                  </div>
                  <div className="flex gap-2 text-xs text-charcoal-light">
                    <span className="capitalize">{inquiry.type}</span>
                    <span>•</span>
                    <span>{new Date(inquiry.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Inquiry Detail */}
        {selectedInquiry && (
          <div className="w-96 bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="font-serif text-lg text-charcoal">{selectedInquiry.name}</h2>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="text-charcoal-light hover:text-charcoal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <p className="text-charcoal-light">Email</p>
                <a href={`mailto:${selectedInquiry.email}`} className="text-gold hover:underline">
                  {selectedInquiry.email}
                </a>
              </div>

              {selectedInquiry.phone && (
                <div>
                  <p className="text-charcoal-light">Phone</p>
                  <a href={`tel:${selectedInquiry.phone}`} className="text-gold hover:underline">
                    {selectedInquiry.phone}
                  </a>
                </div>
              )}

              <div>
                <p className="text-charcoal-light">Type</p>
                <p className="text-charcoal capitalize">{selectedInquiry.type}</p>
              </div>

              {selectedInquiry.eventDate && (
                <div>
                  <p className="text-charcoal-light">Event Date</p>
                  <p className="text-charcoal">{new Date(selectedInquiry.eventDate).toLocaleDateString()}</p>
                </div>
              )}

              {selectedInquiry.budget && (
                <div>
                  <p className="text-charcoal-light">Budget</p>
                  <p className="text-charcoal">{selectedInquiry.budget}</p>
                </div>
              )}

              {selectedInquiry.guests && (
                <div>
                  <p className="text-charcoal-light">Guests</p>
                  <p className="text-charcoal">{selectedInquiry.guests}</p>
                </div>
              )}

              <div>
                <p className="text-charcoal-light">Message</p>
                <p className="text-charcoal whitespace-pre-wrap">{selectedInquiry.message}</p>
              </div>

              <div>
                <p className="text-charcoal-light mb-2">Update Status</p>
                <div className="flex gap-2 flex-wrap">
                  {['new', 'contacted', 'completed', 'archived'].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusUpdate(selectedInquiry.id, status)}
                      className={`px-3 py-1 text-xs rounded-full capitalize transition-colors ${
                        selectedInquiry.status === status
                          ? statusColors[status]
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
