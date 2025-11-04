'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Folder, Hash, Search, X, ChevronDown, ChevronRight, FileText } from 'lucide-react'
import Link from 'next/link'

interface Category {
  name: string
  count: number
  posts?: Post[]
}

interface Post {
  id: number
  title: string
}

interface BlogSidebarProps {
  selectedCategory?: string
  onCategoryChange: (category: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export default function BlogSidebar({
  selectedCategory = 'all',
  onCategoryChange,
  searchQuery,
  onSearchChange,
}: BlogSidebarProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const { apiClient } = await import('@/lib/api')

      // 카테고리 목록 가져오기
      const categoriesResponse = await apiClient.getCategories()
      if (categoriesResponse.success && categoriesResponse.data) {
        // 각 카테고리별 포스트 목록 가져오기
        const categoriesWithPosts = await Promise.all(
          categoriesResponse.data.map(async (categoryName: string) => {
            try {
              const postsResponse = await apiClient.getPosts({
                category: categoryName,
                limit: 100
              })
              const posts = (postsResponse.data as any) || []
              return {
                name: categoryName,
                count: posts.length,
                posts: posts.map((p: any) => ({ id: p.id, title: p.title }))
              }
            } catch {
              return { name: categoryName, count: 0, posts: [] }
            }
          })
        )
        setCategories(categoriesWithPosts.filter(cat => cat.count > 0))
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearSearch = () => {
    onSearchChange('')
  }

  return (
    <>
      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="sticky top-0 left-0 h-screen w-80 bg-gradient-to-br from-white to-purple-50/30 border-r border-purple-100 overflow-y-auto hidden lg:block"
        style={{ paddingTop: '90px' }}
      >
        <div className="p-6 pt-2">
          {/* Search Section */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Search size={20} className="text-purple-600" />
              검색
            </h3>
            <div className="relative">
              <input
                type="text"
                placeholder="포스트 검색..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all pr-10 bg-white"
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>

          {/* Categories Section */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Folder size={20} className="text-purple-600" />
              카테고리
            </h3>

            {isLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-10 bg-gray-200 rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {/* All Categories */}
                <button
                  onClick={() => onCategoryChange('all')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all transform hover:scale-[1.02] ${
                    selectedCategory === 'all'
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold shadow-md'
                      : 'text-gray-700 hover:bg-purple-50 border border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Hash size={16} />
                    <span>전체</span>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    selectedCategory === 'all'
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {categories.reduce((sum, cat) => sum + cat.count, 0)}
                  </span>
                </button>

                {/* Individual Categories */}
                {categories.map((category) => (
                  <div key={category.name}>
                    <button
                      onClick={() => {
                        if (expandedCategory === category.name) {
                          setExpandedCategory(null)
                        } else {
                          setExpandedCategory(category.name)
                          onCategoryChange(category.name)
                        }
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all transform hover:scale-[1.02] ${
                        selectedCategory === category.name
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold shadow-md'
                          : 'text-gray-700 hover:bg-purple-50 border border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {expandedCategory === category.name ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        )}
                        <Folder size={16} />
                        <span className="truncate">{category.name}</span>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${
                        selectedCategory === category.name
                          ? 'bg-white/20 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {category.count}
                      </span>
                    </button>

                    {/* Expandable Post List */}
                    <AnimatePresence>
                      {expandedCategory === category.name && category.posts && category.posts.length > 0 && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-2 ml-8 space-y-1">
                            {category.posts.map((post) => (
                              <Link
                                key={post.id}
                                href={`/blog/${post.id}`}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors group"
                              >
                                <FileText size={14} className="flex-shrink-0 group-hover:text-purple-600" />
                                <span className="truncate">{post.title}</span>
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}

                {categories.length === 0 && !isLoading && (
                  <div className="text-center py-8 text-gray-500">
                    <Folder size={48} className="mx-auto mb-4 opacity-50" />
                    <p>아직 카테고리가 없습니다.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  )
}