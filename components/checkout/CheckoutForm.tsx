'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { CreditCard, Apple, Globe, DollarSign, Loader2 } from 'lucide-react'
import { useCart } from '@/components/cart/CartProvider'

const schema = z.object({
  email: z.string().email('Invalid email'),
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  phone: z.string().min(8, 'Required'),
  streetLine1: z.string().min(1, 'Required'),
  streetLine2: z.string().optional(),
  city: z.string().min(1, 'Required'),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().min(1, 'Required'),
  paymentMethod: z.enum(['credit_card','apple_pay','google_pay','paypal','cash_on_delivery']),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvc: z.string().optional(),
  couponCode: z.string().optional(),
})

type FormData = z.infer<typeof schema>

const PAYMENT_METHODS = [
  { id: 'credit_card' as const, label: 'Credit / Debit Card', icon: CreditCard },
  { id: 'apple_pay' as const, label: 'Apple Pay', icon: Apple },
  { id: 'paypal' as const, label: 'PayPal', icon: Globe },
  { id: 'cash_on_delivery' as const, label: 'Cash on Delivery', icon: DollarSign },
]

const inputCls = "w-full px-4 py-3 bg-white border border-[rgba(42,36,32,0.15)] text-[#2A2420] text-sm outline-none focus:border-[#C9A84C] transition-colors"
const labelCls = "text-[9px] tracking-[2px] uppercase text-[#6B5E4A] block mb-2 font-semibold"

export function CheckoutForm() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { items, clearCart, subtotal } = useCart()

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { paymentMethod: 'credit_card', country: 'QA' },
  })

  const paymentMethod = watch('paymentMethod')
  const shipping = subtotal >= 550 ? 0 : 55
  const total = subtotal + shipping

  const onSubmit = async (data: FormData) => {
    if (!items.length) { toast.error('Your cart is empty'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, items }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Order failed')
      }
      const { orderNumber } = await res.json()
      clearCart()
      router.push(`/checkout/confirmation?order=${orderNumber}`)
    } catch (e: any) {
      toast.error(e.message || 'Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Contact */}
      <section className="bg-white border border-[rgba(42,36,32,0.07)] p-6 shadow-sm">
        <h2 className="font-display text-2xl font-light text-[#2A2420] mb-6">Contact Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>First Name *</label>
            <input {...register('firstName')} className={inputCls} placeholder="Khalid" />
            {errors.firstName && <p className="text-[9px] text-red-500 mt-1">{errors.firstName.message}</p>}
          </div>
          <div>
            <label className={labelCls}>Last Name *</label>
            <input {...register('lastName')} className={inputCls} placeholder="Al-Rashid" />
          </div>
          <div className="col-span-2">
            <label className={labelCls}>Email Address *</label>
            <input {...register('email')} type="email" className={inputCls} placeholder="khalid@example.com" />
            {errors.email && <p className="text-[9px] text-red-500 mt-1">{errors.email.message}</p>}
          </div>
          <div className="col-span-2">
            <label className={labelCls}>Phone *</label>
            <input {...register('phone')} className={inputCls} placeholder="+974 XXXX XXXX" />
          </div>
        </div>
      </section>

      {/* Shipping */}
      <section className="bg-white border border-[rgba(42,36,32,0.07)] p-6 shadow-sm">
        <h2 className="font-display text-2xl font-light text-[#2A2420] mb-6">Delivery Address</h2>
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Street Address *</label>
            <input {...register('streetLine1')} className={inputCls} placeholder="Al Corniche Street" />
          </div>
          <div>
            <input {...register('streetLine2')} className={inputCls} placeholder="Apartment, floor (optional)" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>City *</label>
              <input {...register('city')} className={inputCls} placeholder="Doha" />
            </div>
            <div>
              <label className={labelCls}>Postal Code</label>
              <input {...register('postalCode')} className={inputCls} placeholder="00000" />
            </div>
          </div>
          <div>
            <label className={labelCls}>Country *</label>
            <select {...register('country')} className={inputCls}>
              <option value="QA">Qatar</option>
              <option value="AE">United Arab Emirates</option>
              <option value="SA">Saudi Arabia</option>
              <option value="KW">Kuwait</option>
              <option value="BH">Bahrain</option>
              <option value="OM">Oman</option>
            </select>
          </div>
        </div>
      </section>

      {/* Payment */}
      <section className="bg-white border border-[rgba(42,36,32,0.07)] p-6 shadow-sm">
        <h2 className="font-display text-2xl font-light text-[#2A2420] mb-6">Payment Method</h2>
        <div className="grid grid-cols-2 gap-3 mb-5">
          {PAYMENT_METHODS.map(({ id, label, icon: Icon }) => (
            <label key={id} className={`flex items-center gap-3 p-4 border cursor-pointer transition-all ${
              paymentMethod === id
                ? 'border-[#C9A84C] bg-[rgba(201,168,76,0.04)] text-[#C9A84C]'
                : 'border-[rgba(42,36,32,0.12)] text-[#6B5E4A] hover:border-[rgba(201,168,76,0.4)]'
            }`}>
              <input type="radio" {...register('paymentMethod')} value={id} className="sr-only" />
              <Icon size={16} />
              <span className="text-[10px] tracking-[0.5px]">{label}</span>
            </label>
          ))}
        </div>

        {paymentMethod === 'credit_card' && (
          <div className="space-y-3 p-4 bg-[#FAF8F5] border border-[rgba(42,36,32,0.07)]">
            <div>
              <label className={labelCls}>Card Number</label>
              <input {...register('cardNumber')} className={inputCls} placeholder="•••• •••• •••• ••••" maxLength={19} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Expiry (MM/YY)</label>
                <input {...register('cardExpiry')} className={inputCls} placeholder="MM / YY" maxLength={7} />
              </div>
              <div>
                <label className={labelCls}>CVC</label>
                <input {...register('cardCvc')} className={inputCls} placeholder="•••" maxLength={4} type="password" />
              </div>
            </div>
            <p className="text-[9px] text-[#9A8A7A] flex items-center gap-1.5">🔒 Secured by 256-bit SSL encryption</p>
          </div>
        )}
      </section>

      {/* Submit */}
      <button type="submit" disabled={loading}
        className="btn-dark w-full py-5 text-[10px] tracking-[3px] disabled:opacity-50 flex items-center justify-center gap-2">
        {loading && <Loader2 size={14} className="animate-spin" />}
        {loading ? 'Processing…' : `Place Order — QAR ${total.toFixed(0)}`}
      </button>

      <p className="text-center text-[9px] text-[#9A8A7A] tracking-[1px]">
        By placing your order, you agree to our Terms of Service and Privacy Policy
      </p>
    </form>
  )
}
