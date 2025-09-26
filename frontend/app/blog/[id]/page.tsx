'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Clock, Tag, User } from 'lucide-react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import Navigation from '@/components/Navigation'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'

interface Post {
  id: number
  title: string
  content: string
  category: string
  tags: string[]
  createdAt: string
  author: {
    id: number
    username: string
    email: string
  }
}

export default function PostDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [post, setPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (params.id) {
      fetchPost(params.id as string)
    }
  }, [params.id])

  const fetchPost = async (id: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/posts/${id}`)
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setPost(result.data)
        } else {
          setError('포스트를 찾을 수 없습니다.')
        }
      } else {
        setError('포스트를 불러오는데 실패했습니다.')
      }
    } catch (error) {
      console.error('Failed to fetch post:', error)
      setError('네트워크 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-500 text-lg">포스트를 불러오는 중...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-red-500 text-lg mb-4">{error || '포스트를 찾을 수 없습니다.'}</p>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <ArrowLeft size={16} />
              돌아가기
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4">
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
            <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-code:text-purple-600 prose-code:bg-purple-50 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-white prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg prose-h5:text-base prose-h6:text-sm">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => <h1 className="text-3xl font-bold mb-4 text-gray-900">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-2xl font-bold mb-3 text-gray-800">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-xl font-bold mb-2 text-gray-800">{children}</h3>,
                  h4: ({ children }) => <h4 className="text-lg font-bold mb-2 text-gray-700">{children}</h4>,
                  h5: ({ children }) => <h5 className="text-base font-bold mb-1 text-gray-700">{children}</h5>,
                  h6: ({ children }) => <h6 className="text-sm font-bold mb-1 text-gray-600">{children}</h6>,
                  p: ({ children }) => <p className="mb-4 text-gray-700 leading-relaxed">{children}</p>,
                  del: ({ children }) => <del className="line-through text-gray-500">{children}</del>,
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={tomorrow}
                        language={match[1]}
                        PreTag="div"
                        className="my-4"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className="bg-purple-50 text-purple-600 px-1 py-0.5 rounded text-sm" {...props}>
                        {children}
                      </code>
                    )
                  },
                  ul: ({ children, ...props }) => {
                    const hasCheckbox = String(children).includes('type="checkbox"');
                    return (
                      <ul className={hasCheckbox ? "mb-4 space-y-2" : "list-disc list-inside mb-4 space-y-2 ml-4"} {...props}>
                        {children}
                      </ul>
                    );
                  },
                  ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-2 ml-4">{children}</ol>,
                  li: ({ children, ...props }) => {
                    const content = String(children);
                    if (content.includes('type="checkbox"')) {
                      return <li className="flex items-center space-x-2 text-gray-700" {...props}>{children}</li>;
                    }
                    return <li className="text-gray-700" {...props}>{children}</li>;
                  },
                  input: ({ type, checked, ...props }) => {
                    if (type === 'checkbox') {
                      return (
                        <input
                          type="checkbox"
                          checked={checked}
                          readOnly
                          className="mr-2 accent-purple-600"
                          {...props}
                        />
                      );
                    }
                    return <input type={type} {...props} />;
                  },
                  blockquote: ({ children }) => <blockquote className="border-l-4 border-purple-500 pl-4 italic text-gray-600 my-4">{children}</blockquote>,
                  strong: ({ children }) => <strong className="font-bold text-gray-900">{children}</strong>,
                  em: ({ children }) => <em className="italic text-gray-700">{children}</em>,
                  hr: () => <hr className="border-gray-300 my-6" />,
                  table: ({ children }) => <table className="w-full border-collapse border border-gray-300 my-4">{children}</table>,
                  thead: ({ children }) => <thead className="bg-gray-50">{children}</thead>,
                  tbody: ({ children }) => <tbody>{children}</tbody>,
                  tr: ({ children }) => <tr className="border border-gray-300">{children}</tr>,
                  th: ({ children }) => <th className="border border-gray-300 px-4 py-2 text-left font-semibold">{children}</th>,
                  td: ({ children }) => <td className="border border-gray-300 px-4 py-2">{children}</td>,
                  img: ({ src, alt }) => (
                    <img
                      src={src}
                      alt={alt || ''}
                      className="max-w-full h-auto rounded-lg shadow-sm my-4"
                      loading="lazy"
                    />
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}