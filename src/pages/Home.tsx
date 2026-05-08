import { Link } from 'react-router'
import { BookOpen, ChevronRight, Sparkles } from 'lucide-react'
import { oldTestamentBooks, newTestamentBooks, totalBooks, totalChapters, type Book } from '../data/bibleData'
import { useLanguage } from '../hooks/useLanguage'
import BookProgressRing from '../components/BookProgressRing'

function BookCard({ book, index }: { book: Book; index: number }) {
  const { lang } = useLanguage()
  const completed = JSON.parse(localStorage.getItem('bible-read-chapters') || '{}')
  const bookChapters = book.chapters.length
  const readChapters = book.chapters.filter(c => completed[`${book.id}-${c.chapter}`]).length
  const progress = Math.round((readChapters / bookChapters) * 100)

  return (
    <Link
      to={`/book/${book.id}`}
      className="group relative flex items-center gap-4 p-4 rounded-xl bg-card/80 border border-border/60 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 panel-outline"
      style={{ animationDelay: `${index * 15}ms` }}
    >
      {/* Progress ring */}
      <BookProgressRing progress={progress} size={44} strokeWidth={3} seed={book.id} />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-display text-base font-semibold text-foreground/90 group-hover:text-primary transition-colors truncate">
            {book.name}
          </h3>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
        </div>
        <p className="text-sm text-muted-foreground mt-0.5 truncate">
          {lang === 'ml' ? book.ml_name : book.name}
        </p>
        <p className="text-xs text-muted-foreground/60 mt-1">
          {bookChapters} chapters
          {readChapters > 0 && (
            <span className="ml-2 text-primary/70">
              {readChapters}/{bookChapters} read
            </span>
          )}
        </p>
      </div>
    </Link>
  )
}

function TestamentSection({ title, subtitle, books }: { title: string; subtitle: string; books: Book[] }) {
  return (
    <section className="space-y-5">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-1 h-8 rounded-full bg-primary/60" />
        <div>
          <h2 className="font-display text-2xl font-semibold text-foreground/90">{title}</h2>
          <p className="text-[10px] font-tech text-muted-foreground mt-1">{subtitle}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {books.map((book, i) => (
          <BookCard key={book.id} book={book} index={i} />
        ))}
      </div>
    </section>
  )
}

export default function Home() {
  const { lang, toggleLang } = useLanguage()
  const otChapters = oldTestamentBooks.reduce((s, b) => s + b.chapters.length, 0)
  const ntChapters = newTestamentBooks.reduce((s, b) => s + b.chapters.length, 0)

  return (
    <div className="max-w-[1600px] 2xl:max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Hero */}
      <section className="relative overflow-hidden panel panel-grid panel-outline p-8 sm:p-12 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(210,220,255,0.12),transparent_55%)]" />
        <div className="relative space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-tech text-primary/90">
              {lang === 'en'
                ? `${totalBooks} Books • ${totalChapters} Chapters`
                : `${totalBooks} പുസ്തകങ്ങൾ • ${totalChapters} അദ്ധ്യായങ്ങൾ`}
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground/95 leading-tight">
            {lang === 'en' ? (
              <>Read the Bible With <span className="text-primary">Clarity</span></>
            ) : (
              <>ബൈബിൾ വായിക്കുക <span className="text-primary">വ്യക്തതയോടെ</span></>
            )}
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {lang === 'en'
              ? 'Simple one-line Bible chapter summaries in English and Malayalam to help beginners read with clarity and understanding.'
              : 'തുടക്കക്കാരെ വ്യക്തതയോടെയും മനസ്സിലാക്കലോടെയും വായിക്കാൻ സഹായിക്കാൻ ഇംഗ്ലീഷിലും മലയാളത്തിലും ലളിതമായ ഒരു വരി ബൈബിൾ അദ്ധ്യായ സംഗ്രഹങ്ങൾ.'}
          </p>
          <p className="text-[11px] font-tech text-muted-foreground/80">
            {lang === 'en' ? 'Made by Sijomon P S' : 'സൃഷ്ടിച്ചത് Sijomon P S'}
          </p>

          <div className="flex items-center justify-center gap-6 sm:gap-10 pt-4">
            <div className="text-center">
              <p className="font-display text-3xl font-bold text-foreground/90">{totalBooks}</p>
              <p className="text-[10px] font-tech text-muted-foreground mt-1">Books</p>
            </div>
            <div className="w-px h-10 bg-border/60" />
            <div className="text-center">
              <p className="font-display text-3xl font-bold text-foreground/90">{totalChapters}</p>
              <p className="text-[10px] font-tech text-muted-foreground mt-1">Chapters</p>
            </div>
            <div className="w-px h-10 bg-border/60" />
            <div className="text-center">
              <p className="font-display text-3xl font-bold text-foreground/90">2</p>
              <p className="text-[10px] font-tech text-muted-foreground mt-1">Languages</p>
            </div>
          </div>

          <button
            onClick={toggleLang}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/25 text-sm font-medium text-primary hover:bg-primary/15 transition-colors mt-2"
          >
            <BookOpen className="w-4 h-4" />
            {lang === 'en' ? 'മലയാളത്തിൽ കാണുക' : 'View in English'}
          </button>
        </div>
      </section>

      <div className="text-center text-sm text-muted-foreground/80 max-w-2xl mx-auto -mt-6">
        <p className="font-display text-base text-foreground/85">
          {lang === 'en'
            ? '“Your word is a lamp to my feet and a light to my path.”'
            : '“നിന്റെ വചനം എന്റെ കാൽകളുടെ ദീപവും എന്റെ പാതയുടെ വെളിച്ചവും ആണ്.”'}
        </p>
        <p className="text-[11px] font-tech text-muted-foreground/80 mt-2">
          {lang === 'en' ? '— Psalm 119:105' : '— സങ്കീർത്തനം 119:105'}
        </p>
      </div>

      {/* Old Testament */}
      <TestamentSection
        title={lang === 'en' ? 'Old Testament' : 'പഴയ നിയമം'}
        subtitle={`${oldTestamentBooks.length} books, ${otChapters} chapters`}
        books={oldTestamentBooks}
      />

      {/* New Testament */}
      <TestamentSection
        title={lang === 'en' ? 'New Testament' : 'പുതിയ നിയമം'}
        subtitle={`${newTestamentBooks.length} books, ${ntChapters} chapters`}
        books={newTestamentBooks}
      />
    </div>
  )
}
