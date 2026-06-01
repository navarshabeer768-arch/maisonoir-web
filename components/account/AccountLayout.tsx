'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User, Package, Heart, MapPin, Star, Settings, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { Profile } from '@/types'
import { Footer } from '@/components/layout/Footer'

const NAV = [
  { href: '/account', icon: User, label: 'Dashboard' },
  { href: '/account/orders', icon: Package, label: 'My Orders' },
  { href: '/account/wishlist', icon: Heart, label: 'Wishlist' },
  { href: '/account/addresses', icon: MapPin, label: 'Addresses' },
  { href: '/account/loyalty', icon: Star, label: 'Loyalty Rewards' },
  { href: '/account/settings', icon: Settings, label: 'Settings' },
]

interface AccountLayoutProps {
  children: React.ReactNode
  profile: Profile
}

export function AccountLayout({ children, profile }: AccountLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const initials = `${profile.first_name?.[0] ?? ''}${profile.last_name?.[0] ?? ''}`.toUpperCase() || '✦'

  return (
    <div className="min-h-screen">
      <div className="h-[72px]" />
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-10 flex gap-10 items-start">
        {/* Sidebar */}
        <aside className="hidden md:block w-56 shrink-0 sticky top-28">
          {/* Avatar */}
          <div className="mb-8 flex items-center gap-4">
            <div className="w-12 h-12 bg-[rgba(201,168,76,0.15)] border border-[rgba(201,168,76,0.3)] flex items-center justify-center font-display text-xl text-[#C9A84C]">
              {initials}
            </div>
            <div>
              <p className="text-sm font-medium">{profile.first_name} {profile.last_name}</p>
              <p className="text-[9px] tracking-[1px] text-[#5A5048] truncate max-w-[120px]">{profile.email}</p>
            </div>
          </div>

          <nav className="space-y-0.5">
            {NAV.map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 text-[11px] tracking-[0.5px] border-l-2 transition-all duration-200 ${
                  pathname === href
                    ? 'text-[#C9A84C] border-[#C9A84C] bg-[rgba(201,168,76,0.06)]'
                    : 'text-[#6B5E4A] border-transparent hover:text-[#C9A84C] hover:bg-[rgba(201,168,76,0.04)]'
                }`}
              >
                <Icon size={14} />
                {label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 text-[11px] tracking-[0.5px] border-l-2 border-transparent text-[#5A5048] hover:text-red-400 transition-colors w-full"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
      <Footer />
    </div>
  )
}
