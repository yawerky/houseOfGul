'use client'

import { useEffect, useState } from 'react'

type Settings = {
  storeName: string
  storeEmail: string
  storePhone: string
  whatsappNumber: string
  orderPrefix: string
  minimumOrderAmount: string
  freeDeliveryThreshold: string
  defaultDeliveryCharge: string
}

const fields: { key: keyof Settings; label: string; type: 'text' | 'email' | 'tel' | 'number'; help?: string }[] = [
  { key: 'storeName', label: 'Store Name', type: 'text' },
  { key: 'storeEmail', label: 'Store Email', type: 'email' },
  { key: 'storePhone', label: 'Store Phone', type: 'tel' },
  { key: 'whatsappNumber', label: 'WhatsApp Number', type: 'tel', help: 'With country code, digits only, e.g. 919461900344' },
  { key: 'orderPrefix', label: 'Order Number Prefix', type: 'text', help: 'Order numbers look like HOG-260922-AB12' },
  { key: 'minimumOrderAmount', label: 'Minimum Order Amount (₹)', type: 'number', help: '0 = no minimum' },
  { key: 'freeDeliveryThreshold', label: 'Free Delivery Above (₹)', type: 'number', help: 'Only matters if you charge for delivery. 0 = no threshold' },
  { key: 'defaultDeliveryCharge', label: 'Default Delivery Charge (₹)', type: 'number', help: '0 = free delivery (areas without their own charge)' },
]

export default function SettingsForm() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then(setSettings)
      .catch(() => setMessage({ type: 'error', text: 'Could not load settings. Refresh the page to try again.' }))
  }, [])

  const handleSave = async () => {
    if (!settings) return
    setLoading(true)
    setMessage(null)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      if (!res.ok) throw new Error()
      setSettings(await res.json())
      setMessage({ type: 'ok', text: 'Settings saved.' })
      setTimeout(() => setMessage(null), 3000)
    } catch {
      setMessage({ type: 'error', text: 'Settings were not saved. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="font-serif text-lg text-charcoal mb-1">Store Settings</h2>
      <p className="text-sm text-charcoal-light mb-4">
        Prices are in Indian Rupees (₹). These values are used at checkout.
      </p>

      {!settings ? (
        <p className="text-sm text-charcoal-light">{message?.text || 'Loading settings…'}</p>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((field) => (
              <div key={field.key}>
                <label htmlFor={`setting-${field.key}`} className="block text-sm font-medium text-charcoal mb-1">
                  {field.label}
                </label>
                <input
                  id={`setting-${field.key}`}
                  type={field.type}
                  min={field.type === 'number' ? 0 : undefined}
                  step={field.type === 'number' ? 1 : undefined}
                  value={settings[field.key]}
                  onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
                {field.help && <p className="text-xs text-charcoal-light mt-1">{field.help}</p>}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-6 py-2 bg-gold text-white rounded-lg hover:bg-gold-dark transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Settings'}
            </button>
            {message && (
              <span className={`text-sm ${message.type === 'ok' ? 'text-green-600' : 'text-red-600'}`}>
                {message.text}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
