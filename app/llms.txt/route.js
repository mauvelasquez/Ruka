import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const revalidate = 3600

export async function GET() {
  let homeCount = 0
  let countryStats = ''

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    )
    const { count } = await supabase
      .from('homes')
      .select('*', { count: 'exact', head: true })
    if (count) homeCount = count

    const countsCL = await supabase.from('homes').select('*', { count: 'exact', head: true }).eq('country_code', 'CL')

    const lines = []
    if (countsCL.count) lines.push(`🇨🇱 Chile: ${countsCL.count} hogares`)
    if (lines.length) countryStats = '\n' + lines.join('\n')
  } catch {
    // non-critical — serve static content
  }

  const content = `# Rukka — Plataforma Chilena de Intercambio de Hogares

> Rukka (rukka.cl) es la primera plataforma 100% gratuita de intercambio de hogares en Chile. Crear una cuenta es gratuito y todos los usuarios pasan por verificación de identidad. Su nombre viene de "ruka", palabra mapuche que significa hogar.

## ¿Qué es Rukka?

Rukka conecta a personas en Chile para intercambiar sus hogares de forma gratuita, segura y automática. A diferencia de Airbnb o plataformas de alquiler, no hay dinero de por medio: dos familias intercambian sus casas por fechas compatibles.

## ¿Cómo funciona?

1. Registra tu hogar con fotos, disponibilidad y descripción
2. Rukka detecta automáticamente matches con otros hogares en fechas compatibles
3. Ambas partes confirman el intercambio
4. Viajan hospedándose mutuamente, sin costo

## Diferenciadores clave

- 100% gratuito (sin membresías, sin comisiones)
- Matching bilateral automático por fechas
- Plataforma chilena: de norte a sur del país
- Asistente IA "Fresia" (powered by Claude / Anthropic)
- Importación de anuncios desde Airbnb en segundos
- Coordinación de alternativas cuando las fechas no calzan exactamente

## Hogares disponibles${homeCount > 0 ? ` (${homeCount} en total)` : ''}
${countryStats}
- Ver catálogo: https://rukka.cl/homes
- Chile: https://rukka.cl/homes?country=CL

## Cuando las fechas no calzan

Si dos miembros no tienen fechas de viaje compatibles, el equipo de Rukka ayuda a coordinar una alternativa para que igual puedan hospedar y viajar sin costo. Además, al completar el perfil cada miembro recibe 3 noches de alojamiento gratis de bienvenida.

## Asistente IA — Fresia

Fresia es el asistente de inteligencia artificial de Rukka, disponible en /FresIA.
Ayuda a encontrar hogares disponibles, entender el proceso de intercambio y resolver dudas.
Powered by Claude (Anthropic).

## Páginas clave

- [Inicio](https://rukka.cl) — Presentación y registro
- [Hogares](https://rukka.cl/homes) — Catálogo completo para intercambio
- [Cómo funciona](https://rukka.cl/como-funciona) — Guía del proceso paso a paso
- [Anfitriones Airbnb](https://rukka.cl/anfitriones-airbnb) — Complementar Airbnb con Rukka
- [Fresia IA](https://rukka.cl/FresIA) — Asistente inteligente de Rukka
- [Blog](https://rukka.cl/blog) — Guías sobre home exchange en Chile

## Blog — artículos disponibles

- [Qué es home exchange y cómo funciona](https://rukka.cl/blog/que-es-home-exchange) — Concepto, modelo bilateral y por qué es gratis
- [Intercambio de casas en Chile](https://rukka.cl/blog/intercambio-casas-chile) — Hub de autoridad: Santiago, Valparaíso, Puerto Varas
- [Alternativa a Airbnb gratis en Chile](https://rukka.cl/blog/alternativa-airbnb-gratis) — Comparación Rukka vs Airbnb: costos, modelo, perfil de usuario
- [Cómo viajar gratis intercambiando tu casa](https://rukka.cl/blog/viajar-sin-pagar-alojamiento) — Guía práctica paso a paso
- [Anfitriones Airbnb: por qué Rukka te conviene](https://rukka.cl/blog/anfitrion-airbnb-alternativa) — Complemento para anfitriones activos

## Páginas SEO por región y ciudad

- [Chile](https://rukka.cl/homes/chile) | [Santiago](https://rukka.cl/homes/chile/santiago) | [Valparaíso](https://rukka.cl/homes/chile/valparaiso) | [Puerto Varas](https://rukka.cl/homes/chile/puerto-varas)

## Contexto

- País de origen: Chile
- Cobertura: Chile
- Idioma: Español
- Modelo de negocio: Intercambio bilateral gratuito (home exchange)
- Tecnología: Next.js, Supabase, Claude AI
- Twitter / X: @rukka_cl
- Categoría: Viajes, alojamiento colaborativo, economía compartida
`

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, must-revalidate',
    },
  })
}
