'use client'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import type { Category } from '@/types'

// Elegant SVG icons for each category
const CATEGORY_ICONS: Record<string, React.FC<{ className?: string }>> = {
  women: ({ className }) => (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="12" r="5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M14 28c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M20 28v6M17 32h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M10 22c2-3 5-5 10-5s8 2 10 5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeDasharray="1 2"/>
    </svg>
  ),
  men: ({ className }) => (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="13" r="5.5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M11 34c0-4.971 4.029-9 9-9s9 4.029 9 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M28 8l4-4M32 8h-4V4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  unisex: ({ className }) => (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="18" r="7" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M20 25v9M16 30h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M26 8l5-5M31 8h-5V3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  'arabic-perfumes': ({ className }) => (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 32h16M14 32V20c0-4 2-8 6-10 4 2 6 6 6 10v12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M20 10V6M17 8l3-4 3 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 24h8M16 27h8" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  ),
  'niche-fragrances': ({ className }) => (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 4l2.472 7.608H30.18l-6.09 4.424 2.472 7.608L20 19.216l-6.562 4.424 2.472-7.608L9.82 11.608h7.708L20 4z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
      <circle cx="20" cy="30" r="4" stroke="currentColor" strokeWidth="1.2"/>
    </svg>
  ),
  'luxury-gift-sets': ({ className }) => (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="18" width="24" height="16" rx="1" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M8 22h24" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M20 18V34" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M20 18c0 0-4-2-4-6 0-2 1.5-3 3-2 1 .5 1.5 2 1 3M20 18c0 0 4-2 4-6 0-2-1.5-3-3-2-1 .5-1.5 2-1 3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
    </svg>
  ),
  'travel-sizes': ({ className }) => (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="13" y="14" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M16 14v-2a2 2 0 014 0v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M20 18v10M17 23h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
  'home-fragrances': ({ className }) => (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 8v4M15 10l2 3M25 10l-2 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M14 18c0-3.314 2.686-6 6-6s6 2.686 6 6v14H14V18z" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M10 32h20" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M17 22h6M17 26h6" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  ),
  'incense-bakhoor': ({ className }) => (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 6c0 4-6 6-6 11a6 6 0 0012 0c0-5-6-7-6-11z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 34h8M18 34v-6M22 34v-6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M14 20c-2 1-2 3 0 4M26 20c2 1 2 3 0 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeDasharray="1 1.5"/>
    </svg>
  ),
}

// Default generic perfume bottle icon
const DefaultIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 12h8M17 12V9a1 1 0 011-1h4a1 1 0 011 1v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M13 32V18c0-3 1.5-6 7-6s7 3 7 6v14a2 2 0 01-2 2H15a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="1.2"/>
    <path d="M16 22h8M16 26h8" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
  </svg>
)

interface CategoriesGridProps { categories: Category[] }

export function CategoriesGrid({ categories }: CategoriesGridProps) {
  if (!categories.length) return null

  return (
    <section className="px-6 md:px-12 py-20 bg-[#FAF7F2]">
      <div className="text-center mb-14">
        <p className="section-eyebrow">Shop by Category</p>
        <h2 className="section-title">Explore Our <em className="gold-text">Collections</em></h2>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4 max-w-6xl mx-auto">
        {categories.map((cat, i) => {
          const Icon = CATEGORY_ICONS[cat.slug] ?? DefaultIcon
          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              viewport={{ once: true }}
            >
              <Link
                href={`/shop?category=${cat.slug}`}
                className="group flex flex-col items-center gap-3 p-3 text-center hover:bg-white hover:shadow-md transition-all duration-300 rounded-sm"
              >
                {/* Icon box */}
                {cat.image_url ? (
                  <div className="w-14 h-14 overflow-hidden rounded-sm border border-[rgba(201,168,76,0.2)] group-hover:border-[#C9A84C] transition-colors">
                    <Image src={cat.image_url} alt={cat.name} width={56} height={56} className="object-cover w-full h-full" />
                  </div>
                ) : (
                  <div className="w-14 h-14 flex items-center justify-center border border-[rgba(42,36,32,0.1)] group-hover:border-[#C9A84C] group-hover:bg-[rgba(201,168,76,0.04)] transition-all duration-300 rounded-sm">
                    <Icon className="w-7 h-7 text-[#9A8A7A] group-hover:text-[#C9A84C] transition-colors duration-300" />
                  </div>
                )}
                <span className="text-[8px] tracking-[1.5px] uppercase text-[#6B5E4A] group-hover:text-[#C9A84C] transition-colors leading-tight font-medium">
                  {cat.name}
                </span>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
