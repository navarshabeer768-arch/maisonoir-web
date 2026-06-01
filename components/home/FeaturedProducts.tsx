'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ProductCard } from '@/components/product/ProductCard'
import type { Product } from '@/types'

interface FeaturedProductsProps {
  products: Product[]
  title?: string
  titleEm?: string
  eyebrow?: string
}

export function FeaturedProducts({ products, title = 'Featured', titleEm = 'Selection', eyebrow = 'Curated For You' }: FeaturedProductsProps) {
  if (!products.length) return null
  return (
    <section className="py-20">
      <div className="px-6 md:px-12 text-center mb-12">
        <p className="section-eyebrow">{eyebrow}</p>
        <h2 className="section-title">{title} <em className="gold-text">{titleEm}</em></h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px">
        {products.slice(0, 8).map((p, i) => (
          <motion.div key={p.id} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: i * 0.06 }} viewport={{ once: true }}>
            <ProductCard product={p} priority={i < 4} />
          </motion.div>
        ))}
      </div>
      <div className="text-center mt-10">
        <Link href="/shop" className="btn-outline-gold px-10">View All</Link>
      </div>
    </section>
  )
}
