/**
 * Post Not Found Page
 * Single Responsibility: Display 404 error for missing posts
 */

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">포스트를 찾을 수 없습니다</h2>
        <p className="text-gray-500 mb-8">요청하신 포스트가 존재하지 않거나 삭제되었습니다.</p>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <ArrowLeft size={20} />
          목록으로 돌아가기
        </Link>
      </div>
    </div>
  )
}
