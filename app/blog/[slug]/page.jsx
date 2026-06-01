import { notFound } from 'next/navigation'
import Link from 'next/link'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'
import { getAllPosts, getPostBySlug, extractFAQs } from '../../../lib/blog'
import { getArticleCoverImage } from '../../../lib/blogImage'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { Calendar, ArrowRight, ArrowLeft, Home } from 'lucide-react'

export const revalidate = 3600

const CLUSTER_COLORS = {
  LATAM:     { bg: 'bg-andean-50',  text: 'text-andean-dark',  label: '🌎 LATAM'     },
  Chile:     { bg: 'bg-forest-50',  text: 'text-forest-dark',  label: '🇨🇱 Chile'    },
  Argentina: { bg: 'bg-terra-50',   text: 'text-terra-dark',   label: '🇦🇷 Argentina'},
  Colombia:  { bg: 'bg-yellow-50',  text: 'text-yellow-700',   label: '🇨🇴 Colombia' },
  México:    { bg: 'bg-orange-50',  text: 'text-orange-700',   label: '🇲🇽 México'   },
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return { title: 'Artículo no encontrado | Rukka' }
  const { frontmatter: fm } = post
  const url = `https://rukka.cl/blog/${fm.slug}`
  return {
    title: fm.title,
    description: fm.description,
    keywords: [fm.keyword, 'home exchange', 'intercambio hogares', 'rukka'],
    alternates: { canonical: url },
    openGraph: {
      title: fm.title,
      description: fm.description,
      url,
      siteName: 'Rukka',
      type: 'article',
      publishedTime: fm.date,
      modifiedTime: fm.lastUpdated,
      authors: [fm.author],
      images: fm.image ? [{ url: fm.image, width: 1200, height: 630, alt: fm.title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: fm.title,
      description: fm.description,
      images: fm.image ? [fm.image] : [],
    },
  }
}

function RelatedCard({ post }) {
  const cluster = CLUSTER_COLORS[post.market] || CLUSTER_COLORS.LATAM
  const imgSrc = getArticleCoverImage(post.title, post.description, post.image)
  return (
    <Link href={`/blog/${post.slug}`} className="group flex gap-3 p-3 rounded-xl hover:bg-forest-50 transition-colors">
      <div className="relative w-16 h-14 flex-shrink-0 overflow-hidden rounded-lg bg-stone-100">
        <img
          src={imgSrc}
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cluster.bg} ${cluster.text}`}>{cluster.label}</span>
        <p className="text-sm font-semibold text-gray-800 group-hover:text-forest mt-1 line-clamp-2 leading-snug">{post.title}</p>
      </div>
    </Link>
  )
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params
  const result = getPostBySlug(slug)
  if (!result) notFound()

  const { frontmatter: fm, content } = result
  const allPosts = getAllPosts()
  const related = (fm.relatedPosts || [])
    .map(s => allPosts.find(p => p.slug === s))
    .filter(Boolean)
    .slice(0, 3)

  const coverImg = getArticleCoverImage(fm.title, fm.description, fm.image)
  const faqs = extractFAQs(content)
  const dateStr = fm.lastUpdated
    ? new Date(fm.lastUpdated).toLocaleDateString('es-CL', { year: 'numeric', month: 'long' })
    : ''
  const cluster = CLUSTER_COLORS[fm.market] || CLUSTER_COLORS.LATAM

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: fm.title,
    description: fm.description,
    datePublished: fm.date,
    dateModified: fm.lastUpdated || fm.date,
    author: { '@type': 'Organization', name: fm.author || 'Equipo Rukka', url: 'https://rukka.cl' },
    publisher: { '@type': 'Organization', name: 'Rukka', logo: { '@type': 'ImageObject', url: 'https://rukka.cl/rukka-logo.png' } },
    image: fm.image || 'https://rukka.cl/rukka-logo.png',
    url: `https://rukka.cl/blog/${fm.slug}`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://rukka.cl/blog/${fm.slug}` },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://rukka.cl' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://rukka.cl/blog' },
      { '@type': 'ListItem', position: 3, name: fm.title, item: `https://rukka.cl/blog/${fm.slug}` },
    ],
  }

  const faqSchema = faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  } : null

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

      <div className="min-h-screen" style={{ background: '#F8F4EE' }}>
        <Navbar />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-forest flex items-center gap-1 transition-colors"><Home className="w-3.5 h-3.5" /> Inicio</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-forest transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-gray-600 font-medium truncate max-w-xs">{fm.title}</span>
          </nav>

          <div className="flex flex-col lg:flex-row gap-10">
            {/* Artículo principal */}
            <article className="flex-1 min-w-0">
              {/* Header */}
              <div className="bg-white rounded-2xl border border-stone-200/60 shadow-sm overflow-hidden mb-6">
                <div className="relative h-56 sm:h-72 bg-stone-100">
                  <img src={coverImg} alt={fm.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${cluster.bg} ${cluster.text}`}>
                      {cluster.label}
                    </span>
                    {dateStr && (
                      <span className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Calendar className="w-3 h-3" /> Actualizado: {dateStr}
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
                    {fm.title}
                  </h1>
                </div>
              </div>

              {/* Contenido MDX */}
              <div className="bg-white rounded-2xl border border-stone-200/60 shadow-sm p-6 sm:p-8">
                <div className="prose prose-slate max-w-none
                  prose-headings:font-extrabold prose-headings:text-gray-900
                  prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3
                  prose-h3:text-base prose-h3:mt-5 prose-h3:mb-2
                  prose-p:text-gray-600 prose-p:leading-relaxed prose-p:my-3
                  prose-a:text-forest prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-gray-800
                  prose-table:text-sm prose-th:bg-forest-50 prose-th:text-forest-dark prose-th:font-bold
                  prose-td:text-gray-600
                  prose-hr:border-stone-200 prose-hr:my-8
                  prose-ul:my-3 prose-li:my-1 prose-li:text-gray-600
                  prose-ol:my-3
                ">
                  <MDXRemote source={content} />
                </div>
              </div>

              {/* Navegación */}
              <div className="mt-6">
                <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-forest transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Volver al blog
                </Link>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="lg:w-72 flex-shrink-0 space-y-5">
              {/* CTA principal */}
              <div className="bg-forest text-white rounded-2xl p-6 shadow-sm">
                <p className="font-extrabold text-lg leading-tight mb-2">¿Listo para intercambiar tu hogar?</p>
                <p className="text-white/75 text-sm mb-4 leading-relaxed">Publica tu hogar gratis en Rukka y empieza a recibir solicitudes de intercambio de todo Chile.</p>
                <Link href="/onboarding" className="flex items-center justify-center gap-2 bg-white text-forest font-bold py-2.5 px-4 rounded-xl hover:bg-forest-50 transition-colors text-sm">
                  Publicar mi hogar <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Artículos relacionados */}
              {related.length > 0 && (
                <div className="bg-white rounded-2xl border border-stone-200/60 shadow-sm p-5">
                  <h3 className="font-extrabold text-gray-900 text-sm mb-3">Artículos relacionados</h3>
                  <div className="space-y-1">
                    {related.map(p => <RelatedCard key={p.slug} post={p} />)}
                  </div>
                </div>
              )}

              {/* Link explorar hogares */}
              <div className="bg-terra-50 border border-terra/20 rounded-2xl p-5">
                <p className="font-bold text-terra-dark text-sm mb-2">Explorar hogares disponibles</p>
                <p className="text-xs text-gray-500 mb-3">Ver hogares reales de personas que quieren intercambiar.</p>
                <Link href="/homes" className="flex items-center gap-1.5 text-sm font-semibold text-terra hover:text-terra-dark transition-colors">
                  Ver hogares <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </aside>
          </div>
        </div>

        <Footer />
      </div>
    </>
  )
}
