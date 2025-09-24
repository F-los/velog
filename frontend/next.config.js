/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://fast-cow-flos-a3aa5bcd.koyeb.app',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'https://fast-cow-flos-a3aa5bcd.koyeb.app'}/:path*`,
      },
    ]
  },
}

module.exports = nextConfig