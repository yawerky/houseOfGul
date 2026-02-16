import { getAdminSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import SettingsForm from '@/components/admin/SettingsForm'
import PasswordChangeForm from '@/components/admin/PasswordChangeForm'

export default async function SettingsPage() {
  const session = await getAdminSession()
  if (!session) redirect('/admin/login')

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-serif text-charcoal">Settings</h1>
          <p className="text-charcoal-light">Manage your store settings</p>
        </div>

        <div className="max-w-2xl space-y-6">
          {/* Store Settings */}
          <SettingsForm />

          {/* Password Change */}
          <PasswordChangeForm />

          {/* Danger Zone */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="font-serif text-lg text-red-600 mb-4">Danger Zone</h2>
            <p className="text-charcoal-light text-sm mb-4">
              These actions are irreversible. Please proceed with caution.
            </p>
            <div className="space-y-3">
              <button
                disabled
                className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Clear All Orders (Coming Soon)
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
