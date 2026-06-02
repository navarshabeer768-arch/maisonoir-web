import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AccountLayout } from '@/components/account/AccountLayout'
import { AccountDashboard } from '@/components/account/AccountDashboard'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'My Account' }

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login?redirect=/account')

  // Fetch profile - handle null gracefully
  const [
    { data: profile },
    { data: loyalty },
    { data: orders },
    { data: wishlistItems },
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
    supabase.from('loyalty_accounts').select('*').eq('profile_id', user.id).maybeSingle(),
    supabase.from('orders').select('id, order_number, status, total, created_at').eq('profile_id', user.id).order('created_at', { ascending: false }).limit(5),
    supabase.from('wishlists').select('id').eq('profile_id', user.id),
  ])

  // Create a safe profile fallback if not found
  const safeProfile = profile ?? {
    id: user.id,
    email: user.email ?? '',
    first_name: user.user_metadata?.first_name ?? user.email?.split('@')[0] ?? 'Guest',
    last_name: user.user_metadata?.last_name ?? '',
    role: 'customer',
    is_active: true,
    is_verified: false,
    two_factor_enabled: false,
    preferred_language: 'en',
    currency: 'QAR',
    phone: null,
    avatar_url: null,
    date_of_birth: null,
    gender: null,
    last_login_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  return (
    <AccountLayout profile={safeProfile as any}>
      <AccountDashboard
        profile={safeProfile as any}
        loyalty={loyalty as any}
        recentOrders={(orders ?? []) as any[]}
        wishlistCount={wishlistItems?.length ?? 0}
      />
    </AccountLayout>
  )
}
