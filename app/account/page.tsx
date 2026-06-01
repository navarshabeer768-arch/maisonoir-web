import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AccountLayout } from '@/components/account/AccountLayout'
import { AccountDashboard } from '@/components/account/AccountDashboard'

export const metadata = { title: 'My Account' }

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login?redirect=/account')

  const [
    { data: profile },
    { data: loyalty },
    { data: orders },
    { data: wishlistItems },
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('loyalty_accounts').select('*').eq('profile_id', user.id).single(),
    supabase
      .from('orders')
      .select('id, order_number, status, total, created_at')
      .eq('profile_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('wishlists')
      .select('id')
      .eq('profile_id', user.id),
  ])

  return (
    <AccountLayout profile={profile as any}>
      <AccountDashboard
        profile={profile as any}
        loyalty={loyalty as any}
        recentOrders={(orders ?? []) as any[]}
        wishlistCount={wishlistItems?.length ?? 0}
      />
    </AccountLayout>
  )
}
