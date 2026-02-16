'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function GoogleSheetImport() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [sheetUrl, setSheetUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<{ success: number; failed: number; errors: string[] } | null>(null)

  const handleImport = async () => {
    if (!sheetUrl) {
      setError('Please enter a Google Sheet URL')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/admin/products/import-sheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sheetUrl }),
      })

      const data = await response.json()

      if (response.ok) {
        setResult(data)
        if (data.success > 0) {
          router.refresh()
        }
      } else {
        setError(data.error || 'Failed to import products')
      }
    } catch (err) {
      setError('An error occurred while importing')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setSheetUrl('')
    setError('')
    setResult(null)
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        Import from Google Sheet
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-serif text-charcoal">Import Products from Google Sheet</h2>
                <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h3 className="font-medium text-charcoal mb-2">Instructions:</h3>
                <ol className="list-decimal list-inside text-sm text-charcoal-light space-y-1">
                  <li>Create a Google Sheet with your products</li>
                  <li>Make sure the sheet is <strong>publicly accessible</strong> (Share → Anyone with the link)</li>
                  <li>Use these column headers (first row):
                    <code className="block mt-2 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                      name, price, description, category, occasion, season, flowers, images, featured, inStock, story, deliveryInfo
                    </code>
                  </li>
                  <li>Paste the Google Sheet URL below</li>
                </ol>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-charcoal mb-1">
                  Google Sheet URL
                </label>
                <input
                  type="url"
                  value={sheetUrl}
                  onChange={(e) => setSheetUrl(e.target.value)}
                  placeholder="https://docs.google.com/spreadsheets/d/..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              {result && (
                <div className={`mb-4 p-4 rounded-lg ${result.success > 0 ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                  <p className="font-medium text-charcoal">
                    Import Complete: {result.success} products imported, {result.failed} failed
                  </p>
                  {result.errors.length > 0 && (
                    <ul className="mt-2 text-sm text-red-600 list-disc list-inside">
                      {result.errors.slice(0, 5).map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                      {result.errors.length > 5 && (
                        <li>...and {result.errors.length - 5} more errors</li>
                      )}
                    </ul>
                  )}
                </div>
              )}

              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Example Sheet Format:</strong>
                </p>
                <div className="mt-2 overflow-x-auto">
                  <table className="text-xs border-collapse">
                    <thead>
                      <tr className="bg-blue-100">
                        <th className="border border-blue-200 px-2 py-1">name</th>
                        <th className="border border-blue-200 px-2 py-1">price</th>
                        <th className="border border-blue-200 px-2 py-1">description</th>
                        <th className="border border-blue-200 px-2 py-1">category</th>
                        <th className="border border-blue-200 px-2 py-1">images</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-blue-200 px-2 py-1">Rose Bouquet</td>
                        <td className="border border-blue-200 px-2 py-1">99.99</td>
                        <td className="border border-blue-200 px-2 py-1">Beautiful roses</td>
                        <td className="border border-blue-200 px-2 py-1">Romantic</td>
                        <td className="border border-blue-200 px-2 py-1">url1, url2</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleImport}
                  disabled={loading || !sheetUrl}
                  className="px-6 py-2 bg-gold text-white rounded-lg hover:bg-gold-dark transition-colors disabled:opacity-50"
                >
                  {loading ? 'Importing...' : 'Import Products'}
                </button>
                <button
                  onClick={handleClose}
                  className="px-6 py-2 bg-gray-100 text-charcoal rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
