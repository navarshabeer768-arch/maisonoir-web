import { redirect } from 'next/navigation'
import { AccountLayout } from '@/components/account/AccountLayout'
export const dynamic = 'force-dynamic'

export default async function Page() {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return (
        <AccountLayout profile={{ email: '', first_name: 'Guest', last_name: '', role: 'customer' }}>
          <div>
            <h1 className="font-display text-4xl font-light text-[#2A2420] mb-8 capitalize">Settings</h1>
            <div className="bg-white border border-[rgba(42,36,32,0.07)] p-10 text-center shadow-sm">
              <p className="text-[#9A8A7A] text-sm">Database not connected yet.</p>
            </div>
          </div>
        </AccountLayout>
      )
    }
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/auth/login?redirect=/account/settings')
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()
    const safeProfile = profile ?? { id: user.id, email: user.email ?? '', first_name: user.user_metadata?.first_name ?? 'Guest', last_name: user.user_metadata?.last_name ?? '', role: 'customer', is_active: true }
    return (
      <AccountLayout profile={safeProfile as any}>
        <div>
          <h1 className="font-display text-4xl font-light text-[#2A2420] mb-8 capitalize">Settings</h1>
          <div className="bg-white border border-[rgba(42,36,32,0.07)] p-10 text-center shadow-sm">
            <p className="text-[#9A8A7A] text-sm">Your Settings will appear here.</p>
          </div>
        </div>
      </AccountLayout>
    )
  } catch (e: any) {
    console.error('Settings page error:', e)
    redirect('/auth/login')
  }
}
