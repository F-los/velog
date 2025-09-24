'use client'

import { useState, useEffect } from 'react'
import { translations, Language, TranslationKey } from '@/lib/translations'

export function useTranslation() {
  const [language, setLanguageState] = useState<Language>('en')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Check for saved language preference
    const saved = localStorage.getItem('language') as Language
    if (saved && (saved === 'en' || saved === 'ko')) {
      setLanguageState(saved)
    }
    setMounted(true)
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('language', lang)
  }

  const t = (key: string): string => {
    const translation = translations[language]

    if (!translation) {
      return key
    }

    // 평면적 구조에서 직접 키로 접근
    const value = translation[key as keyof typeof translation]
    return typeof value === 'string' ? value : key
  }

  return {
    language,
    setLanguage,
    t,
    mounted
  }
}