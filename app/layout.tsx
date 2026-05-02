import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Tangerine, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/lib/auth/auth-context'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
})

const tangerine = Tangerine({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-script',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Elena & Sofia | Our Wedding',
  description: 'Celebrate love, unity, and the beginning of forever. Join us in commemorating the most beautiful day of our lives.',
  keywords: ['wedding', 'love story', 'celebration', 'Elena', 'Sofia'],
  authors: [{ name: 'Elena & Sofia' }],
  openGraph: {
    title: 'Elena & Sofia | Our Wedding',
    description: 'Celebrate love, unity, and the beginning of forever.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#1a1a1a',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${tangerine.variable} ${inter.variable}`}>
      <body className="font-serif antialiased bg-background text-foreground min-h-screen">
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
