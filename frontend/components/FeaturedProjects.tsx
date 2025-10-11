'use client'

import { motion } from 'framer-motion'
import { useTranslation } from '@/hooks/useTranslation'
import ProjectCard from './ProjectCard'
import Link from 'next/link'
import type { Project } from '@/types/api'

interface FeaturedProjectsProps {
  projects: Project[]
}

const FeaturedProjects = ({ projects }: FeaturedProjectsProps) => {
  const { t } = useTranslation()

  if (projects.length === 0) {
    return null
  }

  return (
    <section id="projects" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-purple-600">{t('projects.title')}</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Showcasing my best work in Node.js/NestJS and full-stack development
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <ProjectCard
                slug={project.slug}
                title={project.title}
                summary={project.summary}
                techStack={project.techStack}
                coverUrl={project.coverUrl}
                repoUrl={project.repoUrl}
                liveUrl={project.liveUrl}
                highlight={project.highlight}
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link
            href="/projects"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {t('projects.viewAll')}
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default FeaturedProjects
