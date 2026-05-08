import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router'
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_IMAGE,
  DEFAULT_KEYWORDS,
  SITE_NAME,
  TAGLINE,
  SITE_URL,
  buildCanonicalUrl,
  dedupeKeywords,
  languageToLocale,
  toAbsoluteUrl
} from '../lib/seo'

type BreadcrumbItem = {
  name: string
  path?: string
}

type SeoProps = {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  type?: 'website' | 'article'
  canonicalPath?: string
  breadcrumbs?: BreadcrumbItem[]
  schema?: Array<Record<string, unknown>>
  lang?: 'en' | 'ml'
}

const buildBreadcrumbSchema = (items: BreadcrumbItem[]) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.path ? buildCanonicalUrl(item.path) : SITE_URL
    }))
  }
}

const buildLangUrl = (canonicalUrl: string, lang?: 'en' | 'ml' | 'x-default') => {
  const url = new URL(canonicalUrl)
  if (!lang || lang === 'x-default') {
    url.searchParams.delete('lang')
    return url.toString()
  }
  url.searchParams.set('lang', lang)
  return url.toString()
}

export default function SEO({
  title,
  description,
  keywords,
  image,
  type = 'website',
  canonicalPath,
  breadcrumbs,
  schema,
  lang = 'en'
}: SeoProps) {
  const location = useLocation()
  const resolvedPath = canonicalPath || `${location.pathname}${location.search}`
  const canonicalUrl = buildCanonicalUrl(resolvedPath)
  const metaTitle = title || `${SITE_NAME} - ${TAGLINE}`
  const metaDescription = description || DEFAULT_DESCRIPTION
  const metaKeywords = dedupeKeywords([...(keywords || []), ...DEFAULT_KEYWORDS]).join(', ')
  const ogImage = toAbsoluteUrl(image || DEFAULT_IMAGE)
  const locale = languageToLocale(lang)
  const schemas: Array<Record<string, unknown>> = []

  if (breadcrumbs && breadcrumbs.length > 0) {
    schemas.push(buildBreadcrumbSchema(breadcrumbs))
  }

  if (schema && schema.length > 0) {
    schemas.push(...schema)
  }

  return (
    <Helmet htmlAttributes={{ lang }}>
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      <meta name="author" content="Sijomon P S" />
      <meta name="robots" content="index,follow" />
      <link rel="canonical" href={canonicalUrl} />

      <link rel="alternate" hrefLang="en" href={buildLangUrl(canonicalUrl, 'en')} />
      <link rel="alternate" hrefLang="ml" href={buildLangUrl(canonicalUrl, 'ml')} />
      <link rel="alternate" hrefLang="x-default" href={buildLangUrl(canonicalUrl, 'x-default')} />

      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content={locale} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImage} />

      {schemas.map((item, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(item)}
        </script>
      ))}
    </Helmet>
  )
}
