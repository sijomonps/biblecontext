import { createContext, useContext, useState, type ReactNode } from 'react'

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

  const updateLang = (newLang: Language) => {
    setLang(newLang)
    localStorage.setItem('bible-lang', newLang)
  }

  const toggleLang = () => {
    updateLang(lang === 'en' ? 'ml' : 'en')
  }

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
