---
title: "Next.js App Router 완벽 가이드"
excerpt: "Next.js 13에서 도입된 App Router의 주요 특징과 사용법을 자세히 알아보겠습니다."
date: "2024-01-15"
author: "김태회"
category: "Frontend"
tags: ["Next.js", "React", "TypeScript"]
image: "/blog/nextjs-app-router.jpg"
---

# Next.js App Router 완벽 가이드

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

```
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
```

## 레이아웃 컴포넌트

레이아웃 컴포넌트는 여러 페이지에서 공통으로 사용되는 UI를 정의합니다.

```tsx
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
```

## 동적 라우팅

대괄호를 사용하여 동적 라우팅을 구현할 수 있습니다.

```tsx
// app/blog/[slug]/page.tsx
export default function BlogPost({ params }: { params: { slug: string } }) {
  return <h1>포스트: {params.slug}</h1>
}
```

## 로딩 및 에러 처리

App Router는 특별한 파일명을 통해 로딩 상태와 에러 상태를 처리할 수 있습니다.

- `loading.tsx`: 로딩 UI
- `error.tsx`: 에러 UI
- `not-found.tsx`: 404 페이지

## 마무리

App Router는 Next.js의 미래이며, 현재 개발 중인 프로젝트라면 반드시 고려해야 할 기능입니다. 초기 학습 비용은 있지만, 더 나은 성능과 개발 경험을 제공합니다.

다음 포스트에서는 App Router의 고급 기능들에 대해 더 자세히 알아보겠습니다.