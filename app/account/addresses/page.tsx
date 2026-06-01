import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AccountLayout } from '@/components/account/AccountLayout'
export const dynamic = 'force-dynamic'
export default async function Page() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login?redirect=/account/addresses')
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  return (
    <AccountLayout profile={profile as any}>
      <div>
        <h1 className="font-display text-4xl font-light mb-8 capitalize">addresses</h1>
        <div className="bg-[#F8F5F0] border border-[rgba(201,168,76,0.2)] p-10 text-center rounded">
          <p className="text-[#6B5E4A] text-sm">Coming soon — your addresses will appear here.</p>
        </div>
      </div>
    </AccountLayout>
  )
}
