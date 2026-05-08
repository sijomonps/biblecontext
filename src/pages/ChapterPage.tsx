import { useParams, Link } from 'react-router'
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Globe, RotateCcw } from 'lucide-react'
import { getBookById } from '../data/bibleData'
import { useLanguage } from '../hooks/useLanguage'
import SEO from '../components/Seo'
import {
  AUTHOR_NAME,
  SITE_NAME,
  applyLanguageToPath,
  buildCanonicalUrl,
  buildChapterTitle,
  truncateText
} from '../lib/seo'

export default function ChapterPage() {
  const { bookId, chapterNum } = useParams<{ bookId: string; chapterNum: string }>()
  const { lang, toggleLang } = useLanguage()
  const book = getBookById(bookId || '')
  const chapter = parseInt(chapterNum || '1', 10)

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

  const chapterData = book.chapters.find(c => c.chapter === chapter)
  if (!chapterData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">Chapter not found.</p>
        <Link to={`/book/${book.id}`} className="text-primary text-sm mt-4 inline-block hover:underline">
          Back to {book.name}
        </Link>
      </div>
    )
  }

  const completed = JSON.parse(localStorage.getItem('bible-read-chapters') || '{}')
  const isRead = completed[`${book.id}-${chapter}`]
  const title = buildChapterTitle(book.name, chapter)
  const summaryText = lang === 'ml' ? chapterData.ml : chapterData.en
  const description = truncateText(summaryText)
  const keywords = [
    SITE_NAME,
    `${book.name} ${chapter}`,
    `${book.name} chapter summary`,
    'Bible chapter summary',
    'Bible context',
    lang === 'ml' ? book.ml_name : ''
  ]
  const chapterPath = applyLanguageToPath(`/book/${book.id}/chapter/${chapter}`, lang)
  const chapterUrl = buildCanonicalUrl(chapterPath)
  const bookUrl = buildCanonicalUrl(applyLanguageToPath(`/book/${book.id}`, lang))
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description,
      url: chapterUrl,
      inLanguage: lang === 'ml' ? 'ml-IN' : 'en-US',
      author: {
        '@type': 'Person',
        name: AUTHOR_NAME
      },
      isPartOf: {
        '@type': 'Book',
        name: book.name,
        url: bookUrl
      },
      mainEntityOfPage: chapterUrl
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: title,
      url: chapterUrl,
      inLanguage: lang === 'ml' ? 'ml-IN' : 'en-US',
      description
    }
  ]

  const toggleRead = () => {
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

  const prevChapter = chapter > 1 ? chapter - 1 : null
  const nextChapter = chapter < book.chapters.length ? chapter + 1 : null

  return (
    <article className="max-w-[1200px] 2xl:max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SEO
        title={title}
        description={description}
        keywords={keywords}
        type="article"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: book.name, path: `/book/${book.id}` },
          { name: `Chapter ${chapter}`, path: `/book/${book.id}/chapter/${chapter}` }
        ]}
        schema={schema}
        lang={lang}
      />
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap">
        <Link to="/" className="hover:text-foreground transition-colors">Books</Link>
        <span>/</span>
        <Link to={`/book/${book.id}`} className="hover:text-foreground transition-colors">
          {book.name}
        </Link>
        <span>/</span>
        <span className="text-foreground">Ch. {chapter}</span>
      </div>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <Link
            to={`/book/${book.id}`}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {book.name}
          </Link>
          <button
            onClick={toggleLang}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary hover:bg-primary/15 transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            {lang === 'en' ? 'മലയാളം' : 'English'}
          </button>
        </div>

        <div className="panel panel-grid panel-outline p-6 sm:p-8">
          <p className="text-[10px] font-tech text-muted-foreground">Chapter Focus</p>
          <div className="flex items-center gap-3 mt-2">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground/95">
              {book.name} {chapter}
            </h1>
            {isRead && <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />}
          </div>
          <p className="text-lg text-muted-foreground mt-2">
            {lang === 'ml' ? book.ml_name : book.name} — Chapter {chapterData.chapter}
          </p>
        </div>
      </div>

      {/* Context Card */}
      <div className="relative overflow-hidden panel panel-grid panel-outline p-6 sm:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(220,230,255,0.12),transparent_55%)]" />
        <div className="relative space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-6 rounded-full bg-primary/60" />
            <span className="text-[10px] font-tech text-primary/70">
              {lang === 'en' ? 'Chapter Context' : 'അദ്ധ്യായ സന്ദർഭം'}
            </span>
          </div>

          <p className="font-display text-lg sm:text-xl text-foreground/90 leading-relaxed">
            {lang === 'ml' ? chapterData.ml : chapterData.en}
          </p>

          {/* Translation toggle hint */}
          <button
            onClick={toggleLang}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mt-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {lang === 'en' ? 'View in Malayalam' : 'ഇംഗ്ലീഷിൽ കാണുക'}
          </button>
        </div>
      </div>

      {/* Mark as Read */}
      <div className="flex items-center justify-center">
        <button
          onClick={toggleRead}
          className={`inline-flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
            isRead
              ? 'bg-primary/10 text-primary border border-primary/25 hover:bg-primary/15'
              : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/15 hover:shadow-xl hover:shadow-primary/20'
          }`}
        >
          {isRead ? (
            <>
              <Check className="w-4 h-4" />
              Read
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Mark as Read
            </>
          )}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-border/60">
        {prevChapter ? (
          <Link
            to={`/book/${book.id}/chapter/${prevChapter}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-muted border border-border hover:border-primary/30 hover:text-foreground text-muted-foreground text-sm font-medium transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Ch. {prevChapter}
          </Link>
        ) : (
          <div />
        )}

        <span className="text-xs text-muted-foreground/60 font-medium">
          {book.name} {chapter} of {book.chapters.length}
        </span>

        {nextChapter ? (
          <Link
            to={`/book/${book.id}/chapter/${nextChapter}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-muted border border-border hover:border-primary/30 hover:text-foreground text-muted-foreground text-sm font-medium transition-all"
          >
            Ch. {nextChapter}
            <ArrowRight className="w-4 h-4" />
          </Link>
        ) : (
          <div />
        )}
      </div>
    </article>
  )
}
