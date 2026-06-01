'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import type { Category } from '@/types'

interface ShopFiltersProps {
  categories: Pick<Category, 'id' | 'slug' | 'name'>[]
  brands: { id: string; slug: string; name: string }[]
  currentParams: Record<string, string | undefined>
}

const GENDERS = [{ value: 'women', label: 'Women' }, { value: 'men', label: 'Men' }, { value: 'unisex', label: 'Unisex' }]
const FAMILIES = ['floral','woody','oriental','fresh','citrus','gourmand','aquatic','arabic_oriental','spicy']
const CONCENTRATIONS = ['parfum','edp','edt','edc','oil']

export function ShopFilters({ categories, brands, currentParams }: ShopFiltersProps) {
  const router = useRouter()

  const updateFilter = useCallback((key: string, value: string | null) => {
    const params = new URLSearchParams()
    Object.entries(currentParams).forEach(([k, v]) => { if (v && k !== key && k !== 'page') params.set(k, v) })
    if (value) params.set(key, value)
    router.push(`/shop?${params.toString()}`)
  }, [currentParams, router])

  const clear = () => router.push('/shop')

  const hasFilters = Object.values(currentParams).some(v => v && v !== '1')

  return (
    <div className="space-y-8">
      {hasFilters && (
        <button onClick={clear} className="text-[9px] tracking-[2px] uppercase text-[#C9A84C] hover:text-[#E8D5A3] transition-colors">
          ✕ Clear All Filters
        </button>
      )}

      {/* Categories */}
      <div>
        <p className="text-[9px] tracking-[4px] uppercase text-[#C9A84C] mb-4">Category</p>
        <div className="space-y-2">
          <button onClick={() => updateFilter('category', null)} className={`block w-full text-left text-[11px] py-1 transition-colors ${!currentParams.category ? 'text-[#C9A84C]' : 'text-[#5A5048] hover:text-[#C9A84C]'}`}>
            All Fragrances
          </button>
          {categories.map(c => (
            <button key={c.id} onClick={() => updateFilter('category', c.slug)} className={`block w-full text-left text-[11px] py-1 transition-colors ${currentParams.category === c.slug ? 'text-[#C9A84C]' : 'text-[#5A5048] hover:text-[#C9A84C]'}`}>
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-[rgba(201,168,76,0.1)]" />

      {/* Gender */}
      <div>
        <p className="text-[9px] tracking-[4px] uppercase text-[#C9A84C] mb-4">For</p>
        <div className="space-y-2">
          {GENDERS.map(g => (
            <button key={g.value} onClick={() => updateFilter('gender', currentParams.gender === g.value ? null : g.value)}
              className={`flex items-center gap-2 w-full text-left text-[11px] py-1 transition-colors ${currentParams.gender === g.value ? 'text-[#C9A84C]' : 'text-[#5A5048] hover:text-[#C9A84C]'}`}>
              <span className={`w-3 h-3 border flex items-center justify-center text-[8px] ${currentParams.gender === g.value ? 'border-[#C9A84C] bg-[#C9A84C] text-[#0A0A0A]' : 'border-[rgba(201,168,76,0.3)]'}`}>
                {currentParams.gender === g.value && '✓'}
              </span>
              {g.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-[rgba(201,168,76,0.1)]" />

      {/* Family */}
      <div>
        <p className="text-[9px] tracking-[4px] uppercase text-[#C9A84C] mb-4">Fragrance Family</p>
        <div className="space-y-2">
          {FAMILIES.map(f => (
            <button key={f} onClick={() => updateFilter('family', currentParams.family === f ? null : f)}
              className={`flex items-center gap-2 w-full text-left text-[11px] py-1 capitalize transition-colors ${currentParams.family === f ? 'text-[#C9A84C]' : 'text-[#5A5048] hover:text-[#C9A84C]'}`}>
              <span className={`w-3 h-3 border flex items-center justify-center text-[8px] ${currentParams.family === f ? 'border-[#C9A84C] bg-[#C9A84C] text-[#0A0A0A]' : 'border-[rgba(201,168,76,0.3)]'}`}>
                {currentParams.family === f && '✓'}
              </span>
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-[rgba(201,168,76,0.1)]" />

      {/* Brands */}
      {brands.length > 0 && (
        <div>
          <p className="text-[9px] tracking-[4px] uppercase text-[#C9A84C] mb-4">Brand</p>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {brands.map(b => (
              <button key={b.id} onClick={() => updateFilter('brand', currentParams.brand === b.slug ? null : b.slug)}
                className={`flex items-center gap-2 w-full text-left text-[11px] py-1 transition-colors ${currentParams.brand === b.slug ? 'text-[#C9A84C]' : 'text-[#5A5048] hover:text-[#C9A84C]'}`}>
                <span className={`w-3 h-3 border flex items-center justify-center text-[8px] shrink-0 ${currentParams.brand === b.slug ? 'border-[#C9A84C] bg-[#C9A84C] text-[#0A0A0A]' : 'border-[rgba(201,168,76,0.3)]'}`}>
                  {currentParams.brand === b.slug && '✓'}
                </span>
                {b.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
