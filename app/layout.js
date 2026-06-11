import './globals.css'
import dynamic from 'next/dynamic'
import Providers from './providers'
import GoogleAnalytics from '../components/GoogleAnalytics'
import WelcomePopup from '../components/WelcomePopup'
import MetaPixel from '../components/MetaPixel'

const FresiaWidget   = dynamic(() => import('../components/fresia/FresiaWidget'),   { ssr: false })
const PublicarModal  = dynamic(() => import('../components/PublicarModal'),          { ssr: false })

export const metadata = {
  metadataBase: new URL('https://rukka.cl'),
  title: {
    default: 'Rukka — Intercambio de Casas en Chile',
    template: '%s | Rukka',
  },
  description: 'Rukka es la plataforma de intercambio de casas en Chile. Match bilateral directo y gratuito. Viaja por Chile intercambiando tu hogar. El alojamiento por intercambio es gratuito.',
  keywords: [
    'intercambio de casas Chile',
    'home exchange Chile',
    'house swap Chile',
    'plataforma intercambio hogares Chile',
    'match bilateral casas',
    'alternativa Airbnb gratuita Chile',
    'alternativa Kindred Chile',
    'HomeExchange gratis Chile',
    'Rukka',
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Rukka — Plataforma de Intercambio de Casas en Chile',
    description: 'Match bilateral directo para intercambiar casas en Chile. Alojamiento gratuito entre propietarios.',
    url: 'https://rukka.cl',
    siteName: 'Rukka',
    locale: 'es_CL',
    type: 'website',
    images: [{ url: 'https://rukka.cl/rukka-logo.png', width: 1080, height: 1080, alt: 'Rukka' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rukka — Intercambio de Casas en Chile',
    description: 'Match bilateral directo para intercambiar casas en Chile. 100% gratuito.',
    site: '@rukka_cl',
    images: ['https://rukka.cl/rukka-logo.png'],
  },
  alternates: {
    canonical: 'https://rukka.cl',
    languages: {
      'es-CL': 'https://rukka.cl',
    },
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="es-CL">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  '@id': 'https://rukka.cl/#organization',
                  'name': 'Rukka',
                  'url': 'https://rukka.cl',
                  'logo': {
                    '@type': 'ImageObject',
                    'url': 'https://rukka.cl/rukka-logo.png',
                    'width': 1080,
                    'height': 1080,
                  },
                  'description': 'Rukka es una plataforma de intercambio de casas en Chile con match bilateral directo: intercambio simultáneo y gratuito entre propietarios. Viaja por Chile intercambiando tu hogar.',
                  'knowsAbout': [
                    'home exchange',
                    'house swap',
                    'intercambio de casas',
                    'intercambio de hogares',
                    'viaje gratuito intercambio Chile',
                    'home exchange Chile',
                    'match bilateral propiedades',
                  ],
                  'areaServed': [
                    { '@type': 'Country', 'name': 'Chile', 'sameAs': 'https://www.wikidata.org/wiki/Q298' },
                  ],
                  'foundingLocation': {
                    '@type': 'Place',
                    'name': 'Santiago, Chile',
                  },
                  'contactPoint': {
                    '@type': 'ContactPoint',
                    'email': 'hola@rukka.cl',
                    'contactType': 'customer support',
                    'availableLanguage': 'Spanish',
                  },
                  'inLanguage': 'es-CL',
                  'sameAs': [
                    'https://twitter.com/rukka_cl',
                    'https://x.com/rukka_cl',
                    'https://www.instagram.com/rukka.cl/',
                  ],
                },
                {
                  '@type': 'WebSite',
                  '@id': 'https://rukka.cl/#website',
                  'url': 'https://rukka.cl',
                  'name': 'Rukka — Intercambio de casas en Chile',
                  'description': 'La plataforma chilena de home exchange. Viaja por Chile intercambiando tu hogar.',
                  'publisher': { '@id': 'https://rukka.cl/#organization' },
                  'inLanguage': 'es',
                  'potentialAction': {
                    '@type': 'SearchAction',
                    'target': 'https://rukka.cl/homes?search={search_term_string}',
                    'query-input': 'required name=search_term_string',
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <MetaPixel />
        <GoogleAnalytics />
        <Providers>
          {children}
          <FresiaWidget />
          <PublicarModal />
          {/* <WelcomePopup /> */}
        </Providers>
      </body>
    </html>
  )
}
