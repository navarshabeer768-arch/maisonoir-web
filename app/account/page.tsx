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
    { data: wishlistCount },
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('loyalty_accounts').select('*').eq('profile_id', user.id).single(),
    supabase.from('orders').select('id, order_number, status, total, created_at, items:order_items(*)').eq('profile_id', user.id).order('created_at', { ascending: false }).limit(5),
    supabase.from('wishlists').select('id', { count: 'exact' }).eq('profile_id', user.id),
  ])

  return (
    <AccountLayout profile={profile!}>
      <AccountDashboard
        profile={profile!}
        loyalty={loyalty!}
        recentOrders={orders ?? []}
        wishlistCount={wishlistCount?.length ?? 0}
      />
    </AccountLayout>
  )
}
