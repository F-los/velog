import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Taewhei Kim - Backend Developer Portfolio',
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
    title: 'Taewhei Kim - Backend Developer Portfolio',
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
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}