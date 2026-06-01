import type { Metadata } from 'next'
import Link from 'next/link'
import { LoginForm } from '@/components/auth/LoginForm'

export const metadata: Metadata = { title: 'Sign In', robots: { index: false } }
export const dynamic = 'force-dynamic'

interface LoginPageProps {
  searchParams: Promise<{ redirect?: string; message?: string }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { redirect: redirectTo, message } = await searchParams

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(201,168,76,0.06)_0%,_transparent_70%)]" />
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-12">
          <Link href="/" className="font-display text-2xl tracking-[8px] text-[#C9A84C] uppercase">
            Maison Noir
          </Link>
          <p className="text-[9px] tracking-[3px] uppercase text-[#5A5048] mt-3">Welcome back</p>
        </div>
        <div className="bg-[#141414] border border-[rgba(201,168,76,0.15)] p-8 md:p-10">
          <h1 className="font-display text-3xl font-light mb-8">Sign In</h1>
          {message && (
            <div className="mb-6 p-4 bg-[rgba(201,168,76,0.08)] border border-[rgba(201,168,76,0.3)] text-[10px] tracking-[1px] text-[#C9A84C]">
              {message}
            </div>
          )}
          <LoginForm redirectTo={redirectTo ?? '/account'} />
          <div className="mt-6 text-center">
            <Link href="/auth/forgot-password" className="text-[10px] tracking-[1px] text-[#6B5E4A] hover:text-[#C9A84C] transition-colors">
              Forgot your password?
            </Link>
          </div>
          <div className="mt-8 pt-8 border-t border-[rgba(201,168,76,0.1)] text-center">
            <p className="text-[10px] tracking-[1px] text-[#5A5048]">
              New to Maison Noir?{' '}
              <Link href="/auth/register" className="text-[#C9A84C] hover:text-[#E8D5A3] transition-colors">
                Create an account
              </Link>
            </p>
          </div>
        </div>
        <div className="flex justify-center gap-8 mt-8">
          {['🔒 Secure Login', '✦ Loyalty Rewards', '🎁 Member Benefits'].map(t => (
            <span key={t} className="text-[8px] tracking-[1px] text-[#3A3530]">{t}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
