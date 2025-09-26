'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Tag, Search, Filter, PenTool, Menu } from 'lucide-react';
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory, searchQuery]);

  const fetchPosts = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      params.append('limit', '20');

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/posts?${params.toString()}`
      );

      if (response.ok) {
        const result = await response.json();
        if (result.success || result.data) {
          const fetchedPosts = result.data || result;
          setPosts(fetchedPosts);
          setFilteredPosts(fetchedPosts);
        }
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const PostCard = ({ post }: { post: Post }) => (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group"
    >
      <div className="p-6">
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            {format(new Date(post.createdAt), 'yyyy년 M월 d일', { locale: ko })}
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} />
            {Math.ceil(post.content.length / 200)} min read
          </div>
          {post.category && (
            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
              {post.category}
            </span>
          )}
        </div>

        <h2 className="text-xl font-bold mb-3 group-hover:text-purple-600 transition-colors line-clamp-2">
          {post.title}
        </h2>

        <p className="text-gray-600 mb-4 line-clamp-3">
          {post.content.length > 150
            ? post.content.substring(0, 150) + '...'
            : post.content}
        </p>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-sm"
              >
                <Tag size={12} />
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="text-sm text-gray-500 mb-3">
          작성자: {post.author.username}
        </div>

        <Link
          href={`/blog/${post.id}`}
          className="inline-flex items-center text-purple-600 font-medium hover:text-purple-700 transition-colors"
        >
          더 읽기 →
        </Link>
      </div>
    </motion.article>
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
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          {/* Mobile Sidebar Toggle */}
          <div className="lg:hidden sticky top-20 z-30 bg-white border-b border-gray-200 px-4 py-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="flex items-center gap-2 text-gray-600 hover:text-purple-600"
            >
              <Menu size={20} />
              <span>필터 및 카테고리</span>
            </button>
          </div>

          {/* Hero Section */}
          <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20">
            <div className="max-w-6xl mx-auto px-4 text-center">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-bold mb-6"
              >
                개발 블로그
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl opacity-90 max-w-2xl mx-auto mb-8"
              >
                새로운 기술과 개발 경험을 공유하며, 함께 성장해나가는 공간입니다.
              </motion.p>

              {user && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Link
                    href="/blog/write"
                    className="inline-flex items-center gap-2 bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <PenTool size={20} />
                    새 글 작성하기
                  </Link>
                </motion.div>
              )}
            </div>
          </section>

          {/* Posts Grid */}
          <section className="max-w-6xl mx-auto px-4 py-16">
            {isLoading ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-500 text-lg">포스트를 불러오는 중...</p>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">
                  {searchQuery || selectedCategory !== 'all'
                    ? '검색 결과가 없습니다.'
                    : '아직 작성된 포스트가 없습니다.'}
                </p>
                {(searchQuery || selectedCategory !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                    className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    전체 포스트 보기
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
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