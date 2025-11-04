'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Tag, Search, Filter, PenTool } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import Navigation from '@/components/Navigation';
import BlogSidebar from '@/components/BlogSidebar';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

interface Post {
  id: number;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: string;
  author: {
    id: number;
    username: string;
    email: string;
  };
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory, searchQuery]);

  const fetchPosts = async () => {
    try {
      const { apiClient } = await import('@/lib/api');
      const params: any = {};

      if (selectedCategory !== 'all') {
        params.category = selectedCategory;
      }
      if (searchQuery) {
        params.search = searchQuery;
      }
      params.limit = 20;

      const response = await apiClient.getPosts(params);

      if (response.success && response.data) {
        setPosts(response.data as any);
        setFilteredPosts(response.data as any);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const PostCard = ({ post }: { post: Post }) => (
    <Link href={`/blog/${post.id}`}>
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -8, scale: 1.02 }}
        className="bg-white rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer h-full flex flex-col"
      >
        <div className="p-6 flex-1 flex flex-col">
          {/* Category Badge */}
          {post.category && (
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 rounded-full text-xs font-semibold">
                {post.category}
              </span>
            </div>
          )}

          {/* Title */}
          <h2 className="text-2xl font-bold mb-3 group-hover:text-purple-600 transition-colors line-clamp-2 leading-tight">
            {post.title}
          </h2>

          {/* Content Preview */}
          <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed flex-1">
            {(() => {
              // Remove markdown syntax and HTML tags
              let cleanContent = post.content
                // Remove headers (# ## ###)
                .replace(/^#{1,6}\s+/gm, '')
                // Remove bold/italic (**text** *text*)
                .replace(/\*\*([^*]+)\*\*/g, '$1')
                .replace(/\*([^*]+)\*/g, '$1')
                // Remove links [text](url)
                .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
                // Remove inline code `code`
                .replace(/`([^`]+)`/g, '$1')
                // Remove code blocks ```code```
                .replace(/```[\s\S]*?```/g, '')
                // Remove HTML tags
                .replace(/<[^>]*>/g, '')
                // Remove extra whitespace
                .replace(/\s+/g, ' ')
                .trim()

              return cleanContent.length > 150
                ? cleanContent.substring(0, 150) + '...'
                : cleanContent
            })()}
          </p>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs hover:bg-purple-100 hover:text-purple-700 transition-colors"
                >
                  <Tag size={12} />
                  {tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="text-xs text-gray-500">+{post.tags.length - 3}</span>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                {format(new Date(post.createdAt), 'M/d', { locale: ko })}
              </div>
              <div className="flex items-center gap-1">
                <Clock size={14} />
                {Math.ceil(post.content.length / 200)}분
              </div>
            </div>
            <span className="text-sm font-medium text-purple-600 group-hover:translate-x-1 transition-transform">
              읽기 →
            </span>
          </div>
        </div>
      </motion.article>
    </Link>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navigation />

      <div className="flex pt-20">
        {/* Sidebar */}
        <BlogSidebar
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          {/* Hero Section - Compact */}
          <section className="relative bg-gradient-to-br from-purple-600 to-blue-600 text-white py-12 overflow-hidden">
            <div className="max-w-6xl mx-auto px-4 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">개발 블로그</h1>
                  <p className="text-purple-100 text-sm">새로운 기술과 개발 경험을 공유합니다</p>
                </div>

                {user && (
                  <Link
                    href="/blog/write"
                    className="inline-flex items-center gap-2 bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-all shadow-lg hover:scale-105 transform duration-200"
                  >
                    <PenTool size={18} />
                    새 글 작성
                  </Link>
                )}
              </div>
            </div>
          </section>

          {/* Posts Grid */}
          <section className="max-w-6xl mx-auto px-4 py-16">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <div className="relative">
                  <div className="animate-spin rounded-full h-20 w-20 border-4 border-purple-200"></div>
                  <div className="animate-spin rounded-full h-20 w-20 border-4 border-t-purple-600 absolute top-0"></div>
                </div>
                <p className="text-gray-600 text-lg mt-6 font-medium">포스트를 불러오는 중...</p>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-24">
                <div className="max-w-md mx-auto">
                  <div className="mb-6">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                      <Search size={48} className="text-gray-400" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    {searchQuery || selectedCategory !== 'all'
                      ? '검색 결과가 없습니다'
                      : '아직 작성된 포스트가 없습니다'}
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {searchQuery || selectedCategory !== 'all'
                      ? '다른 검색어나 카테고리를 시도해보세요.'
                      : '첫 번째 포스트를 작성해보세요!'}
                  </p>
                  {(searchQuery || selectedCategory !== 'all') && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('all');
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-105"
                    >
                      전체 포스트 보기
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}