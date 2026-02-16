'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Pincode {
  id: string
  code: string
  area: string
  city: string
  state: string
  deliveryZone: string
  deliveryCharge: number
  minOrderFree: number | null
  isActive: boolean
}

export default function PincodeManager({
  initialPincodes,
}: {
  initialPincodes: Pincode[]
}) {
  const router = useRouter()
  const [pincodes, setPincodes] = useState(initialPincodes)
  const [showAddForm, setShowAddForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const [formData, setFormData] = useState({
    code: '',
    area: '',
    city: '',
    state: '',
    deliveryCharge: '50',
    deliveryZone: 'next-day',
    isActive: true,
  })

  const filteredPincodes = pincodes.filter(
    (p) =>
      p.code.includes(searchTerm) ||
      p.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.state.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/admin/pincodes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          deliveryCharge: parseFloat(formData.deliveryCharge),
        }),
      })

      if (response.ok) {
        const newPincode = await response.json()
        setPincodes([newPincode, ...pincodes])
        setShowAddForm(false)
        setFormData({
          code: '',
          area: '',
          city: '',
          state: '',
          deliveryCharge: '50',
          deliveryZone: 'next-day',
          isActive: true,
        })
        router.refresh()
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to add pincode')
      }
    } catch (error) {
      alert('Error adding pincode')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/pincodes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      })

      if (response.ok) {
        setPincodes(pincodes.map((p) => (p.id === id ? { ...p, isActive: !isActive } : p)))
        router.refresh()
      }
    } catch (error) {
      alert('Error updating pincode')
    }
  }

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Are you sure you want to delete pincode ${code}?`)) return

    try {
      const response = await fetch(`/api/admin/pincodes/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setPincodes(pincodes.filter((p) => p.id !== id))
        router.refresh()
      } else {
        alert('Failed to delete pincode')
      }
    } catch (error) {
      alert('Error deleting pincode')
    }
  }

  const handleCsvUpload = async () => {
    if (!csvFile) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', csvFile)

    try {
      const response = await fetch('/api/admin/pincodes/import', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const result = await response.json()
        alert(`Successfully imported ${result.count} pincodes`)
        setCsvFile(null)
        router.refresh()
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to import pincodes')
      }
    } catch (error) {
      alert('Error importing pincodes')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Actions Bar */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4 items-center">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-gold text-white rounded-lg hover:bg-gold-dark transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Pincode
          </button>

          <div className="flex items-center gap-2">
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
              className="text-sm file:mr-2 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-100 file:text-charcoal hover:file:bg-gray-200"
            />
            {csvFile && (
              <button
                onClick={handleCsvUpload}
                disabled={uploading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {uploading ? 'Importing...' : 'Import CSV'}
              </button>
            )}
          </div>
        </div>

        <input
          type="text"
          placeholder="Search by pincode, city, or state..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 w-64"
        />
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="font-serif text-lg text-charcoal mb-4">Add New Pincode</h2>
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Pincode *</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                required
                pattern="[0-9]{6}"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                placeholder="110001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Area</label>
              <input
                type="text"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                placeholder="Connaught Place"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">City *</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                placeholder="New Delhi"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">State *</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                placeholder="Delhi"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Delivery Zone</label>
              <select
                value={formData.deliveryZone}
                onChange={(e) => setFormData({ ...formData, deliveryZone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
              >
                <option value="same-day">Same Day</option>
                <option value="next-day">Next Day</option>
                <option value="2-3-days">2-3 Days</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Delivery Charge</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.deliveryCharge}
                onChange={(e) => setFormData({ ...formData, deliveryCharge: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
            </div>
            <div className="flex items-end gap-2 md:col-span-3">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-gold text-white rounded-lg hover:bg-gold-dark transition-colors disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Pincode'}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-gray-100 text-charcoal rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CSV Format Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-800 mb-2">CSV Import Format</h3>
        <p className="text-sm text-blue-700">
          CSV should have headers: pincode, city, state, deliveryCharge, sameDayAvailable, nextDayAvailable
        </p>
        <code className="text-xs bg-blue-100 px-2 py-1 rounded mt-2 inline-block">
          pincode,city,state,deliveryCharge,sameDayAvailable,nextDayAvailable
          <br />
          110001,New Delhi,Delhi,50,true,true
        </code>
      </div>

      {/* Pincodes Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {filteredPincodes.length === 0 ? (
          <div className="p-12 text-center text-charcoal-light">
            {searchTerm ? 'No pincodes found matching your search' : 'No pincodes added yet'}
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-light uppercase tracking-wider">
                  Pincode
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-light uppercase tracking-wider">
                  Area
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-light uppercase tracking-wider">
                  City / State
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-light uppercase tracking-wider">
                  Delivery Charge
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-light uppercase tracking-wider">
                  Delivery Zone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-light uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-light uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPincodes.map((p) => (
                <tr key={p.id} className={`hover:bg-gray-50 ${!p.isActive ? 'opacity-50' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-charcoal">
                    {p.code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-charcoal">{p.area}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-charcoal">
                    {p.city}, {p.state}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-charcoal">
                    ₹{p.deliveryCharge.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      p.deliveryZone === 'same-day'
                        ? 'bg-green-100 text-green-800'
                        : p.deliveryZone === 'next-day'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {p.deliveryZone === 'same-day' ? 'Same Day' :
                       p.deliveryZone === 'next-day' ? 'Next Day' : '2-3 Days'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleActive(p.id, p.isActive)}
                      className={`px-2 py-1 text-xs rounded-full ${
                        p.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {p.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleDelete(p.id, p.code)}
                      className="text-red-500 hover:text-red-700 font-medium text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="text-sm text-charcoal-light">
        Showing {filteredPincodes.length} of {pincodes.length} pincodes
      </div>
    </div>
  )
}
