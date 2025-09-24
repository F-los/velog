'use client'

import { useState, useEffect } from 'react'
import { translations, Language, TranslationKey } from '@/lib/translations'

export function useTranslation() {
  const [language, setLanguageState] = useState<Language>('en')
  const [mounted, setMounted] = useState(false)
  const [forceUpdate, setForceUpdate] = useState(0)

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
    // 강제 리렌더링을 위한 카운터 증가
    setForceUpdate(prev => prev + 1)
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
    mounted,
    forceUpdate // 컴포넌트가 이 값을 의존하여 리렌더링되도록 함
  }
}