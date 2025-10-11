'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Github } from 'lucide-react'
import Link from 'next/link'

interface ProjectCardProps {
  slug: string
  title: string
  summary: string
  techStack: string[]
  coverUrl?: string
  repoUrl?: string
  liveUrl?: string
  highlight?: boolean
}

const ProjectCard = ({
  slug,
  title,
  summary,
  techStack,
  coverUrl,
  repoUrl,
  liveUrl,
  highlight
}: ProjectCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ${
        highlight ? 'border-2 border-purple-600' : 'border border-gray-200'
      }`}
    >
      {/* Cover Image */}
      {coverUrl && (
        <div className="relative h-48 bg-gradient-to-br from-purple-50 to-purple-100 overflow-hidden">
          <img
            src={coverUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
          {highlight && (
            <div className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
              Featured
            </div>
          )}
        </div>
      )}

      <div className="p-6">
        {/* Title */}
        <Link href={`/projects/${slug}`}>
          <h3 className="text-2xl font-bold mb-2 text-gray-900 hover:text-purple-600 transition-colors cursor-pointer">
            {title}
          </h3>
        </Link>

        {/* Summary */}
        <p className="text-gray-600 mb-4 line-clamp-2">{summary}</p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-4">
          {techStack.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex gap-3 pt-4 border-t border-gray-100">
          {repoUrl && (
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors text-sm"
            >
              <Github size={16} />
              <span>Code</span>
            </a>
          )}
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors text-sm"
            >
              <ExternalLink size={16} />
              <span>Live Demo</span>
            </a>
          )}
          <Link
            href={`/projects/${slug}`}
            className="ml-auto flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors text-sm font-medium"
          >
            View Details →
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

export default ProjectCard
