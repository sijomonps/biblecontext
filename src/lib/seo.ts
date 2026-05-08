const rawSiteUrl = (import.meta.env.VITE_SITE_URL || 'https://biblecontext.vercel.app').trim()

export const SITE_NAME = 'BibleContext'
export const TAGLINE = 'Understand Before You Read'
export const AUTHOR_NAME = 'Sijomon P S'
export const SITE_URL = rawSiteUrl.replace(/\/+$/, '')

export const DEFAULT_DESCRIPTION =
  'Understand Before You Read. One-line Bible chapter summaries in English and Malayalam for beginners.'

export const DEFAULT_TITLE = `${SITE_NAME} - ${TAGLINE}`

export const DEFAULT_KEYWORDS = [
  'BibleContext',
  'Bible chapter summaries',
  'Bible context',
  'Understand Before You Read',
  'Bible study',
  'English Malayalam Bible',
  'Beginner Bible'
]

export const DEFAULT_IMAGE = '/og-image.svg'

export const toAbsoluteUrl = (path: string): string => {
  if (!path) return SITE_URL
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${SITE_URL}${normalized}`
}

export const buildCanonicalUrl = (path: string): string => {
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${SITE_URL}${normalized}`
}

export const applyLanguageToPath = (path: string, lang: 'en' | 'ml'): string => {
  const [pathname, rawSearch = ''] = path.split('?')
  const params = new URLSearchParams(rawSearch)
  if (lang === 'ml') {
    params.set('lang', 'ml')
  } else {
    params.delete('lang')
  }
  const nextSearch = params.toString()
  return nextSearch ? `${pathname}?${nextSearch}` : pathname
}

export const dedupeKeywords = (keywords: string[]): string[] => {
  const cleaned = keywords.map((keyword) => keyword.trim()).filter(Boolean)
  return Array.from(new Set(cleaned))
}

export const languageToLocale = (lang: 'en' | 'ml'): string => (lang === 'ml' ? 'ml_IN' : 'en_US')

export const truncateText = (value: string, maxLength = 160): string => {
  if (!value) return ''
  if (value.length <= maxLength) return value
  return `${value.slice(0, maxLength - 3).trim()}...`
}

export const buildBookTitle = (bookName: string): string =>
  `${bookName} Chapter Summaries | ${SITE_NAME}`

export const buildChapterTitle = (bookName: string, chapter: number): string =>
  `${bookName} ${chapter} Summary | ${SITE_NAME}`

export const buildSearchTitle = (query?: string): string =>
  query ? `Search "${query}" | ${SITE_NAME}` : `Search | ${SITE_NAME}`
