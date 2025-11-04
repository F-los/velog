'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { List, ChevronRight } from 'lucide-react'

interface Heading {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  content: string
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    // Extract headings from markdown content
    const headingRegex = /^(#{1,3})\s+(.+)$/gm
    const matches = Array.from(content.matchAll(headingRegex))

    const extractedHeadings: Heading[] = matches.map((match, index) => {
      const level = match[1].length // Number of # characters
      const text = match[2].trim()
      const id = `heading-${index}-${text.toLowerCase().replace(/[^a-z0-9가-힣]+/g, '-')}`

      return { id, text, level }
    })

    setHeadings(extractedHeadings)

    // Set up intersection observer for active heading tracking
    if (extractedHeadings.length > 0) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveId(entry.target.id)
            }
          })
        },
        {
          rootMargin: '-80px 0px -80% 0px',
          threshold: 0
        }
      )

      // Observe all heading elements after a short delay to ensure they're rendered
      setTimeout(() => {
        extractedHeadings.forEach((heading) => {
          const element = document.getElementById(heading.id)
          if (element) {
            observer.observe(element)
          }
        })
      }, 500)

      return () => observer.disconnect()
    }
  }, [content])

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - 100
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  if (headings.length === 0) {
    return null
  }

  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="hidden xl:block sticky top-24 w-64 h-fit"
    >
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 overflow-hidden">
        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200">
          <List size={20} className="text-purple-600" />
          <h3 className="font-bold text-gray-900">목차</h3>
        </div>

        <nav className="space-y-1">
          {headings.map((heading, index) => {
            const isActive = activeId === heading.id
            const indent = (heading.level - 1) * 12

            return (
              <motion.button
                key={heading.id}
                onClick={() => scrollToHeading(heading.id)}
                className={`
                  w-full text-left py-2 px-3 rounded-lg transition-all text-sm
                  flex items-start gap-2 group relative
                  ${isActive
                    ? 'bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 font-semibold'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-purple-600'
                  }
                `}
                style={{ paddingLeft: `${indent + 12}px` }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeHeading"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-purple-600 to-blue-600 rounded-r"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}

                <ChevronRight
                  size={14}
                  className={`flex-shrink-0 mt-0.5 transition-transform ${
                    isActive ? 'text-purple-600' : 'text-gray-400 group-hover:text-purple-600'
                  }`}
                />

                <span className="line-clamp-2 leading-snug">
                  {heading.text}
                </span>
              </motion.button>
            )
          })}
        </nav>

        {/* Scroll progress indicator */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span>읽기 진행도</span>
            <span className="font-medium text-purple-600">
              {headings.findIndex(h => h.id === activeId) + 1} / {headings.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: `${((headings.findIndex(h => h.id === activeId) + 1) / headings.length) * 100}%`
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Back to top button */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="w-full mt-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-105"
      >
        ↑ 맨 위로
      </motion.button>
    </motion.aside>
  )
}
