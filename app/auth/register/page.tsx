import type { Metadata } from 'next'
import Link from 'next/link'
import { RegisterForm } from '@/components/auth/RegisterForm'

export const metadata: Metadata = { title: 'Create Account', robots: { index: false } }
export const dynamic = 'force-dynamic'

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.06)_0%,transparent_70%)]" />
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-12">
          <Link href="/" className="font-display text-2xl tracking-[8px] text-[#C9A84C] uppercase">Maison Noir</Link>
          <p className="text-[9px] tracking-[3px] uppercase text-[#5A5048] mt-3">Join the inner circle</p>
        </div>
        <div className="bg-[#141414] border border-[rgba(201,168,76,0.15)] p-8 md:p-10">
          <h1 className="font-display text-3xl font-light mb-8">Create Account</h1>
          <RegisterForm />
          <div className="mt-8 pt-8 border-t border-[rgba(201,168,76,0.1)] text-center">
            <p className="text-[10px] tracking-[1px] text-[#5A5048]">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-[#C9A84C] hover:text-[#E8D5A3] transition-colors">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
