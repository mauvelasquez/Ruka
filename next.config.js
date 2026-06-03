/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.rukka.cl' }],
        destination: 'https://rukka.cl/:path*',
        permanent: true,
      },
      {
        source: '/fresia',
        destination: '/FresIA',
        permanent: true,
      },
    ]
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'source.unsplash.com' },
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
          { key: 'Permissions-Policy',       value: 'camera=(self), microphone=(), geolocation=()' },
          // SECURITY FIX #11: Content-Security-Policy — modo Report-Only para detectar violaciones sin bloquear.
          // Cuando las violaciones sean cero, cambiar a Content-Security-Policy para enforcement.
          // Nota: Next.js usa scripts inline para hidratación — se necesita 'unsafe-inline' hasta migrar a nonces.
          { key: 'Content-Security-Policy-Report-Only', value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://unpkg.com",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: https: blob:",
            "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.anthropic.com https://www.google-analytics.com https://nominatim.openstreetmap.org https://ipapi.co",
            "frame-ancestors 'none'",
          ].join('; ') },
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
