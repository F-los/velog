'use client'

/**
 * Post Detail Client Component
 * Single Responsibility: Handle client-side interactions (animations, navigation)
 * Type: Client Component
 */

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Clock, Tag, User } from 'lucide-react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import type { Post } from '@/types/api'
import MarkdownRenderer from './MarkdownRenderer'
import BlogSidebar from './BlogSidebar'

interface PostDetailClientProps {
  post: Post
}

export default function PostDetailClient({ post }: PostDetailClientProps) {
  const router = useRouter()

  return (
    <main className="pt-20 pb-16">
      <div className="flex">
        {/* Left Sidebar - Category Sidebar (same as blog list) */}
        <BlogSidebar
          selectedCategory={post.category}
          onCategoryChange={(category) => {
            router.push(`/blog?category=${category}`)
          }}
          searchQuery=""
          onSearchChange={() => {}}
        />

        {/* Main Content */}
        <div className="flex-1 max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors mb-6"
          >
            <ArrowLeft size={20} />
            <span>목록으로 돌아가기</span>
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-8 mb-8"
          >
            <div className="mb-6">
              {post.category && (
                <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
                  {post.category}
                </span>
              )}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {post.title}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-6">
              <div className="flex items-center gap-2">
                <User size={16} />
                <span>{post.author.username}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{format(new Date(post.createdAt), 'yyyy년 M월 d일', { locale: ko })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>{Math.ceil(post.content.length / 200)} min read</span>
              </div>
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-sm"
                  >
                    <Tag size={12} />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        </div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-8"
          >
            <MarkdownRenderer content={post.content} />
          </motion.div>
        </div>
      </div>
    </main>
  )
}
