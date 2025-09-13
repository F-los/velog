import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '김태회 - 백엔드 개발자 포트폴리오',
  description: '확장 가능하고 안정적인 백엔드 시스템을 만드는 개발자 김태회의 포트폴리오입니다.',
  keywords: ['백엔드', '개발자', '포트폴리오', 'Java', 'Spring Boot', 'Python', 'Node.js', 'AWS'],
  authors: [{ name: '김태회' }],
  openGraph: {
    title: '김태회 - 백엔드 개발자 포트폴리오',
    description: '확장 가능하고 안정적인 백엔드 시스템을 만드는 개발자',
    type: 'website',
    locale: 'ko_KR',
  },
  twitter: {
    card: 'summary_large_image',
    title: '김태회 - 백엔드 개발자 포트폴리오',
    description: '확장 가능하고 안정적인 백엔드 시스템을 만드는 개발자',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className="scroll-smooth">
      <body className="font-sans antialiased bg-white text-gray-900">
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}