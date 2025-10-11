'use client'

import { useState, useEffect } from 'react'
import { Github, Linkedin, Mail } from 'lucide-react'
import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import About from '@/components/About'
import FeaturedProjects from '@/components/FeaturedProjects'
import { useTranslation } from '@/hooks/useTranslation'
import { apiClient } from '@/lib/api'

export default function Home() {
  const { t } = useTranslation()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await apiClient.getProjects({ highlight: true, limit: 6 })
        if (response.success && response.data) {
          setProjects(response.data.projects)
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  return (
    <div className="bg-white">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <Hero />

      {/* About Section */}
      <About />

      {/* Featured Projects */}
      {!loading && <FeaturedProjects projects={projects} />}

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