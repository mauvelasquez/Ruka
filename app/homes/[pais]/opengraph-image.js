import { ImageResponse } from 'next/og'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'
export const alt = 'Rukka — Intercambio de hogares'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }) {
  let title = 'Hogar disponible para intercambio'
  let city = 'Latinoamérica'
  let homeType = 'Casa'
  let imageUrl = null

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    )
    const { data: home } = await supabase
      .from('homes')
      .select('title, city, location, type, images')
      .eq('id', params.pais)
      .single()

    if (home) {
      title = home.title || title
      city = home.city || home.location || city
      homeType = home.type || homeType
      imageUrl = home.images?.[0] || null
    }
  } catch {
    // fallback to defaults
  }

  let homeBg = null
  if (imageUrl) {
    try {
      const res = await fetch(imageUrl)
      if (res.ok) homeBg = await res.arrayBuffer()
    } catch {
      // fallback to branded background
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '1200px',
          height: '630px',
          position: 'relative',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Background: home image or branded gradient */}
        {homeBg ? (
          <img
            src={imageUrl}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 50%, #40916C 100%)',
            }}
          />
        )}

        {/* Dark overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: homeBg
              ? 'linear-gradient(to top, rgba(0,0,0,0.85) 40%, rgba(0,0,0,0.3) 100%)'
              : 'rgba(0,0,0,0.15)',
          }}
        />

        {/* Content */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '48px 56px',
            width: '100%',
          }}
        >
          {/* Top: Rukka brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '12px',
                padding: '8px 16px',
                color: 'white',
                fontSize: '18px',
                fontWeight: '800',
                letterSpacing: '-0.5px',
              }}
            >
              rukka
            </div>
            <div
              style={{
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '100px',
                padding: '6px 14px',
                color: 'rgba(255,255,255,0.9)',
                fontSize: '13px',
                fontWeight: '600',
              }}
            >
              ⇄ Intercambio gratuito
            </div>
          </div>

          {/* Bottom: title + location */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'rgba(255,255,255,0.75)',
                fontSize: '18px',
                fontWeight: '500',
              }}
            >
              <span>📍</span>
              <span>{city}</span>
              <span style={{ opacity: 0.5 }}>·</span>
              <span>{homeType}</span>
            </div>
            <div
              style={{
                color: 'white',
                fontSize: title.length > 50 ? '38px' : '46px',
                fontWeight: '800',
                lineHeight: '1.15',
                letterSpacing: '-1px',
                maxWidth: '900px',
              }}
            >
              {title}
            </div>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
