import { createClient } from '@supabase/supabase-js'
import { COUNTRY_SLUGS, cityData, TARGET_CITIES_BY_COUNTRY } from '../lib/cityData'
import { getAllPosts } from '../lib/blog'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rukka.cl'

export default async function sitemap() {
  const blogPosts = getAllPosts()
  // Solo artículos de Chile en el sitemap; los de otros mercados tienen noindex
  const chilePosts = blogPosts.filter(p => !p.market || p.market === 'Chile')
  const blogRoutes = [
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    ...chilePosts.map(p => ({
      url: `${baseUrl}/blog/${p.slug}`,
      lastModified: new Date(p.lastUpdated || p.date),
      changeFrequency: 'monthly',
      priority: 0.7,
    })),
  ]

  const staticRoutes = [
    { url: baseUrl,                         lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${baseUrl}/como-funciona`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/about`,              lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/tokens`,             lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/homes`,              lastModified: new Date(), changeFrequency: 'daily',   priority: 0.8 },
    { url: `${baseUrl}/anfitriones-airbnb`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/FresIA`,             lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/terminos`,           lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
  ]

  // Solo incluir Chile en el sitemap; los demás países tienen noindex
  const paisRoutes = ['chile'].map(pais => ({
    url: `${baseUrl}/homes/${pais}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  }))

  // Solo ciudades chilenas en el sitemap
  const ciudadRoutes = Object.entries(cityData)
    .filter(([, data]) => data.country === 'chile')
    .map(([slug, data]) => ({
      url: `${baseUrl}/homes/${data.country}/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }))

  // Las URLs con query string (/homes?country=CL) no deben ir en el sitemap:
  // Google las trata como "página alternativa con etiqueta canónica adecuada"
  // porque su canonical apunta a /homes. Usar paisRoutes en su lugar.

  let homeRoutes = []

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!supabaseUrl || !supabaseKey) {
      return [...staticRoutes, ...blogRoutes, ...paisRoutes, ...ciudadRoutes]
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data: homes } = await supabase
      .from('homes')
      .select('id, updated_at, created_at')
      .order('created_at', { ascending: false })
      .limit(5000)

    if (homes) {
      homeRoutes = homes.map(home => ({
        url: `${baseUrl}/homes/${home.id}`,
        lastModified: new Date(home.updated_at || home.created_at),
        changeFrequency: 'weekly',
        priority: 0.8,
      }))
    }

  } catch (e) {
    console.error('Sitemap: error fetching dynamic routes', e)
  }

  return [...staticRoutes, ...blogRoutes, ...paisRoutes, ...ciudadRoutes, ...homeRoutes]
}
