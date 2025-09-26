/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // Disabled to support dynamic routes
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://fast-cow-flos-a3aa5bcd.koyeb.app',
  },
  // Note: rewrites don't work with static export, will use client-side API calls instead
}

module.exports = nextConfig