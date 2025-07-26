import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { SEO_DEFAULTS } from '@/lib/constants'
import { ToastProvider } from '@/components/ui/Toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: SEO_DEFAULTS.TITLE,
    template: `%s | ${SEO_DEFAULTS.SITE_NAME}`
  },
  description: SEO_DEFAULTS.DESCRIPTION,
  keywords: SEO_DEFAULTS.KEYWORDS,
  authors: [{ name: SEO_DEFAULTS.SITE_NAME }],
  creator: SEO_DEFAULTS.SITE_NAME,
  publisher: SEO_DEFAULTS.SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    siteName: SEO_DEFAULTS.SITE_NAME,
    title: SEO_DEFAULTS.TITLE,
    description: SEO_DEFAULTS.DESCRIPTION,
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: SEO_DEFAULTS.SITE_NAME,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: SEO_DEFAULTS.TWITTER_HANDLE,
    creator: SEO_DEFAULTS.TWITTER_HANDLE,
    title: SEO_DEFAULTS.TITLE,
    description: SEO_DEFAULTS.DESCRIPTION,
    images: ['/images/og-image.jpg'],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      
      <body className={`${inter.className} antialiased bg-gray-50 dark:bg-blue-900`}>
        <ToastProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
        </ToastProvider>
        {process.env.NODE_ENV === 'production' && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                // Analytics initialization can go here
                // Example: Google Analytics, Mixpanel, etc.
              `,
            }}
          />
        )}
      </body>
    </html>
  )
}