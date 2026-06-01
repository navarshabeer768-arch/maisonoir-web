import Link from 'next/link'

interface FooterProps { minimal?: boolean }

export function Footer({ minimal = false }: FooterProps) {
  if (minimal) {
    return (
      <footer className="border-t border-[rgba(201,168,76,0.08)] py-8 px-6 md:px-12 mt-16">
        <div className="max-w-[1400px] mx-auto flex flex-wrap justify-between items-center gap-4">
          <span className="font-display text-lg text-[#C9A84C] tracking-[4px]">Maison Noir</span>
          <span className="text-[9px] text-[#3A3530] tracking-[1px]">© 2025 Maison Noir. All rights reserved.</span>
        </div>
      </footer>
    )
  }

  return (
    <footer className="border-t border-[rgba(201,168,76,0.08)] pt-20 pb-10 px-6 md:px-12 mt-20">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="font-display text-2xl tracking-[6px] text-[#C9A84C] mb-4 uppercase">Maison Noir</div>
            <p className="text-[10px] leading-[2.2] text-[#5A5048] max-w-[260px]">
              A sanctuary for those who understand that the finest fragrances are not merely worn — they are experienced.
            </p>
            <div className="flex gap-3 mt-6">
              {['instagram', 'twitter', 'tiktok'].map(s => (
                <a key={s} href={`https://${s}.com/maisonoir`} className="w-8 h-8 border border-[rgba(201,168,76,0.2)] flex items-center justify-center text-[#5A5048] hover:text-[#C9A84C] hover:border-[#C9A84C] transition-all text-[10px] uppercase">
                  {s[0].toUpperCase()}
                </a>
              ))}
            </div>
          </div>

          {/* Collection */}
          <div>
            <p className="text-[9px] tracking-[4px] uppercase text-[#C9A84C] mb-5">Collection</p>
            <ul className="space-y-3">
              {[
                { href: '/shop', label: 'All Fragrances' },
                { href: '/shop?filter=new', label: 'New Arrivals' },
                { href: '/shop?filter=bestseller', label: 'Best Sellers' },
                { href: '/shop?filter=arabic', label: 'Arabic Collection' },
                { href: '/shop?category=luxury-gift-sets', label: 'Gift Sets' },
                { href: '/shop?filter=exclusive', label: 'Exclusives' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-[11px] text-[#5A5048] hover:text-[#C9A84C] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <p className="text-[9px] tracking-[4px] uppercase text-[#C9A84C] mb-5">Services</p>
            <ul className="space-y-3">
              {['Personal Shopping', 'Gift Wrapping', 'Bottle Engraving', 'Loyalty Program', 'Fragrance Consultation', 'Corporate Gifts'].map(s => (
                <li key={s}>
                  <a href="#" className="text-[11px] text-[#5A5048] hover:text-[#C9A84C] transition-colors">{s}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <p className="text-[9px] tracking-[4px] uppercase text-[#C9A84C] mb-5">Help</p>
            <ul className="space-y-3">
              {[
                { href: '/account', label: 'My Account' },
                { href: '/account/orders', label: 'Track Order' },
                { href: '/support', label: 'Customer Care' },
                { href: '/faq', label: 'FAQ' },
                { href: '/returns', label: 'Returns Policy' },
                { href: '/shipping', label: 'Shipping Info' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-[11px] text-[#5A5048] hover:text-[#C9A84C] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-b border-[rgba(201,168,76,0.08)] py-10 mb-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="font-display text-2xl font-light mb-1">Join the Inner Circle</p>
              <p className="text-[10px] tracking-[1px] text-[#5A5048]">Exclusive offers, early access, and fragrance insights</p>
            </div>
            <div className="flex w-full md:w-auto gap-0">
              <input
                type="email"
                placeholder="Your email address"
                className="input-luxury flex-1 md:w-72"
              />
              <button className="btn-gold px-6 py-0 text-[9px] tracking-[2px]">Subscribe</button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-wrap justify-between items-center gap-4">
          <p className="text-[9px] text-[#3A3530] tracking-[1px]">© 2025 Maison Noir. All rights reserved.</p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(l => (
              <a key={l} href="#" className="text-[9px] text-[#3A3530] hover:text-[#C9A84C] transition-colors tracking-[1px]">{l}</a>
            ))}
          </div>
          <div className="flex gap-3">
            <button className="text-[9px] tracking-[2px] text-[#5A5048] hover:text-[#C9A84C] transition-colors">EN</button>
            <span className="text-[#3A3530]">|</span>
            <button className="text-[9px] tracking-[2px] text-[#5A5048] hover:text-[#C9A84C] transition-colors">عربي</button>
          </div>
        </div>
      </div>
    </footer>
  )
}
