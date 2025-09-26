'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Save, ArrowLeft, Eye, EyeOff, Plus } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import Navigation from '@/components/Navigation'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'

export default function WriteBlogPage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('Frontend')
  const [customCategory, setCustomCategory] = useState('')
  const [showCustomCategory, setShowCustomCategory] = useState(false)
  const [tags, setTags] = useState('')
  const [isPreview, setIsPreview] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const token = localStorage.getItem('token')
    if (!token) {
      setError('인증 토큰이 없습니다. 다시 로그인해주세요.')
      setIsLoading(false)
      return
    }

    const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag)

    const finalCategory = showCustomCategory ? customCategory : category

    try {
      const response = await fetch('https://fast-cow-flos-a3aa5bcd.koyeb.app/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          content,
          category: finalCategory,
          tags: tagArray,
        }),
      })

      if (response.ok) {
        router.push('/blog')
      } else {
        const errorData = await response.json()
        setError(errorData.message || '포스트 작성에 실패했습니다.')
      }
    } catch (error) {
      console.error('Submit error:', error)
      setError('네트워크 오류가 발생했습니다.')
    }
    setIsLoading(false)
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="pt-20 pb-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
              >
                <ArrowLeft size={20} />
                <span>뒤로가기</span>
              </button>
              <h1 className="text-2xl font-bold text-gray-900">새 포스트 작성</h1>
            </div>

            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => setIsPreview(!isPreview)}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-purple-600 transition-colors"
              >
                {isPreview ? <EyeOff size={20} /> : <Eye size={20} />}
                <span>{isPreview ? '편집' : '미리보기'}</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                제목
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="포스트 제목을 입력하세요"
                required
              />
            </div>

            {/* Category and Tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  카테고리
                </label>
                <div className="space-y-3">
                  {!showCustomCategory ? (
                    <div className="flex gap-2">
                      <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="Frontend">Frontend</option>
                        <option value="Backend">Backend</option>
                        <option value="DevOps">DevOps</option>
                        <option value="Database">Database</option>
                        <option value="AI/ML">AI/ML</option>
                        <option value="기타">기타</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => setShowCustomCategory(true)}
                        className="px-3 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        title="새 카테고리 만들기"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        placeholder="새 카테고리명을 입력하세요"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required={showCustomCategory}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setShowCustomCategory(false)
                          setCustomCategory('')
                        }}
                        className="px-3 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-red-600"
                        title="취소"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                  태그 (쉼표로 구분)
                </label>
                <input
                  id="tags"
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="React, TypeScript, Next.js"
                />
              </div>
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                내용 {isPreview && <span className="text-purple-600">(마크다운 미리보기)</span>}
              </label>

              {isPreview ? (
                <div className="min-h-96 p-6 border border-gray-300 rounded-lg bg-white overflow-auto prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-code:text-purple-600 prose-code:bg-purple-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-white">
                  <ReactMarkdown
                    components={{
                      code({ node, inline, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || '')
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={tomorrow}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        )
                      },
                    }}
                  >
                    {content || '*내용을 작성하면 여기에 미리보기가 표시됩니다.*'}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={20}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none font-mono text-sm"
                    placeholder="포스트 내용을 작성하세요...

마크다운 문법 예시:
# 제목 1
## 제목 2
**굵은 글씨**
*기울임 글씨*
`인라인 코드`

```javascript
// 코드 블록
console.log('Hello World!');
```

- 리스트 아이템
- 리스트 아이템"
                    required
                  />

                  {/* Live Preview Panel */}
                  <div className="hidden lg:block">
                    <div className="text-sm font-medium text-gray-500 mb-2">실시간 미리보기</div>
                    <div className="min-h-96 p-4 border border-gray-200 rounded-lg bg-gray-50 overflow-auto prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-code:text-purple-600 prose-code:bg-white prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-800 prose-pre:text-white">
                      <ReactMarkdown
                        components={{
                          code({ node, inline, className, children, ...props }: any) {
                            const match = /language-(\w+)/.exec(className || '')
                            return !inline && match ? (
                              <SyntaxHighlighter
                                style={tomorrow}
                                language={match[1]}
                                PreTag="div"
                                customStyle={{ fontSize: '12px' }}
                                {...props}
                              >
                                {String(children).replace(/\n$/, '')}
                              </SyntaxHighlighter>
                            ) : (
                              <code className={className} {...props}>
                                {children}
                              </code>
                            )
                          },
                        }}
                      >
                        {content || '*내용을 작성하면 여기에 실시간 미리보기가 표시됩니다.*'}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-600 text-sm bg-red-50 p-3 rounded-lg"
              >
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium text-white transition-colors ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                }`}
              >
                <Save size={20} />
                <span>{isLoading ? '저장 중...' : '포스트 발행'}</span>
              </motion.button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}