'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

const SORT_OPTIONS = [
  { value: 'default', label: 'Featured' },
  { value: 'newest', label: 'Newest First' },
  { value: 'bestseller', label: 'Best Sellers' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
]

export function ShopSort({ currentSort }: { currentSort?: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(false)
  const active = SORT_OPTIONS.find(o => o.value === (currentSort ?? 'default')) ?? SORT_OPTIONS[0]

  const setSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', value)
    params.delete('page')
    router.push(`/shop?${params.toString()}`)
    setOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 border border-[rgba(201,168,76,0.2)] px-4 py-2 text-[10px] tracking-[1px] hover:border-[rgba(201,168,76,0.5)] transition-colors"
      >
        <span className="text-[#5A5048]">Sort:</span>
        <span className="text-[#C9A84C]">{active.label}</span>
        <ChevronDown size={12} className={`text-[#5A5048] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-[#1E1E1E] border border-[rgba(201,168,76,0.2)] z-20 shadow-xl">
          {SORT_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setSort(opt.value)}
              className={`block w-full text-left px-4 py-3 text-[10px] tracking-[0.5px] hover:bg-[rgba(201,168,76,0.08)] transition-colors ${
                opt.value === active.value ? 'text-[#C9A84C]' : 'text-[#6B5E4A]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
