'use client'
import Link from 'next/link'
import { Package, Heart, Star, ArrowRight } from 'lucide-react'
import type { Profile, Order, LoyaltyAccount } from '@/types'

const TIER_COLORS: Record<string, string> = {
  bronze: '#CD7F32', silver: '#C0C0C0', gold: '#C9A84C',
  platinum: '#E5E4E2', vip_royal: '#9B59B6',
}

const STATUS_CLASSES: Record<string, string> = {
  delivered: 'status-delivered', shipped: 'status-shipped',
  processing: 'status-processing', cancelled: 'status-cancelled',
  pending: 'status-processing', confirmed: 'status-processing',
}

interface AccountDashboardProps {
  profile: Profile
  loyalty: LoyaltyAccount | null
  recentOrders: (Order & { items: any[] })[]
  wishlistCount: number
}

export function AccountDashboard({ profile, loyalty, recentOrders, wishlistCount }: AccountDashboardProps) {
  const tierColor = TIER_COLORS[loyalty?.tier ?? 'bronze']

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <p className="section-eyebrow">Welcome back</p>
        <h1 className="font-display text-4xl md:text-5xl font-light">
          {profile.first_name ?? 'Valued Guest'} <em className="gold-text">✦</em>
        </h1>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Orders', value: recentOrders.length.toString(), icon: Package, href: '/account/orders' },
          { label: 'Wishlist', value: wishlistCount.toString(), icon: Heart, href: '/account/wishlist' },
          { label: 'Loyalty Points', value: (loyalty?.points_balance ?? 0).toLocaleString(), icon: Star, href: '/account/loyalty' },
          { label: 'Tier Status', value: (loyalty?.tier ?? 'Bronze').replace('_', ' '), icon: Star, href: '/account/loyalty', color: tierColor },
        ].map(({ label, value, icon: Icon, href, color }) => (
          <Link key={label} href={href} className="bg-[#141414] border border-[rgba(201,168,76,0.1)] hover:border-[rgba(201,168,76,0.3)] p-5 group transition-all duration-300">
            <div className="flex items-start justify-between mb-3">
              <Icon size={16} className="text-[#C9A84C]" />
              <ArrowRight size={12} className="text-[#3A3530] group-hover:text-[#C9A84C] transition-colors" />
            </div>
            <p className="font-display text-2xl capitalize" style={color ? { color } : {}}>{value}</p>
            <p className="text-[9px] tracking-[2px] uppercase text-[#5A5048] mt-1">{label}</p>
          </Link>
        ))}
      </div>

      {/* Loyalty card */}
      {loyalty && (
        <div className="relative bg-[#141414] border border-[rgba(201,168,76,0.15)] p-6 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,168,76,0.08),transparent_60%)]" />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-[9px] tracking-[4px] uppercase" style={{ color: tierColor }}>{loyalty.tier.replace('_', ' ')}</p>
                <p className="font-display text-3xl mt-1">{loyalty.points_balance.toLocaleString()} pts</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] text-[#5A5048]">Lifetime points</p>
                <p className="font-display text-xl text-[#6B5E4A]">{loyalty.points_lifetime.toLocaleString()}</p>
              </div>
            </div>
            {loyalty.points_to_next_tier && (
              <>
                <div className="h-0.5 bg-[rgba(201,168,76,0.1)] mb-2">
                  <div className="h-full bg-[#C9A84C] transition-all duration-1000" style={{ width: `${loyalty.tier_progress_pct}%` }} />
                </div>
                <p className="text-[9px] text-[#5A5048]">
                  {loyalty.points_to_next_tier.toLocaleString()} points to{' '}
                  <span className="text-[#C9A84C] capitalize">{loyalty.next_tier?.replace('_', ' ')}</span>
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Recent orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-2xl font-light">Recent Orders</h2>
          <Link href="/account/orders" className="text-[9px] tracking-[2px] uppercase text-[#C9A84C] hover:text-[#E8D5A3] transition-colors">View All</Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="bg-[#141414] border border-[rgba(201,168,76,0.1)] p-10 text-center">
            <Package size={32} className="text-[#3A3530] mx-auto mb-3" />
            <p className="font-display text-xl text-[#5A5048]">No orders yet</p>
            <Link href="/shop" className="btn-gold mt-4 inline-block text-[9px]">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentOrders.map(order => (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="bg-[#141414] border border-[rgba(201,168,76,0.1)] hover:border-[rgba(201,168,76,0.25)] p-4 flex items-center justify-between gap-4 transition-all group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 bg-[#1E1E1E] flex items-center justify-center shrink-0">
                    <Package size={16} className="text-[#5A5048]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] tracking-[1px] font-medium">{order.order_number}</p>
                    <p className="text-[9px] text-[#5A5048] truncate">{order.items?.length ?? 0} items · {new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className={STATUS_CLASSES[order.status] ?? 'status-processing'}>{order.status}</span>
                  <span className="font-display text-lg text-[#C9A84C]">${order.total.toFixed(0)}</span>
                  <ArrowRight size={14} className="text-[#3A3530] group-hover:text-[#C9A84C] transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
