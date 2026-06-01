import Link from 'next/link'

interface FooterProps { minimal?: boolean }

export function Footer({ minimal = false }: FooterProps) {
  if (minimal) {
    return (
      <footer className="border-t border-[rgba(42,36,32,0.08)] py-8 px-6 md:px-12 bg-[#FAF7F2]">
        <div className="max-w-[1400px] mx-auto flex flex-wrap justify-between items-center gap-4">
          <span className="font-display text-lg text-[#C9A84C] tracking-[4px]">Maison Noir</span>
          <span className="text-[9px] text-[#9A8A7A] tracking-[1px]">© 2025 Maison Noir. All rights reserved.</span>
        </div>
      </footer>
    )
  }
  return (
    <footer className="bg-[#2A2420] text-[#F0EAD6] pt-20 pb-10 px-6 md:px-12 mt-20">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2 md:col-span-1">
            <div className="font-display text-2xl tracking-[6px] text-[#C9A84C] mb-4 uppercase">Maison Noir</div>
            <p className="text-[11px] leading-[2.2] text-[#8A7A6A] max-w-[260px]">
              A sanctuary for those who understand that the finest fragrances are not merely worn — they are experienced.
            </p>
          </div>
          {[
            { title: 'Collection', links: [
              { href: '/shop', l: 'All Fragrances' }, { href: '/shop?filter=new', l: 'New Arrivals' },
              { href: '/shop?filter=bestseller', l: 'Best Sellers' }, { href: '/shop?filter=arabic', l: 'Arabic Collection' },
              { href: '/shop?category=luxury-gift-sets', l: 'Gift Sets' },
            ]},
            { title: 'Account', links: [
              { href: '/account', l: 'My Account' }, { href: '/account/orders', l: 'My Orders' },
              { href: '/account/wishlist', l: 'Wishlist' }, { href: '/account/loyalty', l: 'Loyalty Rewards' },
            ]},
            { title: 'Help', links: [
              { href: '/support', l: 'Customer Care' }, { href: '/faq', l: 'FAQ' },
              { href: '/returns', l: 'Returns Policy' }, { href: '/shipping', l: 'Shipping Info' },
            ]},
          ].map(({ title, links }) => (
            <div key={title}>
              <p className="text-[9px] tracking-[4px] uppercase text-[#C9A84C] mb-5 font-semibold">{title}</p>
              <ul className="space-y-3">
                {links.map(({ href, l }) => (
                  <li key={href}>
                    <Link href={href} className="text-[11px] text-[#8A7A6A] hover:text-[#C9A84C] transition-colors">{l}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-[rgba(201,168,76,0.1)] pt-8 flex flex-wrap justify-between items-center gap-4">
          <p className="text-[9px] text-[#5A5048] tracking-[1px]">© 2025 Maison Noir. All rights reserved.</p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service'].map(l => (
              <a key={l} href="#" className="text-[9px] text-[#5A5048] hover:text-[#C9A84C] transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
