import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Hawkkeyed - AI Automation System',
  description: 'AI-powered automation workflows with sharp vision and precise execution',
  icons: {
    icon: [
      {
        url: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2306b6d4"><path d="M12 2C10.9 2 10 2.9 10 4C10 4.7 10.4 5.4 11 5.7V7C11 7 9.5 7.5 8.5 9C7.5 10.5 7 13 7 13H5C4.4 13 4 13.4 4 14C4 14.6 4.4 15 5 15H7C7 15 7.5 17.5 8.5 19C9.5 20.5 11 21 11 21V22.3C10.4 22.6 10 23.3 10 24H14C14 23.3 13.6 22.6 13 22.3V21C13 21 14.5 20.5 15.5 19C16.5 17.5 17 15 17 15H19C19.6 15 20 14.6 20 14C20 13.4 19.6 13 19 13H17C17 13 16.5 10.5 15.5 9C14.5 7.5 13 7 13 7V5.7C13.6 5.4 14 4.7 14 4C14 2.9 13.1 2 12 2M12 4.5C12.3 4.5 12.5 4.7 12.5 5C12.5 5.3 12.3 5.5 12 5.5C11.7 5.5 11.5 5.3 11.5 5C11.5 4.7 11.7 4.5 12 4.5Z"/></svg>',
        type: 'image/svg+xml',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-white antialiased">{children}</body>
    </html>
  )
}
