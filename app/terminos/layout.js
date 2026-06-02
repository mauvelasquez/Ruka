export const metadata = {
  title: 'Términos y Condiciones | Rukka',
  description: 'Términos y condiciones de uso de Rukka, plataforma chilena de intercambio de hogares.',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Términos y condiciones — Rukka',
    description: 'Términos y condiciones del servicio de intercambio de hogares Rukka.',
    url: 'https://rukka.cl/terminos',
    siteName: 'Rukka',
    locale: 'es_CL',
    type: 'website',
  },
  alternates: {
    canonical: 'https://rukka.cl/terminos',
  },
}

export default function TerminosLayout({ children }) {
  return children
}
