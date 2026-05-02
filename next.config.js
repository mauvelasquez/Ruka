/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'i.pravatar.cc' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      // Airbnb CDN — fotos importadas vía Apify
      { protocol: 'https', hostname: 'a0.muscache.com' },
      { protocol: 'https', hostname: '*.muscache.com' },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options',         value: 'DENY' },
          { key: 'X-Content-Type-Options',   value: 'nosniff' },
          { key: 'Referrer-Policy',          value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',       value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        // Cloudflare y cualquier CDN no deben cachear respuestas de auth
        source: '/auth/:path*',
        headers: [
          { key: 'Cache-Control',    value: 'no-store, no-cache, must-revalidate, proxy-revalidate' },
          { key: 'Pragma',           value: 'no-cache' },
          { key: 'Surrogate-Control', value: 'no-store' },
        ],
      },
    ]
  },
}
module.exports = nextConfig
