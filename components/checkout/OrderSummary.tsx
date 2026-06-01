'use client'
import { useState } from 'react'
import Image from 'next/image'
import { Tag, ChevronDown } from 'lucide-react'
import { useCart } from '@/components/cart/CartProvider'
import { toast } from 'react-hot-toast'

export function OrderSummary() {
  const { items, subtotal } = useCart()
  const [coupon, setCoupon] = useState('')
  const [discount, setDiscount] = useState(0)
  const [couponLoading, setCouponLoading] = useState(false)

  const shipping = subtotal >= 550 ? 0 : 15
  const tax = (subtotal - discount) * 0.05
  const total = subtotal - discount + shipping + tax

  const applyCoupon = async () => {
    if (!coupon.trim()) return
    setCouponLoading(true)
    try {
      const res = await fetch(`/api/coupons/validate?code=${coupon.toUpperCase()}&subtotal=${subtotal}`)
      const data = await res.json()
      if (data.valid) {
        setDiscount(data.discountAmount)
        toast.success(`Coupon applied: -QAR \${data.discountAmount.toFixed(0)}`)
      } else {
        toast.error(data.error ?? 'Invalid coupon')
      }
    } finally { setCouponLoading(false) }
  }

  return (
    <div className="lg:sticky lg:top-28">
      <div className="bg-[#141414] border border-[rgba(201,168,76,0.15)] p-6">
        <h2 className="font-display text-2xl font-light mb-6">Order Summary</h2>

        {/* Items */}
        <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-1">
          {items.map(item => {
            const img = item.product.images?.find(i => i.is_primary) ?? item.product.images?.[0]
            return (
              <div key={item.variant.id} className="flex gap-3">
                <div className="relative w-14 h-16 bg-[#1E1E1E] shrink-0 overflow-hidden">
                  {img ? (
                    <Image src={img.url} alt={item.product.name} fill className="object-cover" />
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center text-2xl">🫙</span>
                  )}
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#C9A84C] text-[#0A0A0A] text-[9px] font-bold rounded-full flex items-center justify-center">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] text-[#C9A84C] tracking-[1px]">{item.product.brand?.name}</p>
                  <p className="text-[11px] truncate">{item.product.name}</p>
                  <p className="text-[9px] text-[#5A5048]">{item.variant.size_ml}ml</p>
                </div>
                <p className="font-display text-base text-[#C9A84C] shrink-0">
                  ${(item.variant.price * item.quantity).toFixed(0)}
                </p>
              </div>
            )
          })}
        </div>

        {/* Coupon */}
        <div className="mb-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5A5048]" />
              <input
                value={coupon}
                onChange={e => setCoupon(e.target.value.toUpperCase())}
                placeholder="COUPON CODE"
                className="input-luxury w-full pl-8 text-[10px] tracking-[2px] py-3"
                onKeyDown={e => e.key === 'Enter' && applyCoupon()}
              />
            </div>
            <button
              onClick={applyCoupon}
              disabled={couponLoading}
              className="btn-outline-gold px-4 py-2 text-[9px] tracking-[1px] disabled:opacity-50"
            >
              Apply
            </button>
          </div>
        </div>

        {/* Totals */}
        <div className="space-y-3 border-t border-[rgba(201,168,76,0.1)] pt-4">
          <div className="flex justify-between text-[11px]">
            <span className="text-[#5A5048]">Subtotal ({items.reduce((s,i)=>s+i.quantity,0)} items)</span>
            <span>${subtotal.toFixed(0)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-[11px]">
              <span className="text-emerald-400">Discount</span>
              <span className="text-emerald-400">-${discount.toFixed(0)}</span>
            </div>
          )}
          <div className="flex justify-between text-[11px]">
            <span className="text-[#5A5048]">Shipping</span>
            <span className={shipping === 0 ? 'text-emerald-400' : ''}>{shipping === 0 ? 'Free' : `QAR ${shipping}`}</span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-[#5A5048]">VAT (5%)</span>
            <span>${tax.toFixed(0)}</span>
          </div>
          <div className="flex justify-between pt-3 border-t border-[rgba(201,168,76,0.1)]">
            <span className="text-[9px] tracking-[3px] uppercase">Total</span>
            <span className="font-display text-2xl text-[#C9A84C]">${total.toFixed(0)}</span>
          </div>
        </div>

        {/* Loyalty */}
        <div className="mt-4 p-3 bg-[rgba(201,168,76,0.05)] border border-[rgba(201,168,76,0.15)] flex items-center gap-2">
          <span className="text-[#C9A84C]">✦</span>
          <span className="text-[9px] text-[#6B5E4A]">
            You'll earn <span className="text-[#C9A84C]">{Math.floor(total * 10).toLocaleString()} loyalty points</span> on this order
          </span>
        </div>

        {/* Guarantees */}
        <div className="mt-4 space-y-2">
          {['100% Authentic guarantee', 'Free returns within 30 days', 'Secure 256-bit SSL checkout'].map(g => (
            <p key={g} className="text-[9px] text-[#3A3530] flex items-center gap-2">
              <span className="text-[#C9A84C]">✓</span> {g}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}
