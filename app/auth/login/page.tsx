import type { Metadata } from 'next'
import Link from 'next/link'
import { LoginForm } from '@/components/auth/LoginForm'
export const metadata: Metadata = { title: 'Sign In', robots: { index: false } }
export const dynamic = 'force-dynamic'

interface Props { searchParams: Promise<{ redirect?: string; message?: string; error?: string }> }

export default async function LoginPage({ searchParams }: Props) {
  const { redirect: redirectTo, message, error } = await searchParams
  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center px-6 py-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,168,76,0.08)_0%,transparent_60%)]" />
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="font-display text-2xl tracking-[6px] text-[#C9A84C] uppercase">Maison Noir</Link>
          <p className="text-[9px] tracking-[3px] uppercase text-[#9A8A7A] mt-2">Welcome back</p>
        </div>
        <div className="bg-white border border-[rgba(201,168,76,0.2)] shadow-lg p-8 md:p-10">
          <h1 className="font-display text-3xl font-light text-[#2A2420] mb-8">Sign In</h1>
          {message && (
            <div className="mb-5 p-4 bg-amber-50 border border-amber-200 text-[10px] text-amber-700 tracking-[0.5px]">{message}</div>
          )}
          {error && (
            <div className="mb-5 p-4 bg-red-50 border border-red-200 text-[10px] text-red-600 tracking-[0.5px]">
              {error === 'unauthorized' ? 'Access denied. Staff accounts only.' : error}
            </div>
          )}
          <LoginForm redirectTo={redirectTo ?? '/account'} />
          <div className="mt-5 text-center">
            <Link href="/auth/forgot-password" className="text-[10px] text-[#9A8A7A] hover:text-[#C9A84C] transition-colors">
              Forgot your password?
            </Link>
          </div>
          <div className="mt-8 pt-6 border-t border-[rgba(42,36,32,0.08)] text-center">
            <p className="text-[10px] text-[#9A8A7A]">
              New to Maison Noir?{' '}
              <Link href="/auth/register" className="text-[#C9A84C] hover:text-[#9A7A35] transition-colors font-medium">Create account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
