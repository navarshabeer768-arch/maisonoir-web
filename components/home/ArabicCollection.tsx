'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ProductCard } from '@/components/product/ProductCard'
import type { Product } from '@/types'

export function ArabicCollection({ products }: { products: Product[] }) {
  if (!products.length) return null
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(154,122,53,0.08)_0%,transparent_50%,rgba(201,168,76,0.05)_100%)]" />
      <div className="relative z-10 px-6 md:px-12">
        <div className="text-center mb-12">
          <p className="section-eyebrow">Eastern Heritage</p>
          <h2 className="section-title">Arabic <em className="gold-text">Collection</em></h2>
          <p className="text-[11px] tracking-[2px] text-[#5A5048] mt-4 max-w-md mx-auto leading-[2]">
            Rare oud, precious amber, and sacred resins from the heart of the Arabian Peninsula
          </p>
          <div className="font-display text-2xl text-[rgba(201,168,76,0.2)] mt-2" dir="rtl">العطور العربية الفاخرة</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-px">
          {products.slice(0, 6).map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: i * 0.08 }} viewport={{ once: true }}>
              <ProductCard product={p} />
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/shop?category=arabic-perfumes" className="btn-gold px-10">Explore Arabic Collection</Link>
        </div>
      </div>
    </section>
  )
}
