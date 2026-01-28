import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { QueryProvider } from '@/lib/providers'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'AI Lake Guardian | Udaipur',
  description:
    'AI-powered early warning system for lake health monitoring and prediction in Udaipur',
  keywords: [
    'lake monitoring',
    'AI',
    'environmental',
    'Udaipur',
    'water quality',
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} dark`}
    >
      <body className="antialiased bg-background text-foreground min-h-screen">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}
