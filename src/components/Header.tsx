import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Search, BookOpen, Menu, X, Globe, BookMarked } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import { totalChapters } from '../data/bibleData'

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const { lang, setLang } = useLanguage()
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setSearchOpen(false)
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-2xl border-b border-border/60">
      <div className="h-px divider-line" />
      <div className="max-w-[1600px] 2xl:max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
            <BookOpen className="w-4.5 h-4.5 text-primary" />
          </div>
          <div className="hidden sm:block">
            <h1 className="font-display text-lg font-semibold leading-none text-foreground/90">
              BibleContext
            </h1>
            <p className="text-[10px] font-tech text-muted-foreground mt-0.5">
              Chapter Context
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="text-xs font-tech text-muted-foreground hover:text-foreground transition-colors"
          >
            Books
          </Link>
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="text-xs font-tech text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5" />
            Search
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === 'en' ? 'ml' : 'en')}
            className="flex items-center gap-1.5 text-xs font-tech text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-full border border-border hover:border-primary/40"
          >
            <Globe className="w-3.5 h-3.5" />
            {lang === 'en' ? 'English' : 'Malayalam'}
          </button>

          {/* Progress indicator */}
          <Link
            to="/"
            className="flex items-center gap-1.5 text-xs font-tech text-muted-foreground hover:text-foreground transition-colors"
          >
            <BookMarked className="w-3.5 h-3.5" />
            <ProgressBadge />
          </Link>
        </nav>

        {/* Mobile Buttons */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
          >
            <Search className="w-4.5 h-4.5 text-muted-foreground" />
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
          >
            {menuOpen ? (
              <X className="w-4.5 h-4.5 text-muted-foreground" />
            ) : (
              <Menu className="w-4.5 h-4.5 text-muted-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {searchOpen && (
        <div className="border-t border-border/60 bg-background/95 backdrop-blur-xl px-4 py-3">
          <form onSubmit={handleSearch} className="max-w-xl mx-auto flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search books, chapters, or keywords..."
              className="flex-1 bg-muted border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
              autoFocus
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      )}

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border/60 bg-background/95 backdrop-blur-xl px-4 py-4 space-y-3">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground py-2"
          >
            <BookOpen className="w-4 h-4" />
            All Books
          </Link>
          <button
            onClick={() => {
              setLang(lang === 'en' ? 'ml' : 'en')
              setMenuOpen(false)
            }}
            className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground py-2 w-full"
          >
            <Globe className="w-4 h-4" />
            {lang === 'en' ? 'Switch to Malayalam' : 'Switch to English'}
          </button>
        </div>
      )}
    </header>
  )
}

function ProgressBadge() {
  const getProgress = () => {
    const read = JSON.parse(localStorage.getItem('bible-read-chapters') || '{}')
    const count = Object.keys(read).length
    const total = totalChapters
    return { count, total, pct: Math.round((count / total) * 100) }
  }
  const { count, total, pct } = getProgress()
  return (
    <span className="text-[10px] font-tech">
      {count}/{total} ({pct}%)
    </span>
  )
}
