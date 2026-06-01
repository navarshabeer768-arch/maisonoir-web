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

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false) }, [pathname])

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 h-[72px] flex items-center justify-between px-6 md:px-12 transition-all duration-500 ${
        scrolled
          ? 'bg-[rgba(10,10,10,0.92)] backdrop-blur-xl border-b border-[rgba(201,168,76,0.1)]'
          : 'bg-transparent'
      }`}>
        {/* Logo */}
        <Link href="/" className="font-display text-xl tracking-[8px] text-[#C9A84C] uppercase shrink-0">
          Maison <span className="text-[#F0EAD6]">Noir</span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden lg:flex gap-8 list-none">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`text-[10px] tracking-[3px] uppercase transition-colors duration-300 hover:text-[#C9A84C] ${
                  pathname.startsWith(href.split('?')[0]) ? 'text-[#C9A84C]' : 'text-[#9A9080]'
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Icons */}
        <div className="flex items-center gap-1.5">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center text-[#9A9080] hover:text-[#C9A84C] border border-transparent hover:border-[rgba(201,168,76,0.3)] rounded-full transition-all duration-300"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <button
            onClick={() => setSearchOpen(true)}
            className="w-9 h-9 flex items-center justify-center text-[#9A9080] hover:text-[#C9A84C] border border-transparent hover:border-[rgba(201,168,76,0.3)] rounded-full transition-all duration-300"
            aria-label="Search"
          >
            <Search size={16} />
          </button>

          <Link
            href="/account/wishlist"
            className="w-9 h-9 flex items-center justify-center text-[#9A9080] hover:text-[#C9A84C] border border-transparent hover:border-[rgba(201,168,76,0.3)] rounded-full transition-all duration-300"
            aria-label="Wishlist"
          >
            <Heart size={16} />
          </Link>

          <Link
            href="/account"
            className="w-9 h-9 flex items-center justify-center text-[#9A9080] hover:text-[#C9A84C] border border-transparent hover:border-[rgba(201,168,76,0.3)] rounded-full transition-all duration-300"
            aria-label="Account"
          >
            <User size={16} />
          </Link>

          <button
            onClick={() => setCartOpen(true)}
            className="w-9 h-9 flex items-center justify-center text-[#9A9080] hover:text-[#C9A84C] border border-transparent hover:border-[rgba(201,168,76,0.3)] rounded-full transition-all duration-300 relative"
            aria-label={`Cart (${itemCount} items)`}
          >
            <ShoppingBag size={16} />
            {itemCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-[#C9A84C] text-[#0A0A0A] text-[9px] font-bold rounded-full flex items-center justify-center"
              >
                {itemCount > 9 ? '9+' : itemCount}
              </motion.span>
            )}
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden w-9 h-9 flex items-center justify-center text-[#9A9080] hover:text-[#C9A84C] transition-colors ml-1"
            aria-label="Menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-0 z-40 bg-[#0A0A0A] flex flex-col pt-24 px-8"
          >
            <nav>
              {NAV_LINKS.map(({ href, label }, i) => (
                <motion.div
                  key={href}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 + 0.2 }}
                >
                  <Link
                    href={href}
                    className="block py-5 font-display text-4xl font-light text-[#F0EAD6] border-b border-[rgba(201,168,76,0.1)] hover:text-[#C9A84C] transition-colors"
                  >
                    {label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Search modal */}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
