'use client'
import Link from 'next/link'
import { Package, Heart, Star, ArrowRight } from 'lucide-react'

function qar(n: number) { return `QAR ${n.toLocaleString('en', { minimumFractionDigits: 0 })}` }

const STATUS_CLASSES: Record<string, string> = {
  delivered: 'status-delivered', shipped: 'status-shipped',
  processing: 'status-processing', cancelled: 'status-cancelled',
  pending: 'status-processing', confirmed: 'status-processing',
}

const TIER_COLORS: Record<string, string> = {
  bronze: '#CD7F32', silver: '#C0C0C0', gold: '#C9A84C',
  platinum: '#9B9B9B', vip_royal: '#9B59B6',
}

export function AccountDashboard({ profile, loyalty, recentOrders, wishlistCount }: {
  profile: any; loyalty: any; recentOrders: any[]; wishlistCount: number
}) {
  const firstName = profile?.first_name ?? profile?.email?.split('@')[0] ?? 'Guest'
  const tierColor = TIER_COLORS[loyalty?.tier ?? 'bronze']

  return (
    <div className="space-y-8">
      <div>
        <p className="section-eyebrow">Welcome back</p>
        <h1 className="font-display text-4xl md:text-5xl font-light text-[#2A2420]">
          {firstName} <em className="gold-text">✦</em>
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Orders', value: String(recentOrders?.length ?? 0), icon: Package, href: '/account/orders' },
          { label: 'Wishlist', value: String(wishlistCount ?? 0), icon: Heart, href: '/account/wishlist' },
          { label: 'Loyalty Points', value: ((loyalty?.points_balance ?? 0)).toLocaleString(), icon: Star, href: '/account/loyalty' },
          { label: 'Tier', value: (loyalty?.tier ?? 'Bronze').replace('_', ' '), icon: Star, href: '/account/loyalty', color: tierColor },
        ].map(({ label, value, icon: Icon, href, color }) => (
          <Link key={label} href={href}
            className="bg-white border border-[rgba(42,36,32,0.07)] hover:border-[rgba(201,168,76,0.3)] p-5 group transition-all duration-300 hover:shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <Icon size={16} className="text-[#C9A84C]" />
              <ArrowRight size={12} className="text-[#C5BDB5] group-hover:text-[#C9A84C] transition-colors" />
            </div>
            <p className="font-display text-2xl text-[#2A2420] capitalize" style={color ? { color } : {}}>{value}</p>
            <p className="text-[9px] tracking-[2px] uppercase text-[#9A8A7A] mt-1">{label}</p>
          </Link>
        ))}
      </div>

      {/* Loyalty card */}
      {loyalty && (
        <div className="relative bg-white border border-[rgba(42,36,32,0.07)] p-6 overflow-hidden shadow-sm">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,168,76,0.06),transparent_60%)]" />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-[9px] tracking-[4px] uppercase font-semibold capitalize" style={{ color: tierColor }}>
                  {loyalty.tier?.replace('_', ' ')} Member
                </p>
                <p className="font-display text-3xl mt-1 text-[#2A2420]">{(loyalty.points_balance ?? 0).toLocaleString()} pts</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] text-[#9A8A7A]">Lifetime</p>
                <p className="font-display text-xl text-[#9A8A7A]">{(loyalty.points_lifetime ?? 0).toLocaleString()}</p>
              </div>
            </div>
            {loyalty.points_to_next_tier && (
              <>
                <div className="h-1 bg-[rgba(42,36,32,0.08)] rounded-full mb-2">
                  <div className="h-full bg-[#C9A84C] rounded-full transition-all" style={{ width: `${loyalty.tier_progress_pct ?? 0}%` }} />
                </div>
                <p className="text-[9px] text-[#9A8A7A]">
                  {(loyalty.points_to_next_tier).toLocaleString()} points to{' '}
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
          <h2 className="font-display text-2xl font-light text-[#2A2420]">Recent Orders</h2>
          <Link href="/account/orders" className="text-[9px] tracking-[2px] uppercase text-[#C9A84C] hover:text-[#9A7A35] transition-colors font-medium">View All</Link>
        </div>
        {!recentOrders?.length ? (
          <div className="bg-white border border-[rgba(42,36,32,0.07)] p-10 text-center shadow-sm">
            <Package size={32} className="text-[#D5C9BA] mx-auto mb-3" />
            <p className="font-display text-xl text-[#9A8A7A]">No orders yet</p>
            <Link href="/shop" className="btn-dark mt-4 inline-block text-[9px] px-6 py-3">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order: any) => (
              <Link key={order.id} href={`/account/orders/${order.id}`}
                className="bg-white border border-[rgba(42,36,32,0.07)] hover:border-[rgba(201,168,76,0.2)] p-4 flex items-center justify-between gap-4 transition-all group shadow-sm">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 bg-[#FAF7F2] border border-[rgba(42,36,32,0.07)] flex items-center justify-center shrink-0">
                    <Package size={16} className="text-[#9A8A7A]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] tracking-[1px] font-medium text-[#2A2420]">{order.order_number}</p>
                    <p className="text-[9px] text-[#9A8A7A]">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={STATUS_CLASSES[order.status] ?? 'status-processing'}>{order.status}</span>
                  <span className="font-display text-lg text-[#2A2420]">{qar(order.total)}</span>
                  <ArrowRight size={14} className="text-[#C5BDB5] group-hover:text-[#C9A84C] transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
