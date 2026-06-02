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
  openGraph: { type: 'website', siteName: 'Maison Noir' },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${cormorant.variable} ${montserrat.variable} font-body antialiased`}>
        <ThemeProvider>
          <QueryProvider>
            <CartProvider>
              <Navbar />
              <main>{children}</main>
              <Toaster
                position="bottom-center"
                toastOptions={{
                  style: {
                    background: '#2A2420',
                    color: '#E8D5A3',
                    border: '1px solid rgba(201,168,76,0.3)',
                    fontFamily: 'var(--font-montserrat)',
                    fontSize: '11px',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    borderRadius: '2px',
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
// Build: Tue Jun  2 18:03:37 UTC 2026
