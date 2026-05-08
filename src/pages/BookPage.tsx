import { useParams, Link } from 'react-router'
import { ArrowLeft, Check, BookOpen } from 'lucide-react'
import { getBookById } from '../data/bibleData'
import { useLanguage } from '../hooks/useLanguage'
import BookProgressRing from '../components/BookProgressRing'
import SEO from '../components/Seo'
import { SITE_NAME, applyLanguageToPath, buildBookTitle, buildCanonicalUrl, truncateText } from '../lib/seo'

export default function BookPage() {
  const { bookId } = useParams<{ bookId: string }>()
  const { lang } = useLanguage()
  const book = getBookById(bookId || '')

  if (!book) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">Book not found.</p>
        <Link to="/" className="text-primary text-sm mt-4 inline-block hover:underline">
          Back to all books
        </Link>
      </div>
    )
  }

  const completed = JSON.parse(localStorage.getItem('bible-read-chapters') || '{}')
  const readCount = book.chapters.filter(c => completed[`${book.id}-${c.chapter}`]).length
  const progress = Math.round((readCount / book.chapters.length) * 100)
  const title = buildBookTitle(book.name)
  const description =
    lang === 'en'
      ? truncateText(`Chapter summaries and context for ${book.name}. Read each chapter with clarity before you begin.`)
      : truncateText(`${book.ml_name} പുസ്തകത്തിലെ അദ്ധ്യായങ്ങൾക്കായി ലളിതമായ സന്ദർഭ സംഗ്രഹങ്ങൾ.`)
  const keywords = [
    SITE_NAME,
    book.name,
    `${book.name} chapter summaries`,
    `${book.name} context`,
    'Bible chapter summaries',
    'Bible context',
    lang === 'ml' ? book.ml_name : ''
  ]
  const bookPath = applyLanguageToPath(`/book/${book.id}`, lang)
  const bookUrl = buildCanonicalUrl(bookPath)
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'Book',
      name: book.name,
      url: bookUrl,
      inLanguage: lang === 'ml' ? 'ml-IN' : 'en-US',
      isPartOf: {
        '@type': 'CreativeWork',
        name: 'Holy Bible'
      },
      description
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: title,
      url: bookUrl,
      inLanguage: lang === 'ml' ? 'ml-IN' : 'en-US',
      description
    }
  ]

  const toggleChapter = (chapter: number) => {
    const key = `${book.id}-${chapter}`
    const read = JSON.parse(localStorage.getItem('bible-read-chapters') || '{}')
    if (read[key]) {
      delete read[key]
    } else {
      read[key] = true
    }
    localStorage.setItem('bible-read-chapters', JSON.stringify(read))
    window.dispatchEvent(new Event('bible-progress-updated'))
    window.location.reload()
  }

  return (
    <article className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SEO
        title={title}
        description={description}
        keywords={keywords}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: book.name, path: `/book/${book.id}` }
        ]}
        schema={schema}
        lang={lang}
      />
      {/* Back button & Header */}
      <div className="space-y-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          All Books
        </Link>

        <div className="panel panel-grid panel-outline p-6 sm:p-8 flex items-start gap-5">
          <div className="hidden sm:block shrink-0 mt-1">
            <BookProgressRing progress={progress} size={56} strokeWidth={4} seed={book.id} />
          </div>
          <div>
            <p className="text-[10px] font-tech text-muted-foreground">Book Overview</p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground/95 mt-2">
              {book.name}
            </h1>
            <p className="text-lg text-muted-foreground mt-1">
              {lang === 'ml' ? book.ml_name : book.name}
            </p>
            <div className="flex items-center gap-4 mt-3">
              <span className="text-sm text-muted-foreground">
                {book.chapters.length} chapters
              </span>
              {readCount > 0 && (
                <span className="text-sm text-primary">
                  {readCount}/{book.chapters.length} read ({progress}%)
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chapters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {book.chapters.map((chapter) => {
          const isRead = completed[`${book.id}-${chapter.chapter}`]
          return (
            <Link
              key={chapter.chapter}
              to={`/book/${book.id}/chapter/${chapter.chapter}`}
              className={`group flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 panel-outline ${
                isRead
                  ? 'bg-primary/5 border-primary/20 hover:border-primary/40 hover:shadow-md hover:shadow-primary/10'
                  : 'bg-card/80 border-border/60 hover:border-primary/30 hover:shadow-md'
              }`}
            >
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  toggleChapter(chapter.chapter)
                }}
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                  isRead
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-primary/20 hover:text-primary'
                }`}
              >
                {isRead ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span className="text-xs font-semibold">{chapter.chapter}</span>
                )}
              </button>
              <div className="flex-1 min-w-0">
                <p className="font-display text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors line-clamp-2 leading-snug">
                  {lang === 'ml' ? chapter.ml : chapter.en}
                </p>
              </div>
              <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <BookOpen className="w-4 h-4 text-muted-foreground" />
              </div>
            </Link>
          )
        })}
      </div>
    </article>
  )
}
