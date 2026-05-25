import { createClient } from '@supabase/supabase-js'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rukka.cl'

export default async function sitemap() {
  const staticRoutes = [
    { url: baseUrl,                         lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${baseUrl}/como-funciona`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/homes`,              lastModified: new Date(), changeFrequency: 'daily',   priority: 0.8 },
    { url: `${baseUrl}/matches`,            lastModified: new Date(), changeFrequency: 'daily',   priority: 0.7 },
    { url: `${baseUrl}/onboarding`,         lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/anfitriones-airbnb`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/terminos`,           lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
  ]

  let homeRoutes = []
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    )
    const { data: homes } = await supabase
      .from('homes')
      .select('id, created_at')
      .order('created_at', { ascending: false })
      .limit(500)

    if (homes) {
      homeRoutes = homes.map((home) => ({
        url: `${baseUrl}/homes/${home.id}`,
        lastModified: new Date(home.created_at),
        changeFrequency: 'weekly',
        priority: 0.6,
      }))
    }
  } catch (e) {
    console.error('Sitemap: error fetching homes', e)
  }

  const countryRoutes = ['CL', 'MX', 'CO', 'AR'].map(code => ({
    url: `${baseUrl}/homes?country=${code}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }))

  return [...staticRoutes, ...countryRoutes, ...homeRoutes]
}
