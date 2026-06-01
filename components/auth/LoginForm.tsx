'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'react-hot-toast'
import { Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginData = z.infer<typeof loginSchema>

interface LoginFormProps { redirectTo: string }

export function LoginForm({ redirectTo }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const { register, handleSubmit, formState: { errors } } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async ({ email, password }: LoginData) => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        toast.error(error.message)
        return
      }
      toast.success('Welcome back ✦')
      router.push(redirectTo)
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback?redirect=${redirectTo}` },
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="text-[9px] tracking-[2px] uppercase text-[#6B5E4A] block mb-2">Email Address</label>
        <input
          {...register('email')}
          type="email"
          className="input-luxury w-full"
          placeholder="your@email.com"
          autoComplete="email"
        />
        {errors.email && <p className="text-[9px] text-red-400 mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label className="text-[9px] tracking-[2px] uppercase text-[#6B5E4A] block mb-2">Password</label>
        <div className="relative">
          <input
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            className="input-luxury w-full pr-12"
            placeholder="••••••••"
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5A5048] hover:text-[#C9A84C] transition-colors"
          >
            {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
        {errors.password && <p className="text-[9px] text-red-400 mt-1">{errors.password.message}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-gold w-full py-4 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>

      <div className="relative flex items-center gap-4 my-2">
        <div className="flex-1 h-px bg-[rgba(201,168,76,0.1)]" />
        <span className="text-[9px] tracking-[2px] uppercase text-[#3A3530]">or</span>
        <div className="flex-1 h-px bg-[rgba(201,168,76,0.1)]" />
      </div>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        className="btn-outline-gold w-full py-4 flex items-center justify-center gap-3"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continue with Google
      </button>
    </form>
  )
}
