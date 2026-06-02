import Link from 'next/link'
import { Footer } from '@/components/layout/Footer'
export const dynamic = 'force-dynamic'

interface Props { searchParams: Promise<{ order?: string }> }

export default async function ConfirmationPage({ searchParams }: Props) {
  const { order } = await searchParams
  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <div className="h-[68px]" />
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="section-eyebrow mb-3">Order Confirmed</p>
        <h1 className="font-display text-5xl font-light text-[#2A2420] mb-4">
          Thank You <em className="gold-text">✦</em>
        </h1>
        {order && (
          <p className="text-[11px] tracking-[2px] uppercase text-[#9A8A7A] mb-2">
            Order Number: <span className="text-[#C9A84C] font-semibold">{order}</span>
          </p>
        )}
        <p className="text-[12px] text-[#6B5E4A] mb-10 leading-relaxed max-w-sm mx-auto">
          Your order has been placed successfully. You will receive a confirmation email shortly.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/account/orders" className="btn-dark px-8 py-3">View My Orders</Link>
          <Link href="/shop" className="btn-outline-gold px-8 py-3">Continue Shopping</Link>
        </div>
      </div>
      <Footer minimal />
    </div>
  )
}
