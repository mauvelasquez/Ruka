import './globals.css'
import Providers from './providers'

export const metadata = {
  title: 'Ruka – Intercambia tu hogar, vive Chile y el mundo',
  description: 'Ruka conecta viajeros que quieren intercambiar sus hogares. Vive como local en Chile y el mundo sin gastar en alojamiento.',
  keywords: 'ruka, intercambio hogar, home exchange, chile, viajes, mapuche',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🏔️</text></svg>" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
