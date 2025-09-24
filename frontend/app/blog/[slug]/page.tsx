import { Calendar, Clock, Tag, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { BlogPost } from '@/types/blog';
import { getAllPosts, getPostBySlug } from '@/lib/blog';
import Navigation from '@/components/Navigation';
import CommentSection from '@/components/CommentSection';
import BlogPostClient from './BlogPostClient';

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);

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

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navigation />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-white">
          <div className="max-w-4xl mx-auto px-4 py-12">
            <div>
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
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="bg-white">
          <div className="max-w-4xl mx-auto px-4 pb-12">
            <div
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

            {/* Use Client Component for interactive features */}
            <BlogPostClient post={post} />
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