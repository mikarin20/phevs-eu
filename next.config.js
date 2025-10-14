/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
    domains: ['images.unsplash.com'],
    unoptimized: true
  }
}

module.exports = nextConfig
