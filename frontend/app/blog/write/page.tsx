'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Save, ArrowLeft, Eye, EyeOff, Plus, Upload, Image } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import Navigation from '@/components/Navigation'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'

export default function WriteBlogPage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [displayContent, setDisplayContent] = useState('')
  const [imageMap, setImageMap] = useState<Map<string, string>>(new Map())
  const [imageCounter, setImageCounter] = useState(0)
  const [category, setCategory] = useState('Frontend')
  const [customCategory, setCustomCategory] = useState('')
  const [showCustomCategory, setShowCustomCategory] = useState(false)
  const [tags, setTags] = useState('')
  const [isPreview, setIsPreview] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)

  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  // 이미지를 Base64로 변환하는 함수
  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  // 이미지 플레이스홀더를 실제 마크다운으로 변환
  const convertPlaceholdersToMarkdown = (text: string): string => {
    return text.replace(/\[image (\d+) \+@@\]/g, (match, num) => {
      const placeholder = `[image ${num} +@@]`
      const base64 = imageMap.get(placeholder)
      return base64 ? `![이미지 ${num}](${base64})` : match
    })
  }

  // 마크다운의 이미지를 플레이스홀더로 변환
  const convertMarkdownToPlaceholders = (text: string): string => {
    const newImageMap = new Map(imageMap)
    let counter = imageCounter

    const result = text.replace(/!\[([^\]]*)\]\((data:image\/[^;]+;base64[^)]+)\)/g, (match, alt, src) => {
      // 기존 이미지 맵에서 해당 base64를 찾기
      for (const [placeholder, base64] of Array.from(newImageMap.entries())) {
        if (base64 === src) {
          return placeholder
        }
      }

      // 새로운 이미지인 경우
      counter++
      const placeholder = `[image ${counter} +@@]`
      newImageMap.set(placeholder, src)
      return placeholder
    })

    setImageMap(newImageMap)
    setImageCounter(counter)
    return result
  }

  // 클립보드 이미지 붙여넣기 처리
  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = Array.from(e.clipboardData.items)
    const imageItems = items.filter(item => item.type.startsWith('image/'))

    if (imageItems.length > 0) {
      e.preventDefault()
      setUploadingImage(true)

      try {
        const imageFile = imageItems[0].getAsFile()
        if (imageFile) {
          const base64 = await convertImageToBase64(imageFile)
          const newCounter = imageCounter + 1
          const placeholder = `[image ${newCounter} +@@]`

          // 이미지 맵에 추가
          const newImageMap = new Map(imageMap)
          newImageMap.set(placeholder, base64)
          setImageMap(newImageMap)
          setImageCounter(newCounter)

          // 현재 커서 위치에 플레이스홀더 삽입
          const textarea = e.target as HTMLTextAreaElement
          const start = textarea.selectionStart
          const end = textarea.selectionEnd
          const newContent = displayContent.slice(0, start) + placeholder + '\n\n' + displayContent.slice(end)
          setDisplayContent(newContent)
          setContent(convertPlaceholdersToMarkdown(newContent))

          // 커서를 플레이스홀더 뒤로 이동
          setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = start + placeholder.length + 2
          }, 0)
        }
      } catch (error) {
        console.error('이미지 처리 중 오류 발생:', error)
        setError('이미지 처리 중 오류가 발생했습니다.')
      } finally {
        setUploadingImage(false)
      }
    }
  }

  // 파일 선택을 통한 이미지 업로드
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !file.type.startsWith('image/')) return

    setUploadingImage(true)
    try {
      const base64 = await convertImageToBase64(file)
      const newCounter = imageCounter + 1
      const placeholder = `[image ${newCounter} +@@]`

      // 이미지 맵에 추가
      const newImageMap = new Map(imageMap)
      newImageMap.set(placeholder, base64)
      setImageMap(newImageMap)
      setImageCounter(newCounter)

      const newDisplayContent = displayContent + placeholder + '\n\n'
      setDisplayContent(newDisplayContent)
      setContent(convertPlaceholdersToMarkdown(newDisplayContent))
    } catch (error) {
      console.error('이미지 업로드 중 오류 발생:', error)
      setError('이미지 업로드 중 오류가 발생했습니다.')
    } finally {
      setUploadingImage(false)
    }
  }

  // 콘텐츠 변경 핸들러
  const handleContentChange = (newDisplayContent: string) => {
    setDisplayContent(newDisplayContent)
    const markdownContent = convertPlaceholdersToMarkdown(newDisplayContent)
    setContent(markdownContent)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    console.log('📝 Submit - User:', user)
    console.log('📝 Submit - Tokens:', {
      access_token: typeof window !== 'undefined' ? localStorage.getItem('access_token') : null,
      refresh_token: typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null
    })

    if (!user) {
      console.error('❌ No user found')
      setError('인증이 필요합니다. 다시 로그인해주세요.')
      setIsLoading(false)
      router.push('/login')
      return
    }

    const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    const finalCategory = showCustomCategory ? customCategory : category

    // 최종 마크다운 콘텐츠로 변환
    const finalContent = convertPlaceholdersToMarkdown(displayContent)

    try {
      const { apiClient } = await import('@/lib/api')
      console.log('📝 Calling createPost...')
      const response = await apiClient.createPost({
        title,
        content: finalContent,
        category: finalCategory,
        tags: tagArray,
      })
      console.log('📝 createPost response:', response)

      if (response.success) {
        console.log('✅ Post created successfully')
        router.push('/blog')
      } else {
        console.error('❌ Post creation failed:', response)
        setError(response.error || response.message || '포스트 작성에 실패했습니다.')
      }
    } catch (error) {
      console.error('❌ Submit error:', error)
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

            <div></div>
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
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                  내용 {isPreview && <span className="text-purple-600">(마크다운 미리보기)</span>}
                </label>

                {!isPreview && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">이미지를 복사해서 붙여넣기 하거나</span>
                    <label className="cursor-pointer flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700">
                      <Upload size={14} />
                      파일 선택
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>

              {uploadingImage && (
                <div className="mb-2 text-sm text-purple-600 flex items-center gap-2">
                  <Image size={16} />
                  이미지 업로드 중...
                </div>
              )}

              {imageMap.size > 0 && !isPreview && (
                <div className="mb-2 text-sm text-gray-600 flex items-center gap-2">
                  <Image size={16} />
                  이미지 {imageMap.size}개 첨부됨 (미리보기에서 확인 가능)
                </div>
              )}

              {isPreview ? (
                <div className="min-h-96 p-6 border border-gray-300 rounded-lg bg-white overflow-auto">
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
                          // 체크박스 리스트인지 확인
                          const hasCheckbox = String(children).includes('type="checkbox"');
                          return (
                            <ul className={hasCheckbox ? "mb-4 space-y-2" : "list-disc list-inside mb-4 space-y-2 ml-4"} {...props}>
                              {children}
                            </ul>
                          );
                        },
                        ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-2 ml-4">{children}</ol>,
                        li: ({ children, ...props }) => {
                          // 체크박스 리스트 아이템인지 확인
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
                      }}
                    >
                      {convertPlaceholdersToMarkdown(displayContent) || '*내용을 작성하면 여기에 미리보기가 표시됩니다.*'}
                    </ReactMarkdown>
                  </div>
                </div>
              ) : (
                <textarea
                  id="content"
                  value={displayContent}
                  onChange={(e) => handleContentChange(e.target.value)}
                  onPaste={handlePaste}
                  rows={20}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none font-mono text-sm"
                  style={{
                    background: `linear-gradient(transparent, transparent)`,
                    // Make image placeholders stand out
                    backgroundImage: displayContent.includes('[image ') ?
                      `repeating-linear-gradient(transparent, transparent)` : 'none'
                  }}
                  placeholder="포스트 내용을 작성하세요...

마크다운 문법 예시:
# 제목 1
## 제목 2
### 제목 3

**굵은 글씨**
*기울임 글씨*
`인라인 코드`

📎 이미지 붙여넣기: Ctrl+V (또는 Cmd+V)로 클립보드의 이미지를 바로 삽입할 수 있습니다!
💡 이미지는 [image 1 +@@] 형태로 표시되며, 미리보기에서 실제 이미지를 확인할 수 있습니다.

```javascript
// 코드 블록
console.log('Hello World!');
```

- 리스트 아이템 1
- 리스트 아이템 2

> 인용문 블록

1. 번호 리스트 1
2. 번호 리스트 2"
                  required
                />
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

      {/* Floating Preview Button */}
      <motion.button
        type="button"
        onClick={() => setIsPreview(!isPreview)}
        className="fixed bottom-6 right-6 bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title={isPreview ? '편집 모드' : '미리보기 모드'}
      >
        {isPreview ? <EyeOff size={24} /> : <Eye size={24} />}
      </motion.button>
    </div>
  )
}