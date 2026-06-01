import type { Metadata } from 'next'
import { CheckoutForm } from '@/components/checkout/CheckoutForm'
import { OrderSummary } from '@/components/checkout/OrderSummary'
import { Footer } from '@/components/layout/Footer'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Secure Checkout',
  robots: { index: false },
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen">
      <div className="h-[72px]" />

      {/* Header */}
      <div className="px-6 md:px-12 py-8 border-b border-[rgba(201,168,76,0.1)]">
        <p className="section-eyebrow">Secure Checkout</p>
        <h1 className="font-display text-4xl md:text-5xl font-light">
          Complete Your <em className="gold-text">Order</em>
        </h1>
        <div className="flex items-center gap-4 mt-4">
          {['Contact', 'Shipping', 'Payment', 'Review'].map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] ${
                i === 0 ? 'bg-[#C9A84C] text-[#0A0A0A]' : 'border border-[rgba(201,168,76,0.3)] text-[#6B5E4A]'
              }`}>{i + 1}</div>
              <span className={`text-[9px] tracking-[1px] uppercase hidden sm:block ${
                i === 0 ? 'text-[#C9A84C]' : 'text-[#5A5048]'
              }`}>{step}</span>
              {i < 3 && <span className="text-[#3A3A3A]">—</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-10 grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12">
        <CheckoutForm />
        <OrderSummary />
      </div>

      <Footer minimal />
    </div>
  )
}
