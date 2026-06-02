'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'react-hot-toast'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })
      if (error) { toast.error(error.message); return }
      setSent(true)
      toast.success('Reset email sent!')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,168,76,0.06)_0%,transparent_60%)]" />
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="font-display text-2xl tracking-[6px] text-[#C9A84C] uppercase">Maison Noir</Link>
        </div>
        <div className="bg-white border border-[rgba(42,36,32,0.1)] shadow-md p-8">
          <h1 className="font-display text-3xl font-light text-[#2A2420] mb-2">Reset Password</h1>
          {sent ? (
            <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] leading-relaxed">
              ✓ Check your email for a password reset link.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="text-[9px] tracking-[2px] uppercase text-[#6B5E4A] block mb-2 font-semibold">Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  className="w-full px-4 py-3 bg-[#FAF8F5] border border-[rgba(42,36,32,0.15)] text-[#2A2420] text-sm outline-none focus:border-[#C9A84C] transition-colors"
                  placeholder="your@email.com" />
              </div>
              <button type="submit" disabled={loading}
                className="btn-dark w-full py-3.5 disabled:opacity-50">
                {loading ? 'Sending…' : 'Send Reset Link'}
              </button>
            </form>
          )}
          <div className="mt-6 text-center">
            <Link href="/auth/login" className="text-[10px] text-[#9A8A7A] hover:text-[#C9A84C] transition-colors">← Back to Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
