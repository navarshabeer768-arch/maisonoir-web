import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Montserrat } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { QueryProvider } from '@/components/layout/QueryProvider'
import { CartProvider } from '@/components/cart/CartProvider'
import { Navbar } from '@/components/layout/Navbar'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600'],
  variable: '--font-montserrat',
  display: 'swap',
})

export const metadata: Metadata = {
  title: { default: 'Maison Noir — Luxury Perfumes', template: '%s | Maison Noir' },
  description: 'A sanctuary for those who understand that the finest fragrances are not merely worn — they are experienced.',
  keywords: ['luxury perfume', 'niche fragrance', 'arabic perfume', 'oud', 'premium cologne'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://maisonoir.com',
    siteName: 'Maison Noir',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', site: '@maisonoir' },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0A' },
    { media: '(prefers-color-scheme: light)', color: '#FAFAF7' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${cormorant.variable} ${montserrat.variable} font-body antialiased bg-obsidian dark:bg-obsidian`}>
        <ThemeProvider>
          <QueryProvider>
            <CartProvider>
              <Navbar />
              <main>{children}</main>
              <Toaster
                position="bottom-center"
                toastOptions={{
                  style: {
                    background: '#1E1E1E',
                    color: '#C9A84C',
                    border: '1px solid rgba(201,168,76,0.3)',
                    fontFamily: 'var(--font-montserrat)',
                    fontSize: '11px',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    borderRadius: '0',
                  },
                }}
              />
            </CartProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
