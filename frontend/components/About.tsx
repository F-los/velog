'use client'

import { motion } from 'framer-motion'
import { Code2, Server, Cloud, Zap } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

const About = () => {
  const { t } = useLanguage()

  const highlights = [
    {
      icon: <Server className="w-8 h-8" />,
      title: t('about.highlight1.title'),
      description: t('about.highlight1.desc')
    },
    {
      icon: <Cloud className="w-8 h-8" />,
      title: t('about.highlight2.title'),
      description: t('about.highlight2.desc')
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: t('about.highlight3.title'),
      description: t('about.highlight3.desc')
    },
    {
      icon: <Code2 className="w-8 h-8" />,
      title: t('about.highlight4.title'),
      description: t('about.highlight4.desc')
    }
  ]

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-purple-600">{t('about.title')}</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('about.description')}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-6 text-gray-800">
              {t('about.greeting')}
            </h3>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p dangerouslySetInnerHTML={{ __html: t('about.intro1') }} />
              <p dangerouslySetInnerHTML={{ __html: t('about.intro2') }} />
              <p dangerouslySetInnerHTML={{ __html: t('about.intro3') }} />
            </div>

            {/* Personal Stats */}
            <div className="grid grid-cols-2 gap-6 mt-8">
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-700">3+</div>
                <div className="text-sm text-gray-600">{t('about.years')}</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-700">15+</div>
                <div className="text-sm text-gray-600">{t('about.projects')}</div>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Highlights */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid gap-6"
          >
            {highlights.map((highlight, index) => (
              <motion.div
                key={highlight.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="flex items-start space-x-4 p-6 bg-white border border-purple-100 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="flex-shrink-0 p-3 bg-purple-600 rounded-lg text-white">
                  {highlight.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">{highlight.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{highlight.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Philosophy Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="bg-purple-gradient-light rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl font-bold mb-4 text-purple-800">{t('about.philosophy.title')}</h3>
            <blockquote className="text-lg text-purple-700 italic max-w-3xl mx-auto">
              {t('about.philosophy.quote')}
            </blockquote>
            <p className="mt-4 text-purple-600 max-w-2xl mx-auto">
              {t('about.philosophy.desc')}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default About