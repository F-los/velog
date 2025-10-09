/**
 * Post Detail Page (Server Component)
 * Single Responsibility: Server-side data fetching and SEO metadata
 * Type: Server Component - Enables SSR and better SEO
 */

import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import PostDetailClient from '@/components/PostDetailClient'
import type { Post, ApiResponse } from '@/types/api'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

async function getPost(id: string): Promise<Post | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      cache: 'no-store', // Always fetch fresh data for blog posts
    })

    if (!response.ok) {
      return null
    }

    const result: ApiResponse<Post> = await response.json()

    if (!result.success || !result.data) {
      return null
    }

    return result.data
  } catch (error) {
    console.error('Failed to fetch post:', error)
    return null
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const post = await getPost(params.id)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: post.title,
    description: post.content.substring(0, 150) + '...',
    openGraph: {
      title: post.title,
      description: post.content.substring(0, 150) + '...',
      type: 'article',
      publishedTime: post.createdAt,
      authors: [post.author.username],
      tags: post.tags,
    },
  }
}

export default async function PostDetailPage({ params }: { params: { id: string } }) {
  const post = await getPost(params.id)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <PostDetailClient post={post} />
    </div>
  )
}