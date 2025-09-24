import type { Metadata } from 'next'
import './globals.css'
import { LanguageProvider } from '@/contexts/LanguageContext'

export const metadata: Metadata = {
  title: 'Taehoe Kim - Backend Developer Portfolio',
  description: 'Portfolio of Taehoe Kim, a developer who loves building scalable and reliable backend systems.',
  keywords: ['backend', 'developer', 'portfolio', 'Java', 'Spring Boot', 'Python', 'Node.js', 'AWS'],
  authors: [{ name: 'Taehoe Kim' }],
  openGraph: {
    title: 'Taehoe Kim - Backend Developer Portfolio',
    description: 'A developer who loves building scalable and reliable backend systems',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Taehoe Kim - Backend Developer Portfolio',
    description: 'A developer who loves building scalable and reliable backend systems',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-sans antialiased bg-white text-gray-900">
        <LanguageProvider>
          <div className="min-h-screen">
            {children}
          </div>
        </LanguageProvider>
      </body>
    </html>
  )
}