'use client'

import { Github, Linkedin, Mail } from 'lucide-react'
import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import About from '@/components/About'
import { useTranslation } from '@/hooks/useTranslation'

export default function Home() {
  const { t } = useTranslation()

  return (
    <div className="bg-white">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <Hero />

      {/* About Section */}
      <About />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex justify-center space-x-6 mb-4">
            <a href="https://github.com/F-los" className="hover:text-purple-400 transition-colors">
              <Github size={24} />
            </a>
            <a href="https://linkedin.com/in/your-linkedin" className="hover:text-purple-400 transition-colors">
              <Linkedin size={24} />
            </a>
            <a href="mailto:xoghl1124@example.com" className="hover:text-purple-400 transition-colors">
              <Mail size={24} />
            </a>
          </div>
          <p className="text-gray-400">
            {t('footer.copyright')}
          </p>
        </div>
      </footer>
    </div>
  )
}