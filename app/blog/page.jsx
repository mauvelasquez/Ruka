import Link from 'next/link'
import Image from 'next/image'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { getAllPosts } from '../../lib/blog'
import { getArticleCoverImage } from '../../lib/blogImage'
import { Calendar, ArrowRight } from 'lucide-react'

export const revalidate = 3600

export const metadata = {
  title: 'Blog de Rukka — Viaja sin pagar alojamiento',
  description: 'Guías sobre home exchange en Chile. Aprende a viajar gratis intercambiando tu hogar por todo Chile.',
  keywords: ['home exchange Chile', 'intercambio de casas', 'viajar gratis', 'blog rukka'],
  alternates: { canonical: 'https://rukka.cl/blog' },
  openGraph: {
    title: 'Blog de Rukka — Viaja sin pagar alojamiento',
    description: 'Guías sobre home exchange en Chile.',
    url: 'https://rukka.cl/blog',
    siteName: 'Rukka',
    type: 'website',
  },
}

const CLUSTER_COLORS = {
  LATAM:     { bg: 'bg-andean-50',  text: 'text-andean-dark',  border: 'border-andean/30',  label: '🌎 LATAM'     },
  Chile:     { bg: 'bg-forest-50',  text: 'text-forest-dark',  border: 'border-forest/30',  label: '🇨🇱 Chile'    },
  Argentina: { bg: 'bg-terra-50',   text: 'text-terra-dark',   border: 'border-terra/30',   label: '🇦🇷 Argentina'},
  Colombia:  { bg: 'bg-yellow-50',  text: 'text-yellow-700',   border: 'border-yellow-200', label: '🇨🇴 Colombia' },
  México:    { bg: 'bg-orange-50',  text: 'text-orange-700',   border: 'border-orange-200', label: '🇲🇽 México'   },
}

const MARKETS = ['Todos', 'Chile', 'Argentina', 'Colombia', 'México', 'LATAM']

function PostCard({ post }) {
  const cluster = CLUSTER_COLORS[post.market] || CLUSTER_COLORS.LATAM
  const dateStr = post.lastUpdated
    ? new Date(post.lastUpdated).toLocaleDateString('es-CL', { year: 'numeric', month: 'long' })
    : ''
  const imgSrc = getArticleCoverImage(post.title, post.description, post.image)

  return (
    <Link href={`/blog/${post.slug}`} className="group bg-white rounded-2xl border border-stone-200/60 shadow-sm hover:shadow-md hover:border-forest/40 transition-all overflow-hidden flex flex-col">
      <div className="relative h-44 overflow-hidden bg-stone-100">
        <Image
          src={imgSrc}
          alt={post.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          unoptimized={imgSrc.includes('source.unsplash.com')}
        />
        <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold border ${cluster.bg} ${cluster.text} ${cluster.border}`}>
          {cluster.label}
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h2 className="font-extrabold text-gray-900 text-base leading-snug mb-2 group-hover:text-forest transition-colors line-clamp-2">
          {post.title}
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 flex-1">{post.description}</p>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-stone-100">
          {dateStr && (
            <span className="flex items-center gap-1.5 text-xs text-gray-400">
              <Calendar className="w-3 h-3" /> {dateStr}
            </span>
          )}
          <span className="flex items-center gap-1 text-xs font-semibold text-forest ml-auto">
            Leer artículo <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  )
}

export default function BlogPage({ searchParams }) {
  const posts = getAllPosts()
  const mercado = searchParams?.mercado || 'Todos'
  const filtered = mercado === 'Todos' ? posts : posts.filter(p => p.market === mercado)

  return (
    <div className="min-h-screen" style={{ background: '#F8F4EE' }}>
      <Navbar />

      <div className="bg-forest text-white py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-forest-100 text-sm font-semibold uppercase tracking-widest mb-3">Blog Rukka</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 leading-tight">
            Viaja sin pagar alojamiento
          </h1>
          <p className="text-white/75 text-lg max-w-xl mx-auto">
            Guías sobre home exchange en Chile, Argentina, Colombia y México. Todo lo que necesitas para viajar gratis intercambiando tu hogar.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filtros por mercado */}
        <div className="flex flex-wrap gap-2 mb-8">
          {MARKETS.map(m => (
            <Link
              key={m}
              href={m === 'Todos' ? '/blog' : `/blog?mercado=${encodeURIComponent(m)}`}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                mercado === m
                  ? 'bg-forest text-white border-forest shadow-sm'
                  : 'bg-white text-gray-600 border-stone-200 hover:border-forest hover:text-forest'
              }`}
            >
              {m === 'Todos' ? '🌐 Todos' : (CLUSTER_COLORS[m]?.label || m)}
            </Link>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No hay artículos para este filtro.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(post => <PostCard key={post.slug} post={post} />)}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
