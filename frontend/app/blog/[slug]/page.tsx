'use client'

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar, Clock, Tag, ArrowLeft, Share2, Heart, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { BlogPost } from '@/types/blog';
import Navigation from '@/components/Navigation';
import CommentSection from '@/components/CommentSection';

// Mock data for now
const mockPost: BlogPost = {
  slug: 'next-js-app-router-guide',
  title: 'Next.js App Router 완벽 가이드',
  excerpt: 'Next.js 13에서 도입된 App Router의 주요 특징과 사용법을 자세히 알아보겠습니다.',
  content: `# Next.js App Router 완벽 가이드

Next.js 13에서 가장 큰 변화 중 하나는 바로 **App Router**의 도입입니다. 기존의 Pages Router와는 완전히 다른 방식으로 라우팅을 처리하며, React 18의 새로운 기능들을 완벽하게 활용할 수 있도록 설계되었습니다.

## App Router란?

App Router는 React의 Server Components, Suspense, Streaming 등의 최신 기능을 기반으로 구축된 새로운 라우팅 시스템입니다. 파일 기반 라우팅을 유지하면서도 더욱 직관적이고 강력한 기능들을 제공합니다.

### 주요 특징

1. **Server Components 기본 지원**
   - 서버에서 렌더링되는 컴포넌트
   - 더 빠른 초기 로딩 시간
   - SEO 최적화

2. **중첩 라우팅**
   - 복잡한 UI 구조를 쉽게 구현
   - Layout 컴포넌트를 통한 일관된 UI

3. **Streaming**
   - 점진적으로 UI를 렌더링
   - 사용자 경험 개선

## 기본 구조

\`\`\`
app/
  layout.tsx      # 루트 레이아웃
  page.tsx        # 홈 페이지
  about/
    page.tsx      # /about 페이지
  blog/
    layout.tsx    # 블로그 레이아웃
    page.tsx      # /blog 페이지
    [slug]/
      page.tsx    # /blog/[slug] 페이지
\`\`\`

## 레이아웃 컴포넌트

레이아웃 컴포넌트는 여러 페이지에서 공통으로 사용되는 UI를 정의합니다.

\`\`\`tsx
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        <header>공통 헤더</header>
        {children}
        <footer>공통 푸터</footer>
      </body>
    </html>
  )
}
\`\`\`

## 동적 라우팅

대괄호를 사용하여 동적 라우팅을 구현할 수 있습니다.

\`\`\`tsx
// app/blog/[slug]/page.tsx
export default function BlogPost({ params }: { params: { slug: string } }) {
  return <h1>포스트: {params.slug}</h1>
}
\`\`\`

## 로딩 및 에러 처리

App Router는 특별한 파일명을 통해 로딩 상태와 에러 상태를 처리할 수 있습니다.

- \`loading.tsx\`: 로딩 UI
- \`error.tsx\`: 에러 UI
- \`not-found.tsx\`: 404 페이지

## 마무리

App Router는 Next.js의 미래이며, 현재 개발 중인 프로젝트라면 반드시 고려해야 할 기능입니다. 초기 학습 비용은 있지만, 더 나은 성능과 개발 경험을 제공합니다.

다음 포스트에서는 App Router의 고급 기능들에 대해 더 자세히 알아보겠습니다.`,
  date: '2024-01-15',
  author: '김태회',
  category: 'Frontend',
  tags: ['Next.js', 'React', 'TypeScript'],
  readingTime: '5 min read',
  image: '/blog/nextjs-app-router.jpg'
};

export default function BlogPostPage() {
  const params = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(42);

  useEffect(() => {
    // In real implementation, fetch post by slug
    if (params.slug === mockPost.slug) {
      setPost(mockPost);
    }
    setLoading(false);
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-gray-600 mb-8">포스트를 찾을 수 없습니다.</p>
          <a href="/blog" className="text-purple-600 hover:text-purple-700">
            ← 블로그로 돌아가기
          </a>
        </div>
      </div>
    );
  }

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: post.title,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert('링크가 복사되었습니다!');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navigation />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-white">
          <div className="max-w-4xl mx-auto px-4 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <a
                href="/blog"
                className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-8"
              >
                <ArrowLeft size={20} />
                블로그로 돌아가기
              </a>

              <div className="mb-6">
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  {post.category}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8">
                <div className="flex items-center gap-2">
                  <img
                    src="https://via.placeholder.com/40x40"
                    alt={post.author}
                    className="w-10 h-10 rounded-full"
                  />
                  <span className="font-medium">{post.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  {format(new Date(post.date), 'yyyy년 M월 d일', { locale: ko })}
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  {post.readingTime}
                </div>
              </div>

              {post.image && (
                <div className="aspect-video mb-8 rounded-lg overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </motion.div>
          </div>
        </section>

        {/* Content */}
        <section className="bg-white">
          <div className="max-w-4xl mx-auto px-4 pb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="prose prose-lg max-w-none
                prose-headings:text-gray-900
                prose-p:text-gray-700 prose-p:leading-relaxed
                prose-a:text-purple-600 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-gray-900
                prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                prose-pre:bg-gray-900 prose-pre:text-gray-100"
              dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }}
            />

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-gray-200">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                >
                  <Tag size={14} />
                  {tag}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between mt-8 pt-8 border-t border-gray-200">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                    liked
                      ? 'bg-red-100 text-red-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
                  }`}
                >
                  <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
                  {likeCount}
                </button>
                <a
                  href="#comments"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-full hover:bg-purple-50 hover:text-purple-600 transition-colors"
                >
                  <MessageCircle size={20} />
                  댓글
                </a>
              </div>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
              >
                <Share2 size={20} />
                공유하기
              </button>
            </div>
          </div>
        </section>

        {/* Comments */}
        <section id="comments" className="bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 py-12">
            <CommentSection postSlug={post.slug} />
          </div>
        </section>
      </main>
    </div>
  );
}