'use client'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import type { Category } from '@/types'

const FALLBACK_EMOJIS: Record<string, string> = {
  women: '🌸', men: '🪨', unisex: '✨',
  'arabic-perfumes': '🕌', 'niche-fragrances': '💎',
  'luxury-gift-sets': '🎁', 'travel-sizes': '✈️',
  'home-fragrances': '🕯️', 'incense-bakhoor': '🌿',
}

interface CategoriesGridProps { categories: Category[] }

export function CategoriesGrid({ categories }: CategoriesGridProps) {
  if (!categories.length) return null

  return (
    <section className="px-6 md:px-12 py-20">
      <div className="text-center mb-12">
        <p className="section-eyebrow">Shop by Category</p>
        <h2 className="section-title">Explore Our <em className="gold-text">Collections</em></h2>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
        {categories.map((cat, i) => (
          <motion.div key={cat.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }} viewport={{ once: true }}>
            <Link href={`/shop?category=${cat.slug}`}
              className="group flex flex-col items-center gap-3 p-4 border border-transparent hover:border-[rgba(201,168,76,0.2)] transition-all duration-300 text-center">
              <div className="w-14 h-14 bg-[#1E1E1E] group-hover:bg-[rgba(201,168,76,0.1)] flex items-center justify-center transition-colors duration-300 overflow-hidden">
                {cat.image_url
                  ? <Image src={cat.image_url} alt={cat.name} width={56} height={56} className="object-cover w-full h-full" />
                  : <span className="text-2xl">{FALLBACK_EMOJIS[cat.slug] ?? '✦'}</span>}
              </div>
              <span className="text-[9px] tracking-[1.5px] uppercase text-[#6B5E4A] group-hover:text-[#C9A84C] transition-colors leading-tight">{cat.name}</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
