import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin',
  description: 'House of Gul Admin Panel',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      {children}
    </div>
  )
}
