'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Tag, Search, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { BlogPost, BlogCategory } from '@/types/blog';
import Navigation from '@/components/Navigation';

// Mock data for now - will be replaced with actual data
const mockPosts: BlogPost[] = [
  {
    slug: 'next-js-app-router-guide',
    title: 'Next.js App Router 완벽 가이드',
    excerpt: 'Next.js 13에서 도입된 App Router의 주요 특징과 사용법을 자세히 알아보겠습니다.',
    content: '',
    date: '2024-01-15',
    author: '김태회',
    category: 'Frontend',
    tags: ['Next.js', 'React', 'TypeScript'],
    readingTime: '5 min read',
    image: '/blog/nextjs-app-router.jpg'
  },
  {
    slug: 'docker-kubernetes-deployment',
    title: 'Docker와 Kubernetes를 활용한 배포 자동화',
    excerpt: '컨테이너 기반의 현대적인 배포 파이프라인을 구축하는 방법을 단계별로 설명합니다.',
    content: '',
    date: '2024-01-10',
    author: '김태회',
    category: 'DevOps',
    tags: ['Docker', 'Kubernetes', 'CI/CD'],
    readingTime: '8 min read',
  },
  {
    slug: 'spring-boot-security-jwt',
    title: 'Spring Boot에서 JWT 인증 구현하기',
    excerpt: 'Spring Security와 JWT를 사용한 안전한 인증 시스템 구축 방법을 알아봅시다.',
    content: '',
    date: '2024-01-05',
    author: '김태회',
    category: 'Backend',
    tags: ['Spring Boot', 'JWT', 'Security'],
    readingTime: '12 min read',
  }
];

const mockCategories: BlogCategory[] = [
  { name: 'Frontend', slug: 'frontend', description: '프론트엔드 개발', postCount: 1 },
  { name: 'Backend', slug: 'backend', description: '백엔드 개발', postCount: 1 },
  { name: 'DevOps', slug: 'devops', description: '데브옵스', postCount: 1 },
];

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>(mockPosts);
  const [categories, setCategories] = useState<BlogCategory[]>(mockCategories);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(mockPosts);

  useEffect(() => {
    let result = posts;

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(post =>
        post.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Search filter
    if (searchQuery) {
      result = result.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredPosts(result);
  }, [posts, selectedCategory, searchQuery]);

  const PostCard = ({ post }: { post: BlogPost }) => (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group"
    >
      {post.image && (
        <div className="aspect-video overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <div className="p-6">
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            {format(new Date(post.date), 'yyyy년 M월 d일', { locale: ko })}
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} />
            {post.readingTime}
          </div>
          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
            {post.category}
          </span>
        </div>

        <h2 className="text-xl font-bold mb-3 group-hover:text-purple-600 transition-colors line-clamp-2">
          {post.title}
        </h2>

        <p className="text-gray-600 mb-4 line-clamp-3">
          {post.excerpt}
        </p>

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

        <a
          href={`/blog/${post.slug}`}
          className="inline-flex items-center text-purple-600 font-medium hover:text-purple-700 transition-colors"
        >
          더 읽기 →
        </a>
      </div>
    </motion.article>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navigation />

      <main className="pt-20">
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
              className="text-xl opacity-90 max-w-2xl mx-auto"
            >
              새로운 기술과 개발 경험을 공유하며, 함께 성장해나가는 공간입니다.
            </motion.p>
          </div>
        </section>

        {/* Filter Section */}
        <section className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="포스트 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter size={20} className="text-gray-500" />
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-purple-50'
                }`}
              >
                전체
              </button>
              {categories.map((category) => (
                <button
                  key={category.slug}
                  onClick={() => setSelectedCategory(category.slug)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.slug
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-purple-50'
                  }`}
                >
                  {category.name} ({category.postCount})
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Posts Grid */}
        <section className="max-w-6xl mx-auto px-4 pb-16">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">검색 결과가 없습니다.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}