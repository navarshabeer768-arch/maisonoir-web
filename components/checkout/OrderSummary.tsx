'use client'
import { useState } from 'react'
import Image from 'next/image'
import { Tag } from 'lucide-react'
import { useCart } from '@/components/cart/CartProvider'
import { toast } from 'react-hot-toast'

function qar(n: number) { return `QAR ${n.toLocaleString('en', { minimumFractionDigits: 0 })}` }

export function OrderSummary() {
  const { items, subtotal } = useCart()
  const [coupon, setCoupon] = useState('')
  const [discount, setDiscount] = useState(0)

  const shipping = subtotal >= 550 ? 0 : 55
  const tax = (subtotal - discount) * 0.05
  const total = subtotal - discount + shipping + tax

  const applyCoupon = async () => {
    if (!coupon.trim()) return
    toast.error('Invalid coupon code')
  }

  return (
    <div className="lg:sticky lg:top-28">
      <div className="bg-white border border-[rgba(42,36,32,0.08)] shadow-sm p-6">
        <h2 className="font-display text-2xl font-light text-[#2A2420] mb-6">Order Summary</h2>

        {/* Items */}
        <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
          {items.map(item => {
            const img = item.product.images?.find(i => i.is_primary) ?? item.product.images?.[0]
            return (
              <div key={item.variant.id} className="flex gap-3">
                <div className="relative w-14 h-16 bg-[#F5F0E8] shrink-0 overflow-hidden">
                  {img ? (
                    <Image src={img.url} alt={item.product.name} fill className="object-cover" />
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center text-2xl">🫙</span>
                  )}
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#C9A84C] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] text-[#C9A84C] font-semibold tracking-[1px]">{(item.product as any).brand?.name}</p>
                  <p className="text-[12px] text-[#2A2420] truncate">{item.product.name}</p>
                  <p className="text-[9px] text-[#9A8A7A]">{item.variant.size_ml}ml</p>
                </div>
                <p className="font-display text-base text-[#2A2420] shrink-0">
                  {qar(item.variant.price * item.quantity)}
                </p>
              </div>
            )
          })}
        </div>

        {/* Coupon */}
        <div className="mb-5">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A8A7A]" />
              <input value={coupon} onChange={e => setCoupon(e.target.value.toUpperCase())}
                placeholder="COUPON CODE" onKeyDown={e => e.key === 'Enter' && applyCoupon()}
                className="w-full pl-8 pr-3 py-3 bg-[#FAF8F5] border border-[rgba(42,36,32,0.12)] text-[10px] tracking-[2px] outline-none focus:border-[#C9A84C] transition-colors text-[#2A2420]" />
            </div>
            <button onClick={applyCoupon}
              className="btn-outline-gold px-4 py-2 text-[9px]">Apply</button>
          </div>
        </div>

        {/* Totals */}
        <div className="space-y-3 border-t border-[rgba(42,36,32,0.08)] pt-4">
          <div className="flex justify-between text-[12px] text-[#6B5E4A]">
            <span>Subtotal ({items.reduce((s,i) => s+i.quantity,0)} items)</span>
            <span className="text-[#2A2420]">{qar(subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-[12px]">
              <span className="text-emerald-600">Discount</span>
              <span className="text-emerald-600">-{qar(discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-[12px] text-[#6B5E4A]">
            <span>Shipping</span>
            <span className={shipping === 0 ? 'text-emerald-600 font-medium' : 'text-[#2A2420]'}>
              {shipping === 0 ? 'Free' : qar(shipping)}
            </span>
          </div>
          <div className="flex justify-between text-[12px] text-[#6B5E4A]">
            <span>VAT (5%)</span>
            <span className="text-[#2A2420]">{qar(tax)}</span>
          </div>
          <div className="flex justify-between pt-3 border-t border-[rgba(42,36,32,0.08)]">
            <span className="text-[9px] tracking-[3px] uppercase font-semibold text-[#2A2420]">Total</span>
            <span className="font-display text-2xl text-[#2A2420]">{qar(total)}</span>
          </div>
        </div>

        {/* Loyalty */}
        <div className="mt-4 p-3 bg-[rgba(201,168,76,0.06)] border border-[rgba(201,168,76,0.2)] flex items-center gap-2">
          <span className="text-[#C9A84C]">✦</span>
          <span className="text-[9px] text-[#6B5E4A]">
            Earn <span className="text-[#C9A84C] font-semibold">{Math.floor(total * 10).toLocaleString()} loyalty points</span> on this order
          </span>
        </div>

        {/* Guarantees */}
        <div className="mt-4 space-y-2">
          {['100% Authentic guarantee','Free returns within 30 days','Secure SSL checkout'].map(g => (
            <p key={g} className="text-[9px] text-[#9A8A7A] flex items-center gap-2">
              <span className="text-[#C9A84C]">✓</span> {g}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}
