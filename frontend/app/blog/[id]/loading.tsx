/**
 * Post Loading State
 * Single Responsibility: Display loading skeleton while fetching post
 */

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          {/* Back button skeleton */}
          <div className="h-6 w-40 bg-gray-200 rounded mb-6 animate-pulse"></div>

          {/* Header skeleton */}
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <div className="h-8 w-24 bg-purple-100 rounded-full mb-4 animate-pulse"></div>
            <div className="h-10 w-3/4 bg-gray-200 rounded mb-6 animate-pulse"></div>
            <div className="flex gap-6 mb-6">
              <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="flex gap-2">
              <div className="h-6 w-20 bg-gray-100 rounded animate-pulse"></div>
              <div className="h-6 w-20 bg-gray-100 rounded animate-pulse"></div>
              <div className="h-6 w-20 bg-gray-100 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Content skeleton */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="space-y-4">
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
