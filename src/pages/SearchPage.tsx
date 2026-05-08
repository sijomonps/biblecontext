import { useMemo, useState, useEffect, type FormEvent } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router'
import { ArrowLeft, Search, BookOpen } from 'lucide-react'
import { bibleBooks } from '../data/bibleData'
import { useLanguage } from '../hooks/useLanguage'
import SEO from '../components/Seo'
import { SITE_NAME, applyLanguageToPath, buildCanonicalUrl, buildSearchTitle, truncateText } from '../lib/seo'

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [searchInput, setSearchInput] = useState(query)
  const navigate = useNavigate()
  const { lang } = useLanguage()

  useEffect(() => {
    setSearchInput(query)
  }, [query])

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`)
    }
  }

  const results = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    const matches: Array<{ book: typeof bibleBooks[0]; chapter: typeof bibleBooks[0]['chapters'][0] }> = []

    for (const book of bibleBooks) {
      for (const chapter of book.chapters) {
        const enText = chapter.en.toLowerCase()
        const mlText = chapter.ml.toLowerCase()
        const bookName = book.name.toLowerCase()
        const bookMlName = book.ml_name.toLowerCase()

        if (
          enText.includes(q) ||
          mlText.includes(q) ||
          bookName.includes(q) ||
          bookMlName.includes(q) ||
          `${book.name} ${chapter.chapter}`.toLowerCase().includes(q)
        ) {
          matches.push({ book, chapter })
        }
      }
    }
    return matches
  }, [query])

  const title = buildSearchTitle(query || undefined)
    const description = query
      ? truncateText(
          lang === 'ml'
            ? `"${query}" എന്നതിനുള്ള തിരയൽ ഫലങ്ങൾ ബൈബിൾ അദ്ധ്യായ സംഗ്രഹങ്ങളിൽ നിന്ന്.`
            : `Search results for "${query}" across Bible chapter summaries.`
        )
      : truncateText(
          lang === 'ml'
            ? 'പുസ്തകം, അദ്ധ്യായം, അല്ലെങ്കിൽ കീവേഡ് ഉപയോഗിച്ച് ബൈബിൾ അദ്ധ്യായ സംഗ്രഹങ്ങൾ തിരയുക.'
            : 'Search Bible chapter summaries by book, chapter, or keyword.'
        )
  const keywords = [
    SITE_NAME,
    'Bible search',
    'Bible chapter search',
    'Bible chapter summaries',
    query
  ]
  const searchPath = applyLanguageToPath(`/search${query ? `?q=${encodeURIComponent(query)}` : ''}`, lang)
  const searchUrl = buildCanonicalUrl(searchPath)
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': query ? 'SearchResultsPage' : 'WebPage',
      name: title,
      url: searchUrl,
      description,
      inLanguage: lang === 'ml' ? 'ml-IN' : 'en-US'
    }
  ]

  return (
    <article className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SEO
        title={title}
        description={description}
        keywords={keywords}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Search', path: '/search' }
        ]}
        schema={schema}
        lang={lang}
      />
      {/* Header */}
      <div className="space-y-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          All Books
        </Link>
        <div className="panel panel-grid panel-outline p-6 sm:p-8 space-y-4">
          <div>
            <p className="text-[10px] font-tech text-muted-foreground">Search Console</p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground/95 mt-2">
              Search Results
            </h1>
            <p className="text-muted-foreground mt-2">
              {query ? (
                <>
                  <span className="text-foreground">"{query}"</span> — {results.length} result{results.length !== 1 ? 's' : ''}
                </>
              ) : (
                'Enter a search term to find chapters.'
              )}
            </p>
          </div>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-3.5" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by book, chapter, or keyword"
                className="w-full bg-muted/60 border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Results */}
      {query && (
        <div className="space-y-3">
          {results.length === 0 ? (
            <div className="text-center py-20">
              <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">No results found.</p>
              <p className="text-sm text-muted-foreground/60 mt-1">
                Try a different keyword or chapter name.
              </p>
            </div>
          ) : (
            results.map(({ book, chapter }) => (
              <Link
                key={`${book.id}-${chapter.chapter}`}
                to={`/book/${book.id}/chapter/${chapter.chapter}`}
                className="group flex items-start gap-4 p-4 rounded-xl bg-card/80 border border-border/60 hover:border-primary/30 transition-all duration-200 hover:shadow-md panel-outline"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-sm font-semibold text-primary">{chapter.chapter}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-sm font-semibold text-foreground/90">
                      {book.name} {chapter.chapter}
                    </h3>
                    <span className="text-xs text-muted-foreground/60">
                      ({lang === 'ml' ? book.ml_name : book.name})
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2 leading-snug">
                    {lang === 'ml' ? chapter.ml : chapter.en}
                  </p>
                </div>
                <BookOpen className="w-4 h-4 text-muted-foreground/40 shrink-0 mt-1 group-hover:text-primary/60 transition-colors" />
              </Link>
            ))
          )}
        </div>
      )}
    </article>
  )
}
