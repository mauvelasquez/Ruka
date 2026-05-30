export const runtime = 'nodejs'

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')
  if (!q?.trim()) return Response.json([])

  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1&countrycodes=cl`
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'rukka.cl/1.0 (contacto@rukka.cl)',
        'Accept-Language': 'es',
        'Accept': 'application/json',
      },
      next: { revalidate: 86400 },
    })
    if (!res.ok) return Response.json([])
    const data = await res.json()
    return Response.json(Array.isArray(data) ? data : [])
  } catch {
    return Response.json([])
  }
}
