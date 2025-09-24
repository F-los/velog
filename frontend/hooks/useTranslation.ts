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

  const t = (key: TranslationKey): string => {
    // Return the key if not mounted yet to prevent hydration mismatch
    if (!mounted) {
      return key
    }

    const translation = translations[language]
    if (!translation) {
      return key
    }

    const keys = key.split('.') as (keyof typeof translation)[]
    let value: any = translation

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k]
      } else {
        return key
      }
    }

    return typeof value === 'string' ? value : key
  }

  return {
    language,
    setLanguage,
    t,
    mounted
  }
}