import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Project HawkkEyed - AI Automation System',
  description: 'AI-powered automation workflows with sharp vision and precise execution',
  icons: {
    icon: '/logo.jpg',
    apple: '/logo.jpg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-50 dark:bg-[#0B0F19] text-gray-900 dark:text-white antialiased transition-colors duration-300`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
