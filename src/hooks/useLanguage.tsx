import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router'

type Language = 'en' | 'ml'

interface LanguageContextType {
  lang: Language
  setLang: (lang: Language) => void
  toggleLang: () => void
}

const LanguageContext = createContext<LanguageContextType | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>(() => {
    const stored = localStorage.getItem('bible-lang')
    return (stored === 'ml' ? 'ml' : 'en') as Language
  })
  const location = useLocation()
  const navigate = useNavigate()

  const updateLang = useCallback((newLang: Language) => {
    setLang(newLang)
    localStorage.setItem('bible-lang', newLang)
  }, [])

  const toggleLang = () => {
    updateLang(lang === 'en' ? 'ml' : 'en')
  }

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const requested = params.get('lang')
    if (requested === 'en' || requested === 'ml') {
      if (requested !== lang) {
        updateLang(requested)
      }
    }
  }, [location.search, lang, updateLang])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (lang === 'ml') {
      params.set('lang', 'ml')
    } else {
      params.delete('lang')
    }
    const nextSearch = params.toString()
    const nextUrl = `${location.pathname}${nextSearch ? `?${nextSearch}` : ''}${location.hash}`
    const currentUrl = `${location.pathname}${location.search}${location.hash}`
    if (nextUrl !== currentUrl) {
      navigate(nextUrl, { replace: true })
    }
  }, [lang, location.pathname, location.search, location.hash, navigate])

  return (
    <LanguageContext.Provider value={{ lang, setLang: updateLang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage(): LanguageContextType {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
