import fs from 'node:fs'
import path from 'node:path'
import { bibleBooks } from '../src/data/bibleData'

const rawSiteUrl = (process.env.SITE_URL || process.env.VITE_SITE_URL || 'https://biblecontext.vercel.app').trim()
const siteUrl = rawSiteUrl.replace(/\/+$/, '')

type SitemapEntry = {
  loc: string
  changefreq?: 'daily' | 'weekly' | 'monthly' | 'yearly'
  priority?: number
}

const urls: SitemapEntry[] = []
const lastmod = new Date().toISOString().split('T')[0]

const addUrl = (suffix: string, entry?: Omit<SitemapEntry, 'loc'>) => {
  const normalized = suffix.startsWith('/') ? suffix : `/${suffix}`
  urls.push({
    loc: `${siteUrl}${normalized}`,
    ...entry
  })
}

addUrl('/', { changefreq: 'weekly', priority: 1 })
addUrl('/search', { changefreq: 'weekly', priority: 0.7 })

for (const book of bibleBooks) {
  addUrl(`/book/${book.id}`, { changefreq: 'monthly', priority: 0.8 })
  for (const chapter of book.chapters) {
    addUrl(`/book/${book.id}/chapter/${chapter.chapter}`, { changefreq: 'monthly', priority: 0.6 })
  }
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
  .map((entry) => {
    const changefreq = entry.changefreq ? `\n    <changefreq>${entry.changefreq}</changefreq>` : ''
    const priority = entry.priority ? `\n    <priority>${entry.priority.toFixed(1)}</priority>` : ''
    return `  <url>\n    <loc>${entry.loc}</loc>\n    <lastmod>${lastmod}</lastmod>${changefreq}${priority}\n  </url>`
  })
  .join('\n')}\n</urlset>\n`

const projectRoot = process.cwd()
const publicDir = path.join(projectRoot, 'public')
const distDir = path.join(projectRoot, 'dist')

fs.mkdirSync(publicDir, { recursive: true })
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml, 'utf8')

if (fs.existsSync(distDir)) {
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), xml, 'utf8')
}

console.log(`Sitemap written with ${urls.length} URLs.`)
