import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { BottomNavigation } from '@/components/BottomNavigation'
import { PWAProvider } from '@/components/PWAProvider'
import { AuthProvider } from '@/components/AuthProvider'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Barakah Lanterns - Spiritual Wellness',
  description: 'Release your intentions into the universe with Barakah Lanterns. A mindful space for reflection, journaling, and emotional wellness.',
  generator: 'v0.app',
  applicationName: 'Barakah Lanterns',
  authors: [{ name: 'Barakah' }],
  keywords: ['wellness', 'mindfulness', 'journaling', 'intentions', 'meditation', 'spiritual'],
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0a1428',
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-background text-foreground">
        <AuthProvider>
          <PWAProvider />
          <main className="pb-24">
            {children}
          </main>
          <BottomNavigation />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
