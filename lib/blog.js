import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const BLOG_DIR = path.join(process.cwd(), 'content/blog')

export function getAllPosts() {
  if (!fs.existsSync(BLOG_DIR)) return []
  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.mdx'))
  const posts = files.map(file => {
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8')
    const { data } = matter(raw)
    return { ...data, slug: data.slug || file.replace('.mdx', '') }
  })
  return posts.sort((a, b) => new Date(b.date) - new Date(a.date))
}

export function getPostBySlug(slug) {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(raw)
  return { frontmatter: { ...data, slug }, content }
}

export function extractFAQs(content) {
  const faqs = []
  const lines = content.split('\n')
  let inFaq = false
  let currentQ = null
  let currentA = []

  for (const line of lines) {
    const lc = line.toLowerCase()
    if (lc.includes('## faq') || lc.includes('## preguntas') || lc.includes('## preguntas frecuentes')) {
      inFaq = true
      continue
    }
    if (inFaq && line.startsWith('## ') && !lc.includes('faq') && !lc.includes('preguntas')) {
      inFaq = false
    }
    if (inFaq && line.startsWith('### ')) {
      if (currentQ && currentA.length) {
        faqs.push({ q: currentQ, a: currentA.join(' ').replace(/\s+/g, ' ').trim() })
      }
      currentQ = line.replace('### ', '').trim()
      currentA = []
    } else if (inFaq && currentQ && line.trim() && !line.startsWith('#')) {
      currentA.push(line.trim())
    }
  }
  if (currentQ && currentA.length) {
    faqs.push({ q: currentQ, a: currentA.join(' ').replace(/\s+/g, ' ').trim() })
  }
  return faqs
}
