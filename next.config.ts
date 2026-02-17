import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
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
  // Disable static page generation at build time
  // All pages will be server-rendered on demand
  experimental: {
    // This prevents build-time prerendering
  },
}

export default nextConfig
