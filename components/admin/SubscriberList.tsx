'use client'

interface Subscriber {
  id: string
  email: string
  name: string | null
  source: string | null
  isSubscribed: boolean
  createdAt: string
}

export default function SubscriberList({ subscribers }: { subscribers: Subscriber[] }) {
  const activeCount = subscribers.filter((s) => s.isSubscribed).length

  const handleExport = () => {
    const csv = ['Email,Name,Source,Status,Date']
    subscribers.forEach((s) => {
      csv.push(`${s.email},${s.name || ''},${s.source || ''},${s.isSubscribed ? 'Active' : 'Unsubscribed'},${new Date(s.createdAt).toLocaleDateString()}`)
    })
    const blob = new Blob([csv.join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'subscribers.csv'
    a.click()
  }

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-charcoal-light text-sm">Total Subscribers</p>
          <p className="text-3xl font-serif text-charcoal mt-1">{subscribers.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-charcoal-light text-sm">Active Subscribers</p>
          <p className="text-3xl font-serif text-green-600 mt-1">{activeCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-charcoal-light text-sm">Unsubscribed</p>
          <p className="text-3xl font-serif text-gray-400 mt-1">{subscribers.length - activeCount}</p>
        </div>
      </div>

      {/* Export Button */}
      <div className="mb-6">
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-gold text-white rounded-lg hover:bg-gold-dark transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export CSV
        </button>
      </div>

      {/* Subscribers Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {subscribers.length === 0 ? (
          <div className="p-12 text-center text-charcoal-light">
            No subscribers yet. Add the newsletter form to your website.
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-light uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-light uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-light uppercase">Source</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-light uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-light uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {subscribers.map((subscriber) => (
                <tr key={subscriber.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-charcoal">{subscriber.email}</td>
                  <td className="px-6 py-4 text-charcoal">{subscriber.name || '-'}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-charcoal capitalize">
                      {subscriber.source || 'website'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      subscriber.isSubscribed
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {subscriber.isSubscribed ? 'Active' : 'Unsubscribed'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-charcoal-light text-sm">
                    {new Date(subscriber.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}
