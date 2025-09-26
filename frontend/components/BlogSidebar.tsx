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
      // 카테고리 목록 가져오기
      const categoriesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/posts/categories`)
      if (categoriesResponse.ok) {
        const categoriesResult = await categoriesResponse.json()
        if (categoriesResult.success) {
          // 각 카테고리별 포스트 수 계산
          const categoriesWithCount = await Promise.all(
            categoriesResult.data.map(async (categoryName: string) => {
              try {
                const postsResponse = await fetch(
                  `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/posts?category=${encodeURIComponent(categoryName)}&limit=1`
                )
                if (postsResponse.ok) {
                  const postsResult = await postsResponse.json()
                  return {
                    name: categoryName,
                    count: postsResult.pagination?.total || 0
                  }
                }
                return { name: categoryName, count: 0 }
              } catch {
                return { name: categoryName, count: 0 }
              }
            })
          )
          setCategories(categoriesWithCount.filter(cat => cat.count > 0))
        }
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchTotalPosts = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/posts?limit=1`)
      if (response.ok) {
        const result = await response.json()
        setTotalPosts(result.pagination?.total || 0)
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
        className={`fixed lg:sticky top-0 left-0 h-screen lg:h-auto w-80 bg-white border-r border-gray-200 z-50 lg:z-auto overflow-y-auto ${
          isOpen ? 'shadow-xl lg:shadow-none' : ''
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Search size={20} />
              검색
            </h3>
            <div className="relative">
              <input
                type="text"
                placeholder="포스트 검색..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-10"
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Stats Section */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">📊 통계</h4>
              <div className="text-sm text-gray-600">
                <p>전체 포스트: <span className="font-semibold text-purple-600">{totalPosts}개</span></p>
                <p>카테고리: <span className="font-semibold text-purple-600">{categories.length}개</span></p>
              </div>
            </div>
          </div>

          {/* Categories Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Folder size={20} />
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
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-purple-100 text-purple-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Hash size={16} />
                    <span>전체</span>
                  </div>
                  <span className="text-sm bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                    {totalPosts}
                  </span>
                </button>

                {/* Individual Categories */}
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => onCategoryChange(category.name)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                      selectedCategory === category.name
                        ? 'bg-purple-100 text-purple-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Folder size={16} />
                      <span>{category.name}</span>
                    </div>
                    <span className="text-sm bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
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