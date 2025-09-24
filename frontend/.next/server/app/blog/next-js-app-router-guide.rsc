2:I[1344,["518","static/chunks/518-db630b946e945006.js","481","static/chunks/481-ca005a81abcbc31c.js","308","static/chunks/app/blog/%5Bslug%5D/page-37a42aab115435ff.js"],"default"]
4:I[893,["518","static/chunks/518-db630b946e945006.js","481","static/chunks/481-ca005a81abcbc31c.js","308","static/chunks/app/blog/%5Bslug%5D/page-37a42aab115435ff.js"],"default"]
6:I[4297,["518","static/chunks/518-db630b946e945006.js","481","static/chunks/481-ca005a81abcbc31c.js","308","static/chunks/app/blog/%5Bslug%5D/page-37a42aab115435ff.js"],"default"]
7:I[4707,[],""]
9:I[6423,[],""]
a:I[8596,["185","static/chunks/app/layout-638026d7477e3733.js"],"LanguageProvider"]
3:Tb59,<br/># Next.js App Router 완벽 가이드<br/><br/>Next.js 13에서 가장 큰 변화 중 하나는 바로 **App Router**의 도입입니다. 기존의 Pages Router와는 완전히 다른 방식으로 라우팅을 처리하며, React 18의 새로운 기능들을 완벽하게 활용할 수 있도록 설계되었습니다.<br/><br/>## App Router란?<br/><br/>App Router는 React의 Server Components, Suspense, Streaming 등의 최신 기능을 기반으로 구축된 새로운 라우팅 시스템입니다. 파일 기반 라우팅을 유지하면서도 더욱 직관적이고 강력한 기능들을 제공합니다.<br/><br/>### 주요 특징<br/><br/>1. **Server Components 기본 지원**<br/>   - 서버에서 렌더링되는 컴포넌트<br/>   - 더 빠른 초기 로딩 시간<br/>   - SEO 최적화<br/><br/>2. **중첩 라우팅**<br/>   - 복잡한 UI 구조를 쉽게 구현<br/>   - Layout 컴포넌트를 통한 일관된 UI<br/><br/>3. **Streaming**<br/>   - 점진적으로 UI를 렌더링<br/>   - 사용자 경험 개선<br/><br/>## 기본 구조<br/><br/>```<br/>app/<br/>  layout.tsx      # 루트 레이아웃<br/>  page.tsx        # 홈 페이지<br/>  about/<br/>    page.tsx      # /about 페이지<br/>  blog/<br/>    layout.tsx    # 블로그 레이아웃<br/>    page.tsx      # /blog 페이지<br/>    [slug]/<br/>      page.tsx    # /blog/[slug] 페이지<br/>```<br/><br/>## 레이아웃 컴포넌트<br/><br/>레이아웃 컴포넌트는 여러 페이지에서 공통으로 사용되는 UI를 정의합니다.<br/><br/>```tsx<br/>// app/layout.tsx<br/>export default function RootLayout({<br/>  children,<br/>}: {<br/>  children: React.ReactNode<br/>}) {<br/>  return (<br/>    <html lang="ko"><br/>      <body><br/>        <header>공통 헤더</header><br/>        {children}<br/>        <footer>공통 푸터</footer><br/>      </body><br/>    </html><br/>  )<br/>}<br/>```<br/><br/>## 동적 라우팅<br/><br/>대괄호를 사용하여 동적 라우팅을 구현할 수 있습니다.<br/><br/>```tsx<br/>// app/blog/[slug]/page.tsx<br/>export default function BlogPost({ params }: { params: { slug: string } }) {<br/>  return <h1>포스트: {params.slug}</h1><br/>}<br/>```<br/><br/>## 로딩 및 에러 처리<br/><br/>App Router는 특별한 파일명을 통해 로딩 상태와 에러 상태를 처리할 수 있습니다.<br/><br/>- `loading.tsx`: 로딩 UI<br/>- `error.tsx`: 에러 UI<br/>- `not-found.tsx`: 404 페이지<br/><br/>## 마무리<br/><br/>App Router는 Next.js의 미래이며, 현재 개발 중인 프로젝트라면 반드시 고려해야 할 기능입니다. 초기 학습 비용은 있지만, 더 나은 성능과 개발 경험을 제공합니다.<br/><br/>다음 포스트에서는 App Router의 고급 기능들에 대해 더 자세히 알아보겠습니다.5:Ta05,
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

다음 포스트에서는 App Router의 고급 기능들에 대해 더 자세히 알아보겠습니다.8:["slug","next-js-app-router-guide","d"]
0:["LVJTgUx6v-YtLkV2Xcfge",[[["",{"children":["blog",{"children":[["slug","next-js-app-router-guide","d"],{"children":["__PAGE__?{\"slug\":\"next-js-app-router-guide\"}",{}]}]}]},"$undefined","$undefined",true],["",{"children":["blog",{"children":[["slug","next-js-app-router-guide","d"],{"children":["__PAGE__",{},[["$L1",["$","div",null,{"className":"bg-gray-50 min-h-screen","children":[["$","$L2",null,{}],["$","main",null,{"className":"pt-20","children":[["$","section",null,{"className":"bg-white","children":["$","div",null,{"className":"max-w-4xl mx-auto px-4 py-12","children":["$","div",null,{"children":[["$","a",null,{"href":"/blog","className":"inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-8","children":[["$","svg",null,{"xmlns":"http://www.w3.org/2000/svg","width":20,"height":20,"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":2,"strokeLinecap":"round","strokeLinejoin":"round","className":"lucide lucide-arrow-left","children":[["$","path","1l729n",{"d":"m12 19-7-7 7-7"}],["$","path","x3x0zl",{"d":"M19 12H5"}],"$undefined"]}],"블로그로 돌아가기"]}],["$","div",null,{"className":"mb-6","children":["$","span",null,{"className":"px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium","children":"Frontend"}]}],["$","h1",null,{"className":"text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight","children":"Next.js App Router 완벽 가이드"}],["$","div",null,{"className":"flex flex-wrap items-center gap-6 text-gray-600 mb-8","children":[["$","div",null,{"className":"flex items-center gap-2","children":[["$","img",null,{"src":"https://via.placeholder.com/40x40","alt":"김태회","className":"w-10 h-10 rounded-full"}],["$","span",null,{"className":"font-medium","children":"김태회"}]]}],["$","div",null,{"className":"flex items-center gap-1","children":[["$","svg",null,{"xmlns":"http://www.w3.org/2000/svg","width":16,"height":16,"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":2,"strokeLinecap":"round","strokeLinejoin":"round","className":"lucide lucide-calendar","children":[["$","rect","eu3xkr",{"width":"18","height":"18","x":"3","y":"4","rx":"2","ry":"2"}],["$","line","m3sa8f",{"x1":"16","x2":"16","y1":"2","y2":"6"}],["$","line","18kwsl",{"x1":"8","x2":"8","y1":"2","y2":"6"}],["$","line","xt86sb",{"x1":"3","x2":"21","y1":"10","y2":"10"}],"$undefined"]}],"2024년 1월 15일"]}],["$","div",null,{"className":"flex items-center gap-1","children":[["$","svg",null,{"xmlns":"http://www.w3.org/2000/svg","width":16,"height":16,"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":2,"strokeLinecap":"round","strokeLinejoin":"round","className":"lucide lucide-clock","children":[["$","circle","1mglay",{"cx":"12","cy":"12","r":"10"}],["$","polyline","68esgv",{"points":"12 6 12 12 16 14"}],"$undefined"]}],"3 min read"]}]]}],["$","div",null,{"className":"aspect-video mb-8 rounded-lg overflow-hidden","children":["$","img",null,{"src":"/blog/nextjs-app-router.jpg","alt":"Next.js App Router 완벽 가이드","className":"w-full h-full object-cover"}]}]]}]}]}],["$","section",null,{"className":"bg-white","children":["$","div",null,{"className":"max-w-4xl mx-auto px-4 pb-12","children":[["$","div",null,{"className":"prose prose-lg max-w-none   prose-headings:text-gray-900   prose-p:text-gray-700 prose-p:leading-relaxed   prose-a:text-purple-600 prose-a:no-underline hover:prose-a:underline   prose-strong:text-gray-900   prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded   prose-pre:bg-gray-900 prose-pre:text-gray-100","dangerouslySetInnerHTML":{"__html":"$3"}}],["$","div",null,{"className":"flex flex-wrap gap-2 mt-12 pt-8 border-t border-gray-200","children":[["$","span","Next.js",{"className":"inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm","children":[["$","svg",null,{"xmlns":"http://www.w3.org/2000/svg","width":14,"height":14,"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":2,"strokeLinecap":"round","strokeLinejoin":"round","className":"lucide lucide-tag","children":[["$","path","14b2ls",{"d":"M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"}],["$","path","7u93v4",{"d":"M7 7h.01"}],"$undefined"]}],"Next.js"]}],["$","span","React",{"className":"inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm","children":[["$","svg",null,{"xmlns":"http://www.w3.org/2000/svg","width":14,"height":14,"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":2,"strokeLinecap":"round","strokeLinejoin":"round","className":"lucide lucide-tag","children":[["$","path","14b2ls",{"d":"M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"}],["$","path","7u93v4",{"d":"M7 7h.01"}],"$undefined"]}],"React"]}],["$","span","TypeScript",{"className":"inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm","children":[["$","svg",null,{"xmlns":"http://www.w3.org/2000/svg","width":14,"height":14,"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":2,"strokeLinecap":"round","strokeLinejoin":"round","className":"lucide lucide-tag","children":[["$","path","14b2ls",{"d":"M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"}],["$","path","7u93v4",{"d":"M7 7h.01"}],"$undefined"]}],"TypeScript"]}]]}],["$","$L4",null,{"post":{"slug":"next-js-app-router-guide","title":"Next.js App Router 완벽 가이드","excerpt":"Next.js 13에서 도입된 App Router의 주요 특징과 사용법을 자세히 알아보겠습니다.","content":"$5","date":"2024-01-15","author":"김태회","category":"Frontend","tags":["Next.js","React","TypeScript"],"readingTime":"3 min read","image":"/blog/nextjs-app-router.jpg"}}]]}]}],["$","section",null,{"id":"comments","className":"bg-gray-50","children":["$","div",null,{"className":"max-w-4xl mx-auto px-4 py-12","children":["$","$L6",null,{"postSlug":"next-js-app-router-guide"}]}]}]]}]]}],null],null],null]},[null,["$","$L7",null,{"parallelRouterKey":"children","segmentPath":["children","blog","children","$8","children"],"error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L9",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":"$undefined","notFoundStyles":"$undefined"}]],null]},[null,["$","$L7",null,{"parallelRouterKey":"children","segmentPath":["children","blog","children"],"error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L9",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":"$undefined","notFoundStyles":"$undefined"}]],null]},[[[["$","link","0",{"rel":"stylesheet","href":"/_next/static/css/d94babb66ce58f09.css","precedence":"next","crossOrigin":"$undefined"}]],["$","html",null,{"lang":"en","className":"scroll-smooth","children":["$","body",null,{"className":"font-sans antialiased bg-white text-gray-900","children":["$","$La",null,{"children":["$","div",null,{"className":"min-h-screen","children":["$","$L7",null,{"parallelRouterKey":"children","segmentPath":["children"],"error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L9",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":[["$","title",null,{"children":"404: This page could not be found."}],["$","div",null,{"style":{"fontFamily":"system-ui,\"Segoe UI\",Roboto,Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\"","height":"100vh","textAlign":"center","display":"flex","flexDirection":"column","alignItems":"center","justifyContent":"center"},"children":["$","div",null,{"children":[["$","style",null,{"dangerouslySetInnerHTML":{"__html":"body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}@media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}"}}],["$","h1",null,{"className":"next-error-h1","style":{"display":"inline-block","margin":"0 20px 0 0","padding":"0 23px 0 0","fontSize":24,"fontWeight":500,"verticalAlign":"top","lineHeight":"49px"},"children":"404"}],["$","div",null,{"style":{"display":"inline-block"},"children":["$","h2",null,{"style":{"fontSize":14,"fontWeight":400,"lineHeight":"49px","margin":0},"children":"This page could not be found."}]}]]}]}]],"notFoundStyles":[]}]}]}]}]}]],null],null],["$Lb",null]]]]
b:[["$","meta","0",{"name":"viewport","content":"width=device-width, initial-scale=1"}],["$","meta","1",{"charSet":"utf-8"}],["$","title","2",{"children":"Taehoe Kim - Backend Developer Portfolio"}],["$","meta","3",{"name":"description","content":"Portfolio of Taehoe Kim, a developer who loves building scalable and reliable backend systems."}],["$","meta","4",{"name":"author","content":"Taehoe Kim"}],["$","meta","5",{"name":"keywords","content":"backend,developer,portfolio,Java,Spring Boot,Python,Node.js,AWS"}],["$","meta","6",{"property":"og:title","content":"Taehoe Kim - Backend Developer Portfolio"}],["$","meta","7",{"property":"og:description","content":"A developer who loves building scalable and reliable backend systems"}],["$","meta","8",{"property":"og:locale","content":"en_US"}],["$","meta","9",{"property":"og:type","content":"website"}],["$","meta","10",{"name":"twitter:card","content":"summary_large_image"}],["$","meta","11",{"name":"twitter:title","content":"Taehoe Kim - Backend Developer Portfolio"}],["$","meta","12",{"name":"twitter:description","content":"A developer who loves building scalable and reliable backend systems"}]]
1:null
