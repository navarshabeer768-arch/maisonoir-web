'use client'
import { useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'

export function HeroSection() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section ref={ref} className="relative h-screen overflow-hidden flex items-center justify-center">
      {/* Background */}
      <motion.div style={{ y }} className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-radial from-[rgba(201,168,76,0.08)] via-transparent to-transparent" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(201,168,76,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </motion.div>

      {/* Floating bottles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[
          { emoji: '🫙', left: '8%', top: '20%', delay: 0, size: 'text-6xl' },
          { emoji: '💎', right: '10%', top: '30%', delay: -2, size: 'text-5xl' },
          { emoji: '✨', left: '15%', bottom: '20%', delay: -4, size: 'text-4xl' },
        ].map((item, i) => (
          <motion.div
            key={i}
            className={`absolute ${item.size} opacity-10`}
            style={{ left: item.left, right: (item as { right?: string }).right, top: item.top, bottom: (item as { bottom?: string }).bottom }}
            animate={{ y: [0, -20, 0], rotate: [-5, 5, -5] }}
            transition={{ duration: 6, repeat: Infinity, delay: item.delay, ease: 'easeInOut' }}
          >
            {item.emoji}
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <motion.div style={{ opacity }} className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="section-eyebrow mb-6"
        >
          New Collection · Autumn / Winter 2025
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="font-display text-[clamp(52px,8vw,120px)] font-light leading-[0.92] tracking-[-1px] mb-6"
        >
          The Art of<br />
          <em className="gold-text">Invisible</em><br />
          Presence
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-[11px] tracking-[3px] uppercase text-[#9A9080] mb-14 max-w-sm mx-auto leading-[2.5]"
        >
          Curated luxury fragrances from the world's most revered maisons
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="flex gap-4 justify-center flex-wrap"
        >
          <Link href="/shop" className="btn-gold">Explore Collection</Link>
          <Link href="/discovery" className="btn-outline-gold">Find Your Scent</Link>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="flex gap-8 justify-center mt-16 flex-wrap"
        >
          {['500+ Luxury Brands', '100% Authentic', 'Free Shipping $150+', 'Easy Returns'].map((t) => (
            <span key={t} className="text-[9px] tracking-[2px] uppercase text-[#6B5E4A] border-l border-[rgba(201,168,76,0.2)] pl-8 first:border-0 first:pl-0">
              {t}
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ height: ['40px', '60px', '40px'], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-px bg-gradient-to-b from-[#C9A84C] to-transparent"
        />
        <span className="text-[9px] tracking-[3px] uppercase text-[#6B5E4A]">Scroll</span>
      </motion.div>
    </section>
  )
}
