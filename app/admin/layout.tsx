import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin | House of Gul',
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
