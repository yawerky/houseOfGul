import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // The Events page is hidden for now (see app/(website)/events/page.tsx).
  async redirects() {
    return [{ source: '/events', destination: '/', permanent: false }]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

export default nextConfig
