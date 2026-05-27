import ComoFuncionaClient from './ComoFuncionaClient'

export const metadata = {
  title: '¿Cómo funciona Rukka? Intercambio de casas en Latinoamérica',
  description: 'Rukka conecta propietarios de Chile, México, Colombia y Argentina para intercambiar casas gratis. Match bilateral directo (fechas compatibles simultáneas) o sistema de Yankis (tokens para viajar asíncrono). Sin pagar alojamiento.',
  keywords: [
    'cómo funciona Rukka',
    'intercambio de casas latinoamerica',
    'home exchange gratis',
    'match bilateral casas',
    'sistema Yankis tokens',
    'intercambio casas Chile México Colombia Argentina',
    'viajar sin pagar hotel LATAM',
  ],
  openGraph: {
    title: '¿Cómo funciona Rukka? — Intercambio de casas en Latinoamérica',
    description: 'Modelo dual: match bilateral directo y sistema de Yankis. Opera en Chile, México, Colombia y Argentina. Alojamiento 100% gratuito por intercambio.',
    url: 'https://rukka.cl/como-funciona',
  },
  alternates: {
    canonical: 'https://rukka.cl/como-funciona',
  },
}

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: '¿Cómo funciona Rukka? Intercambio de casas en Latinoamérica',
  description: 'Rukka ofrece dos formas de intercambiar casas en Chile, México, Colombia y Argentina: match bilateral directo entre dos usuarios con fechas compatibles, o el sistema de Yankis (tokens) que permite viajar de forma asíncrona.',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Publica tu hogar en Rukka',
      text: 'Crea tu perfil y registra tu propiedad. Si ya estás en Airbnb, puedes importar tu listing automáticamente con IA. Al completar tu perfil recibes 3 Yankis de bienvenida.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Elige tu destino',
      text: 'Busca hogares disponibles en Chile, México, Colombia o Argentina. Filtra por fechas, tipo de propiedad y ciudad.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'El algoritmo encuentra tu match',
      text: 'Rukka detecta matches perfectos entre dos usuarios que quieren visitarse mutuamente en fechas compatibles (match bilateral directo). Si no hay match simultáneo, puedes usar Yankis para reservar de forma asíncrona.',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Confirma el intercambio y viaja',
      text: 'Confirmen el intercambio dentro de la plataforma. Ambos alojan sin pagar. Si usas Yankis, se descuentan automáticamente al confirmar.',
    },
  ],
}

export default function ComoFuncionaPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <ComoFuncionaClient />
    </>
  )
}
