'use client'
import { useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'

export function HeroSection() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section ref={ref} className="relative h-screen overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#FAF7F2] via-[#F5EFE6] to-[#EDE3D6]">
      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `linear-gradient(#C9A84C 1px, transparent 1px), linear-gradient(90deg, #C9A84C 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />

      {/* Gold accent blobs */}
      <div className="absolute top-20 right-20 w-80 h-80 bg-[rgba(201,168,76,0.08)] rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-60 h-60 bg-[rgba(201,168,76,0.06)] rounded-full blur-3xl" />

      <motion.div style={{ y, opacity }} className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}
          className="section-eyebrow mb-6">
          New Collection · Autumn 2025
        </motion.p>

        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 1 }}
          className="font-display text-[clamp(52px,8vw,110px)] font-light leading-[0.92] tracking-[-1px] mb-6 text-[#2A2420]">
          The Art of<br />
          <em style={{ color: '#C9A84C' }}>Invisible</em><br />
          Presence
        </motion.h1>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
          className="text-[11px] tracking-[3px] uppercase text-[#8A7A6A] mb-14 max-w-sm mx-auto leading-[2.5]">
          Curated luxury fragrances from the world's most revered maisons
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
          className="flex gap-4 justify-center flex-wrap">
          <Link href="/shop" className="btn-dark">Explore Collection</Link>
          <Link href="/discovery" className="btn-outline-gold">Find Your Scent</Link>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
          className="flex gap-8 justify-center mt-16 flex-wrap">
          {['500+ Luxury Brands', '100% Authentic', 'Free Shipping $150+', 'Easy Returns'].map(t => (
            <span key={t} className="text-[9px] tracking-[2px] uppercase text-[#9A8A7A] border-l border-[rgba(42,36,32,0.1)] pl-8 first:border-0 first:pl-0">
              {t}
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <motion.div animate={{ height: ['30px', '50px', '30px'], opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 2, repeat: Infinity }}
          className="w-px bg-gradient-to-b from-[#C9A84C] to-transparent" />
        <span className="text-[9px] tracking-[3px] uppercase text-[#9A8A7A]">Scroll</span>
      </div>
    </section>
  )
}
