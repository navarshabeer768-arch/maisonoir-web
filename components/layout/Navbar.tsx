'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, Heart, User, ShoppingBag, Menu, X, Sun, Moon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/components/cart/CartProvider'
import { useTheme } from '@/components/layout/ThemeProvider'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { SearchModal } from '@/components/shop/SearchModal'

const NAV_LINKS = [
  { href: '/shop', label: 'Collection' },
  { href: '/shop?category=arabic-perfumes', label: 'Arabic' },
  { href: '/discovery', label: 'Discovery' },
  { href: '/shop?filter=exclusive', label: 'Exclusives' },
  { href: '/shop?category=luxury-gift-sets', label: 'Gifting' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { itemCount } = useCart()
  const { theme, toggleTheme } = useTheme()
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [pathname])

  const isDark = theme === 'dark'

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 h-[68px] flex items-center justify-between px-6 md:px-12 transition-all duration-500 ${
        scrolled
          ? isDark
            ? 'bg-[rgba(10,10,10,0.95)] backdrop-blur-xl border-b border-[rgba(201,168,76,0.1)]'
            : 'bg-white/95 backdrop-blur-xl border-b border-[rgba(201,168,76,0.15)] shadow-sm'
          : isDark ? 'bg-transparent' : 'bg-[#FAF7F2]/80'
      }`}>
        {/* Logo */}
        <Link href="/" className="font-display text-xl tracking-[6px] uppercase shrink-0" style={{ color: '#C9A84C' }}>
          Maison <span className={isDark ? 'text-[#F0EAD6]' : 'text-[#2A2420]'}>Noir</span>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden lg:flex gap-8 list-none">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} className={`text-[10px] tracking-[2.5px] uppercase transition-colors duration-200 hover:text-[#C9A84C] ${
                pathname.startsWith(href.split('?')[0]) ? 'text-[#C9A84C]' : isDark ? 'text-[#9A9080]' : 'text-[#6B5E4A]'
              }`}>
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Icons */}
        <div className="flex items-center gap-1">
          <button onClick={toggleTheme} className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors ${isDark ? 'text-[#9A9080] hover:text-[#C9A84C]' : 'text-[#6B5E4A] hover:text-[#C9A84C]'}`}>
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <button onClick={() => setSearchOpen(true)} className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors ${isDark ? 'text-[#9A9080] hover:text-[#C9A84C]' : 'text-[#6B5E4A] hover:text-[#C9A84C]'}`}>
            <Search size={15} />
          </button>
          <Link href="/account/wishlist" className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors ${isDark ? 'text-[#9A9080] hover:text-[#C9A84C]' : 'text-[#6B5E4A] hover:text-[#C9A84C]'}`}>
            <Heart size={15} />
          </Link>
          <Link href="/account" className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors ${isDark ? 'text-[#9A9080] hover:text-[#C9A84C]' : 'text-[#6B5E4A] hover:text-[#C9A84C]'}`}>
            <User size={15} />
          </Link>
          <button onClick={() => setCartOpen(true)} className={`relative w-9 h-9 flex items-center justify-center rounded-full transition-colors ${isDark ? 'text-[#9A9080] hover:text-[#C9A84C]' : 'text-[#6B5E4A] hover:text-[#C9A84C]'}`}>
            <ShoppingBag size={15} />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#C9A84C] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </button>
          <button onClick={() => setMobileOpen(!mobileOpen)} className={`lg:hidden w-9 h-9 flex items-center justify-center transition-colors ${isDark ? 'text-[#9A9080]' : 'text-[#6B5E4A]'}`}>
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={`fixed inset-0 z-40 flex flex-col pt-24 px-8 ${isDark ? 'bg-[#0A0A0A]' : 'bg-[#FAF7F2]'}`}>
            {NAV_LINKS.map(({ href, label }, i) => (
              <motion.div key={href} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 + 0.1 }}>
                <Link href={href} className={`block py-5 font-display text-4xl font-light border-b hover:text-[#C9A84C] transition-colors ${isDark ? 'border-[rgba(201,168,76,0.1)] text-[#F0EAD6]' : 'border-[rgba(42,36,32,0.08)] text-[#2A2420]'}`}>
                  {label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
