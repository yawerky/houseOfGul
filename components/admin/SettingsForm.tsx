'use client'

import { useState } from 'react'

export default function SettingsForm() {
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const [settings, setSettings] = useState({
    storeName: 'House of Gul',
    storeEmail: 'contact@houseofgul.com',
    storePhone: '+1 (555) 123-4567',
    currency: 'USD',
    timezone: 'America/New_York',
    orderPrefix: 'HOG',
    minimumOrderAmount: '50',
    freeShippingThreshold: '150',
  })

  const handleSave = async () => {
    setLoading(true)
    setSaved(false)

    // In a real app, you would save these to the database
    // For now, we just simulate a save
    await new Promise((resolve) => setTimeout(resolve, 500))

    setLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="font-serif text-lg text-charcoal mb-4">Store Settings</h2>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">Store Name</label>
            <input
              type="text"
              value={settings.storeName}
              onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">Store Email</label>
            <input
              type="email"
              value={settings.storeEmail}
              onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">Store Phone</label>
            <input
              type="tel"
              value={settings.storePhone}
              onChange={(e) => setSettings({ ...settings, storePhone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">Order Prefix</label>
            <input
              type="text"
              value={settings.orderPrefix}
              onChange={(e) => setSettings({ ...settings, orderPrefix: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">Currency</label>
            <select
              value={settings.currency}
              onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="INR">INR - Indian Rupee</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">Timezone</label>
            <select
              value={settings.timezone}
              onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
            >
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="Asia/Kolkata">India Standard Time (IST)</option>
              <option value="Europe/London">Greenwich Mean Time (GMT)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              Minimum Order Amount ($)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={settings.minimumOrderAmount}
              onChange={(e) => setSettings({ ...settings, minimumOrderAmount: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              Free Shipping Threshold ($)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={settings.freeShippingThreshold}
              onChange={(e) => setSettings({ ...settings, freeShippingThreshold: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4">
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-2 bg-gold text-white rounded-lg hover:bg-gold-dark transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
          {saved && <span className="text-green-600 text-sm">Settings saved successfully!</span>}
        </div>
      </div>
    </div>
  )
}
