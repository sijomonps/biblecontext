import fs from 'node:fs'
import path from 'node:path'
import { bibleBooks } from '../src/data/bibleData'

const rawSiteUrl = (process.env.SITE_URL || process.env.VITE_SITE_URL || 'https://biblecontext.vercel.app').trim()
const siteUrl = rawSiteUrl.replace(/\/+$/, '')

const urls: string[] = []

const addUrl = (suffix: string) => {
  const normalized = suffix.startsWith('/') ? suffix : `/${suffix}`
  urls.push(`${siteUrl}${normalized}`)
}

addUrl('/')
addUrl('/search')

for (const book of bibleBooks) {
  addUrl(`/book/${book.id}`)
  for (const chapter of book.chapters) {
    addUrl(`/book/${book.id}/chapter/${chapter.chapter}`)
  }
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
  .map((url) => `  <url>\n    <loc>${url}</loc>\n  </url>`)
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
