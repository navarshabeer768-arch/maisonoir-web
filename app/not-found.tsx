import Link from 'next/link'
import { Footer } from '@/components/layout/Footer'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col">
      <div className="h-[68px]" />
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center py-20">
        <p className="section-eyebrow mb-4">404</p>
        <h1 className="font-display text-6xl md:text-8xl font-light text-[#2A2420] mb-4">
          Page Not <em className="gold-text">Found</em>
        </h1>
        <p className="text-[11px] tracking-[2px] uppercase text-[#9A8A7A] mb-10 max-w-sm leading-[2]">
          The page you are looking for does not exist or has been moved
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link href="/shop" className="btn-dark px-8 py-3">Browse Collection</Link>
          <Link href="/" className="btn-outline-gold px-8 py-3">Go Home</Link>
        </div>
      </div>
      <Footer minimal />
    </div>
  )
}
