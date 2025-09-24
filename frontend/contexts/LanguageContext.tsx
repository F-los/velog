'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ko';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.skills': 'Skills',
    'nav.experience': 'Experience',
    'nav.projects': 'Projects',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',

    // Hero Section
    'hero.greeting': 'Hello! 👋',
    'hero.intro': 'I am',
    'hero.name': 'Taehoe Kim',
    'hero.description': 'A developer who loves building <strong>scalable and reliable backend systems</strong>',
    'hero.cta.projects': 'View Projects',
    'hero.cta.contact': 'Contact Me',
    'hero.scroll': 'Scroll down',

    // About Section
    'about.title': 'About Me',
    'about.description': 'A developer who loves building scalable and reliable backend systems.',
    'about.greeting': 'Hello! 👋',
    'about.intro1': 'I am a backend developer specializing in <strong>Java Spring Boot</strong> with a keen interest in designing and implementing <strong>microservice architectures</strong> in cloud environments.',
    'about.intro2': 'I enjoy learning new technologies and applying them to real-world projects, constantly striving to create <strong>scalable and reliable systems</strong>.',
    'about.intro3': 'Currently, I am particularly interested in <strong>handling high-volume traffic</strong> and <strong>performance optimization</strong>, working on various projects in these areas.',
    'about.years': 'Years Experience',
    'about.projects': 'Completed Projects',
    'about.highlight1.title': 'Backend Expertise',
    'about.highlight1.desc': 'Backend system development with Java Spring Boot as the main technology',
    'about.highlight2.title': 'Cloud Architecture',
    'about.highlight2.desc': 'Design and implementation of AWS-based microservice architecture',
    'about.highlight3.title': 'Performance Optimization',
    'about.highlight3.desc': 'Specializing in high-volume traffic handling and system performance improvement',
    'about.highlight4.title': 'New Technologies',
    'about.highlight4.desc': 'Developer who enjoys learning and applying the latest technologies',
    'about.philosophy.title': 'Development Philosophy',
    'about.philosophy.quote': '"Code is written for humans to read, and only incidentally for machines to execute"',
    'about.philosophy.desc': 'I strive to create better software through readable code, test-driven development, and continuous learning.',

    // Footer
    'footer.copyright': '© 2024 Taehoe Kim. Made with ❤️ and Next.js',
  },
  ko: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.skills': 'Skills',
    'nav.experience': 'Experience',
    'nav.projects': 'Projects',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',

    // Hero Section
    'hero.greeting': '안녕하세요! 👋',
    'hero.intro': '저는',
    'hero.name': '김태회',
    'hero.description': '<strong>확장 가능하고 안정적인 백엔드 시스템</strong>을 만드는 것을 좋아하는 개발자입니다',
    'hero.cta.projects': '프로젝트 보기',
    'hero.cta.contact': '연락하기',
    'hero.scroll': '스크롤하세요',

    // About Section
    'about.title': 'About Me',
    'about.description': '확장 가능하고 안정적인 백엔드 시스템을 만드는 것을 좋아하는 개발자입니다.',
    'about.greeting': '안녕하세요! 👋',
    'about.intro1': '저는 <strong>Java Spring Boot</strong>를 주력으로 하여 클라우드 환경에서의 <strong>마이크로서비스 아키텍처</strong> 설계와 구현에 관심이 많은 백엔드 개발자입니다.',
    'about.intro2': '새로운 기술을 학습하고 실무에 적용하는 것을 즐기며, <strong>확장 가능하고 안정적인 시스템</strong>을 만들기 위해 끊임없이 노력하고 있습니다.',
    'about.intro3': '현재는 <strong>대용량 트래픽 처리</strong>와 <strong>성능 최적화</strong>에 특히 관심을 가지고 다양한 프로젝트를 진행하고 있습니다.',
    'about.years': '년 경력',
    'about.projects': '완료 프로젝트',
    'about.highlight1.title': '백엔드 전문성',
    'about.highlight1.desc': 'Java Spring Boot를 주력으로 하는 백엔드 시스템 개발',
    'about.highlight2.title': '클라우드 아키텍처',
    'about.highlight2.desc': 'AWS 기반 마이크로서비스 아키텍처 설계 및 구현',
    'about.highlight3.title': '성능 최적화',
    'about.highlight3.desc': '대용량 트래픽 처리와 시스템 성능 개선 전문',
    'about.highlight4.title': '새로운 기술',
    'about.highlight4.desc': '최신 기술 학습과 실무 적용을 즐기는 개발자',
    'about.philosophy.title': '개발 철학',
    'about.philosophy.quote': '"코드는 사람이 읽기 위한 것이며, 기계는 그것을 실행할 뿐이다"',
    'about.philosophy.desc': '가독성 있는 코드, 테스트 주도 개발, 지속적인 학습을 통해 더 나은 소프트웨어를 만들어가고 있습니다.',

    // Footer
    'footer.copyright': '© 2024 김태회. Made with ❤️ and Next.js',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('language') as Language;
    if (saved && (saved === 'en' || saved === 'ko')) {
      setLanguage(saved);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
    }
  };

  const t = (key: string): string => {
    // Use current language setting for better multilingual experience
    const currentLang = language;
    const translation = translations[currentLang];

    if (!translation) {
      return key;
    }

    const keys = key.split('.');
    let value: any = translation;

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key;
      }
    }

    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};