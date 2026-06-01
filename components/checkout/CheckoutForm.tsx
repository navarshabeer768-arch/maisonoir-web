'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { CreditCard, Apple, Globe, DollarSign } from 'lucide-react'
import { useCart } from '@/components/cart/CartProvider'

const checkoutSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(1, 'First name required'),
  lastName: z.string().min(1, 'Last name required'),
  phone: z.string().min(8, 'Valid phone number required'),
  streetLine1: z.string().min(1, 'Street address required'),
  streetLine2: z.string().optional(),
  city: z.string().min(1, 'City required'),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().min(1, 'Country required'),
  paymentMethod: z.enum(['credit_card', 'apple_pay', 'google_pay', 'paypal', 'cash_on_delivery']),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvc: z.string().optional(),
  couponCode: z.string().optional(),
  saveAddress: z.boolean().optional(),
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

const PAYMENT_METHODS = [
  { id: 'credit_card' as const, label: 'Credit Card', icon: CreditCard },
  { id: 'apple_pay' as const, label: 'Apple Pay', icon: Apple },
  { id: 'paypal' as const, label: 'PayPal', icon: Globe },
  { id: 'cash_on_delivery' as const, label: 'Cash on Delivery', icon: DollarSign },
]

export function CheckoutForm() {
  const [loading, setLoading] = useState(false)
  const [couponApplied, setCouponApplied] = useState(false)
  const router = useRouter()
  const { items, clearCart, subtotal } = useCart()

  const { register, handleSubmit, watch, formState: { errors } } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { paymentMethod: 'credit_card', country: 'QA' },
  })

  const paymentMethod = watch('paymentMethod')

  const onSubmit = async (data: CheckoutFormData) => {
    if (items.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, items }),
      })

      if (!res.ok) throw new Error('Order failed')

      const { orderId, orderNumber } = await res.json()
      clearCart()
      router.push(`/checkout/confirmation?order=${orderNumber}`)
    } catch {
      toast.error('Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
      {/* Contact */}
      <section>
        <h2 className="font-display text-2xl font-light mb-6">Contact Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[9px] tracking-[2px] uppercase text-[#6B5E4A] block mb-2">First Name</label>
            <input {...register('firstName')} className="input-luxury w-full" placeholder="Khalid" />
            {errors.firstName && <p className="text-[9px] text-red-400 mt-1">{errors.firstName.message}</p>}
          </div>
          <div>
            <label className="text-[9px] tracking-[2px] uppercase text-[#6B5E4A] block mb-2">Last Name</label>
            <input {...register('lastName')} className="input-luxury w-full" placeholder="Al-Rashid" />
          </div>
        </div>
        <div className="mt-4">
          <label className="text-[9px] tracking-[2px] uppercase text-[#6B5E4A] block mb-2">Email Address</label>
          <input {...register('email')} type="email" className="input-luxury w-full" placeholder="khalid@example.com" />
          {errors.email && <p className="text-[9px] text-red-400 mt-1">{errors.email.message}</p>}
        </div>
        <div className="mt-4">
          <label className="text-[9px] tracking-[2px] uppercase text-[#6B5E4A] block mb-2">Phone</label>
          <input {...register('phone')} className="input-luxury w-full" placeholder="+974 XXXX XXXX" />
        </div>
      </section>

      {/* Shipping */}
      <section>
        <h2 className="font-display text-2xl font-light mb-6">Delivery Address</h2>
        <div>
          <label className="text-[9px] tracking-[2px] uppercase text-[#6B5E4A] block mb-2">Street Address</label>
          <input {...register('streetLine1')} className="input-luxury w-full" placeholder="Al Corniche Street" />
        </div>
        <div className="mt-4">
          <input {...register('streetLine2')} className="input-luxury w-full" placeholder="Apartment, suite, floor (optional)" />
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="text-[9px] tracking-[2px] uppercase text-[#6B5E4A] block mb-2">City</label>
            <input {...register('city')} className="input-luxury w-full" placeholder="Doha" />
          </div>
          <div>
            <label className="text-[9px] tracking-[2px] uppercase text-[#6B5E4A] block mb-2">Postal Code</label>
            <input {...register('postalCode')} className="input-luxury w-full" placeholder="00000" />
          </div>
        </div>
        <div className="mt-4">
          <label className="text-[9px] tracking-[2px] uppercase text-[#6B5E4A] block mb-2">Country</label>
          <select {...register('country')} className="input-luxury w-full">
            <option value="QA">Qatar</option>
            <option value="AE">United Arab Emirates</option>
            <option value="SA">Saudi Arabia</option>
            <option value="KW">Kuwait</option>
            <option value="BH">Bahrain</option>
            <option value="OM">Oman</option>
            <option value="US">United States</option>
            <option value="GB">United Kingdom</option>
            <option value="FR">France</option>
          </select>
        </div>
      </section>

      {/* Payment */}
      <section>
        <h2 className="font-display text-2xl font-light mb-6">Payment Method</h2>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {PAYMENT_METHODS.map(({ id, label, icon: Icon }) => (
            <label
              key={id}
              className={`flex items-center gap-3 p-4 border cursor-pointer transition-all duration-300 ${
                paymentMethod === id
                  ? 'border-[#C9A84C] bg-[rgba(201,168,76,0.08)] text-[#C9A84C]'
                  : 'border-[rgba(201,168,76,0.2)] text-[#6B5E4A] hover:border-[rgba(201,168,76,0.4)]'
              }`}
            >
              <input type="radio" {...register('paymentMethod')} value={id} className="sr-only" />
              <Icon size={16} />
              <span className="text-[10px] tracking-[1px]">{label}</span>
            </label>
          ))}
        </div>

        {paymentMethod === 'credit_card' && (
          <div className="space-y-4">
            <div>
              <label className="text-[9px] tracking-[2px] uppercase text-[#6B5E4A] block mb-2">Card Number</label>
              <input {...register('cardNumber')} className="input-luxury w-full" placeholder="•••• •••• •••• ••••" maxLength={19} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[9px] tracking-[2px] uppercase text-[#6B5E4A] block mb-2">Expiry</label>
                <input {...register('cardExpiry')} className="input-luxury w-full" placeholder="MM / YY" maxLength={7} />
              </div>
              <div>
                <label className="text-[9px] tracking-[2px] uppercase text-[#6B5E4A] block mb-2">CVC</label>
                <input {...register('cardCvc')} className="input-luxury w-full" placeholder="•••" maxLength={4} type="password" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-[9px] text-[#5A5048] mt-2">
              <span>🔒</span>
              <span>Secured by 256-bit SSL encryption · PCI DSS compliant</span>
            </div>
          </div>
        )}
      </section>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="btn-gold w-full py-5 text-[10px] tracking-[4px] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : `Place Order — $${(subtotal >= 150 ? subtotal : subtotal + 15).toFixed(0)}`}
      </button>

      <p className="text-center text-[9px] text-[#5A5048] tracking-[1px]">
        By placing your order, you agree to our Terms of Service and Privacy Policy
      </p>
    </form>
  )
}
