'use client'
import { useState } from 'react'
import { Heart, ShieldCheck, RefreshCw, Truck, BarChart3, Share2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useCart } from '@/components/cart/CartProvider'
import type { Product } from '@/types'

export function ProductInfo({ product }: { product: Product }) {
  const { addItem } = useCart()
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product.variants?.find(v => v.is_active)?.id ?? product.variants?.[0]?.id ?? ''
  )
  const [wishlisted, setWishlisted] = useState(false)

  const activeVariants = product.variants?.filter(v => v.is_active) ?? []
  const selectedVariant = activeVariants.find(v => v.id === selectedVariantId) ?? activeVariants[0]
  const isOnSale = selectedVariant?.compare_at_price && selectedVariant.compare_at_price > selectedVariant.price
  const discount = isOnSale ? Math.round((1 - selectedVariant!.price / selectedVariant!.compare_at_price!) * 100) : 0
  const isLowStock = selectedVariant && (selectedVariant.stock_quantity - selectedVariant.reserved_quantity) <= selectedVariant.low_stock_threshold

  return (
    <div>
      <p className="text-[9px] tracking-[4px] uppercase text-[#C9A84C] mb-3 font-semibold">{(product as any).brand?.name}</p>
      <h1 className="font-display text-5xl md:text-6xl font-light leading-[1.05] mb-2 text-[#2A2420]">{product.name}</h1>
      {(product as any).tagline && <p className="text-[11px] tracking-[2px] italic text-[#9A8A7A] mb-4">{(product as any).tagline}</p>}

      {/* Rating */}
      {(product.review_count ?? 0) > 0 && (
        <div className="flex items-center gap-3 mb-5">
          <div className="flex gap-0.5">
            {[1,2,3,4,5].map(s => (
              <svg key={s} className={`w-3 h-3 ${s <= Math.round(product.average_rating ?? 0) ? 'text-[#C9A84C]' : 'text-[#D5C9BA]'}`} viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            ))}
          </div>
          <span className="text-[10px] text-[#9A8A7A]">{(product.average_rating ?? 0).toFixed(1)} ({product.review_count} reviews)</span>
          <span className="flex items-center gap-1 text-[10px] text-emerald-600 ml-2"><ShieldCheck size={12} /> Authenticated</span>
        </div>
      )}

      {/* Price */}
      <div className="flex items-baseline gap-3 mb-6">
        <span className="font-display text-5xl text-[#2A2420]">${selectedVariant?.price?.toFixed(0) ?? '—'}</span>
        {isOnSale && (
          <>
            <span className="font-display text-2xl text-[#9A8A7A] line-through">${selectedVariant!.compare_at_price!.toFixed(0)}</span>
            <span className="badge-gold">Save {discount}%</span>
          </>
        )}
      </div>

      <div className="h-px bg-[rgba(42,36,32,0.08)] mb-6" />

      {/* Size selection */}
      {activeVariants.length > 0 && (
        <div className="mb-6">
          <p className="text-[9px] tracking-[3px] uppercase text-[#9A8A7A] mb-3 font-medium">Select Size</p>
          <div className="flex gap-2 flex-wrap">
            {activeVariants.map(v => (
              <button key={v.id} onClick={() => setSelectedVariantId(v.id)}
                className={`px-4 py-2.5 border text-[10px] tracking-[1px] transition-all duration-300 ${
                  v.id === selectedVariantId
                    ? 'border-[#C9A84C] text-[#C9A84C] bg-[rgba(201,168,76,0.06)]'
                    : 'border-[rgba(42,36,32,0.15)] text-[#6B5E4A] hover:border-[#C9A84C]'
                } ${v.stock_quantity === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
                disabled={v.stock_quantity === 0}>
                {v.size_ml}ml{v.stock_quantity === 0 ? ' — Out' : ''}
              </button>
            ))}
          </div>
          {isLowStock && selectedVariant && (
            <p className="text-[9px] text-amber-600 mt-2">⚠ Only {selectedVariant.stock_quantity - selectedVariant.reserved_quantity} left</p>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <button onClick={() => { if (selectedVariant) { addItem(product, selectedVariant); toast.success(`${product.name} added`) } }}
          className="btn-dark flex-1 min-w-[160px] py-4" disabled={!selectedVariant || selectedVariant.stock_quantity === 0}>
          Add to Cart
        </button>
        <button onClick={() => { if (selectedVariant) { addItem(product, selectedVariant); window.location.href = '/checkout' } }}
          className="btn-outline-gold flex-1 min-w-[120px] py-4" disabled={!selectedVariant || selectedVariant.stock_quantity === 0}>
          Buy Now
        </button>
        <button onClick={() => { setWishlisted(!wishlisted); toast.success(wishlisted ? 'Removed' : 'Saved') }}
          className={`w-12 h-12 flex items-center justify-center border transition-all ${wishlisted ? 'bg-[#C9A84C] border-[#C9A84C] text-white' : 'border-[rgba(42,36,32,0.15)] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-white hover:border-[#C9A84C]'}`}>
          <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Trust badges */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { icon: Truck, label: 'Free Shipping', sub: 'Orders over QAR 550' },
          { icon: ShieldCheck, label: '100% Authentic', sub: 'Verified guarantee' },
          { icon: RefreshCw, label: 'Free Returns', sub: '30-day policy' },
        ].map(({ icon: Icon, label, sub }) => (
          <div key={label} className="text-center p-3 border border-[rgba(42,36,32,0.08)] hover:border-[rgba(201,168,76,0.3)] transition-colors bg-white">
            <Icon size={16} className="text-[#C9A84C] mx-auto mb-1.5" />
            <p className="text-[9px] tracking-[0.5px] font-medium text-[#2A2420] mb-0.5">{label}</p>
            <p className="text-[8px] text-[#9A8A7A]">{sub}</p>
          </div>
        ))}
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-3 bg-white border border-[rgba(42,36,32,0.07)] p-4">
        {[
          { label: 'Fragrance Family', value: (product as any).fragrance_family?.replace('_', ' ') },
          { label: 'Concentration', value: (product as any).concentration?.toUpperCase() },
          { label: 'Perfumer', value: (product as any).perfumer },
          { label: 'Release Year', value: (product as any).release_year },
          { label: 'Country', value: (product as any).country_of_origin },
          { label: 'Gender', value: product.gender_target },
        ].filter(d => d.value).map(({ label, value }) => (
          <div key={label} className="py-2">
            <p className="text-[8px] tracking-[2px] uppercase text-[#9A8A7A] mb-0.5 font-medium">{label}</p>
            <p className="text-[11px] capitalize text-[#2A2420] font-medium">{value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
