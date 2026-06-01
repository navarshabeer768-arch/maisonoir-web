'use client'
import { motion } from 'framer-motion'
import type { Product } from '@/types'

interface Bar { label: string; value: number | null }

function PerformanceBar({ label, value }: Bar) {
  if (!value) return null
  const pct = (value / 5) * 100
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-[10px] tracking-[1px] text-[#6B5E4A]">{label}</span>
        <span className="text-[10px] text-[#C9A84C]">{value.toFixed(1)} / 5</span>
      </div>
      <div className="h-0.5 bg-[rgba(201,168,76,0.1)]">
        <motion.div
          className="h-full bg-[#C9A84C]"
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          viewport={{ once: true }}
        />
      </div>
    </div>
  )
}

export function PerformanceIndicators({ product }: { product: Product }) {
  const bars: Bar[] = [
    { label: 'Longevity', value: product.longevity_rating },
    { label: 'Sillage (projection)', value: product.sillage_rating },
    { label: 'Projection', value: product.projection_rating },
    { label: 'Versatility', value: product.versatility_rating },
  ]

  if (bars.every(b => !b.value)) return null

  return (
    <div>
      <p className="section-eyebrow">Performance</p>
      <h3 className="font-display text-2xl font-light mb-5">Characteristics</h3>
      <div className="space-y-4">
        {bars.map(b => <PerformanceBar key={b.label} {...b} />)}
      </div>
    </div>
  )
}
