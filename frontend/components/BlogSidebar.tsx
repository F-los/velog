'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Folder, Hash, Search, X } from 'lucide-react'

interface Category {
  name: string
  count: number
}

interface BlogSidebarProps {
  selectedCategory?: string
  onCategoryChange: (category: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  isOpen?: boolean
  onClose?: () => void
}

export default function BlogSidebar({
  selectedCategory = 'all',
  onCategoryChange,
  searchQuery,
  onSearchChange,
  isOpen = true,
  onClose
}: BlogSidebarProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [totalPosts, setTotalPosts] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
    fetchTotalPosts()
  }, [])

  const fetchCategories = async () => {
    try {
      const { apiClient } = await import('@/lib/api')

      // 카테고리 목록 가져오기
      const categoriesResponse = await apiClient.getCategories()
      if (categoriesResponse.success && categoriesResponse.data) {
        // 각 카테고리별 포스트 수 계산
        const categoriesWithCount = await Promise.all(
          categoriesResponse.data.map(async (categoryName: string) => {
            try {
              const postsResponse = await apiClient.getPosts({
                category: categoryName,
                limit: 1
              })
              return {
                name: categoryName,
                count: (postsResponse.data as any)?.length || 0
              }
            } catch {
              return { name: categoryName, count: 0 }
            }
          })
        )
        setCategories(categoriesWithCount.filter(cat => cat.count > 0))
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchTotalPosts = async () => {
    try {
      const { apiClient } = await import('@/lib/api')
      const response = await apiClient.getPosts({ limit: 1 })
      if (response.success && response.data) {
        setTotalPosts((response.data as any)?.length || 0)
      }
    } catch (error) {
      console.error('Failed to fetch total posts:', error)
    }
  }

  const handleClearSearch = () => {
    onSearchChange('')
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed lg:sticky top-0 left-0 h-screen lg:h-auto w-80 bg-gradient-to-br from-white to-purple-50/30 border-r border-purple-100 z-50 lg:z-auto overflow-y-auto ${
          isOpen ? 'shadow-2xl lg:shadow-none' : ''
        }`}
        style={{ paddingTop: isOpen ? '80px' : '100px' }} // Account for navigation height
      >
        <div className="p-6">
          {/* Close Button (Mobile Only) */}
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden absolute top-6 right-6 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          )}

          {/* Search Section */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
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

          {/* Stats Section */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-5 border border-purple-200">
              <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-xl">📊</span> 통계
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">전체 포스트</span>
                  <span className="font-bold text-purple-700 text-lg">{totalPosts}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">카테고리</span>
                  <span className="font-bold text-purple-700 text-lg">{categories.length}</span>
                </div>
              </div>
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
                    {totalPosts}
                  </span>
                </button>

                {/* Individual Categories */}
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => onCategoryChange(category.name)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all transform hover:scale-[1.02] ${
                      selectedCategory === category.name
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold shadow-md'
                        : 'text-gray-700 hover:bg-purple-50 border border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
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