import { useEffect, useRef } from 'react'
import { Routes, Route, useLocation, useNavigationType } from 'react-router'
import Home from './pages/Home'
import BookPage from './pages/BookPage'
import ChapterPage from './pages/ChapterPage'
import SearchPage from './pages/SearchPage'
import Header from './components/Header'
import Footer from './components/Footer'

function ScrollManager() {
  const location = useLocation()
  const navigationType = useNavigationType()
  const scrollPositions = useRef<Map<string, number>>(new Map())
  const key = `${location.pathname}${location.search}`

  useEffect(() => {
    const handleScroll = () => {
      scrollPositions.current.set(key, window.scrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      scrollPositions.current.set(key, window.scrollY)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [key])

  useEffect(() => {
    if (navigationType === 'POP') {
      const restored = scrollPositions.current.get(key) ?? 0
      window.scrollTo({ top: restored, left: 0, behavior: 'auto' })
      return
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }, [key, navigationType])

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
