import { useEffect, useLayoutEffect, useRef } from 'react'
import { Routes, Route, useLocation, useNavigationType } from 'react-router'
import Home from './pages/Home'
import BookPage from './pages/BookPage'
import ChapterPage from './pages/ChapterPage'
import SearchPage from './pages/SearchPage'
import Header from './components/Header'
import Footer from './components/Footer'
import { useLanguage } from './hooks/useLanguage'

function ScrollManager() {
  const location = useLocation()
  const navigationType = useNavigationType()
  const positions = useRef<Map<string, number>>(new Map())
  const key = location.key
  const prevKeyRef = useRef(key)

  const forceScroll = (top: number) => {
    window.scrollTo({ top, left: 0, behavior: 'auto' })
    if (document.documentElement) {
      document.documentElement.scrollTop = top
    }
    if (document.body) {
      document.body.scrollTop = top
    }
  }

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  const savePosition = (targetKey: string) => {
    const y = window.scrollY
    positions.current.set(targetKey, y)
    sessionStorage.setItem(`scroll:${targetKey}`, String(y))
  }

  useEffect(() => {
    const handleScroll = () => savePosition(key)

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      savePosition(key)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [key])

  useLayoutEffect(() => {
    const prevKey = prevKeyRef.current
    if (prevKey !== key) {
      savePosition(prevKey)
      prevKeyRef.current = key
    }
  }, [key])

  useLayoutEffect(() => {
    const stored = sessionStorage.getItem(`scroll:${key}`)
    const restored = stored ? Number(stored) : positions.current.get(key) ?? 0
    const target = navigationType === 'POP' ? restored : 0

    forceScroll(target)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => forceScroll(target))
    })
  }, [key, navigationType])

  return null
}

function LanguageQuerySync() {
  const location = useLocation()
  const { lang, setLang } = useLanguage()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const requested = params.get('lang')
    if (requested === 'en' || requested === 'ml') {
      if (requested !== lang) {
        setLang(requested)
      }
    }
  }, [location.search, lang, setLang])

  return null
}

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground font-body relative overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]" />
        <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-white/5 blur-[160px]" />
      </div>
      <ScrollManager />
      <LanguageQuerySync />
      <Header />
      <main className="pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/book/:bookId" element={<BookPage />} />
          <Route path="/book/:bookId/chapter/:chapterNum" element={<ChapterPage />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
