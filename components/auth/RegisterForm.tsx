'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'react-hot-toast'
import { Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const schema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'At least 8 characters'),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine(v => v, 'You must accept the terms'),
}).refine(d => d.password === d.confirmPassword, { message: "Passwords don't match", path: ['confirmPassword'] })

type RegisterData = z.infer<typeof schema>

export function RegisterForm() {
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterData>({ resolver: zodResolver(schema) })

  const onSubmit = async ({ email, password, firstName, lastName }: RegisterData) => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { data: { first_name: firstName, last_name: lastName } },
      })
      if (error) { toast.error(error.message); return }
      toast.success('Account created! Check your email to verify.')
      router.push('/auth/login?message=Please check your email to verify your account.')
    } finally { setLoading(false) }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
      <div>
        <label className="text-[9px] tracking-[2px] uppercase text-[#6B5E4A] block mb-2">Email</label>
        <input {...register('email')} type="email" className="input-luxury w-full" placeholder="you@example.com" />
        {errors.email && <p className="text-[9px] text-red-400 mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <label className="text-[9px] tracking-[2px] uppercase text-[#6B5E4A] block mb-2">Password</label>
        <div className="relative">
          <input {...register('password')} type={showPw ? 'text' : 'password'} className="input-luxury w-full pr-12" placeholder="Min 8 characters" />
          <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5A5048] hover:text-[#C9A84C]">
            {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
        {errors.password && <p className="text-[9px] text-red-400 mt-1">{errors.password.message}</p>}
      </div>
      <div>
        <label className="text-[9px] tracking-[2px] uppercase text-[#6B5E4A] block mb-2">Confirm Password</label>
        <input {...register('confirmPassword')} type="password" className="input-luxury w-full" placeholder="Repeat password" />
        {errors.confirmPassword && <p className="text-[9px] text-red-400 mt-1">{errors.confirmPassword.message}</p>}
      </div>
      <div className="flex items-start gap-3 mt-2">
        <input {...register('acceptTerms')} type="checkbox" className="mt-0.5 accent-[#C9A84C]" />
        <label className="text-[10px] text-[#5A5048] leading-relaxed">
          I agree to the <a href="/terms" className="text-[#C9A84C] hover:underline">Terms of Service</a> and <a href="/privacy" className="text-[#C9A84C] hover:underline">Privacy Policy</a>
        </label>
      </div>
      {errors.acceptTerms && <p className="text-[9px] text-red-400">{errors.acceptTerms.message}</p>}
      <button type="submit" disabled={loading} className="btn-gold w-full py-4 mt-2 disabled:opacity-50">
        {loading ? 'Creating account...' : 'Create Account'}
      </button>
    </form>
  )
}
