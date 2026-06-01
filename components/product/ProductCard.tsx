'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { useCart } from '@/components/cart/CartProvider'
import type { Product } from '@/types'

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const [wishlisted, setWishlisted] = useState(false)
  const [hovered, setHovered] = useState(false)
  const { addItem } = useCart()

  const primaryImage = product.images?.find(i => i.is_primary) ?? product.images?.[0]
  const defaultVariant = product.variants?.find(v => v.is_active) ?? product.variants?.[0]
  const isOnSale = defaultVariant?.compare_at_price && defaultVariant.compare_at_price > defaultVariant.price
  const discount = isOnSale ? Math.round((1 - defaultVariant!.price / defaultVariant!.compare_at_price!) * 100) : 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!defaultVariant) return
    addItem(product, defaultVariant)
    toast.success(`Added to cart`)
  }

  return (
    <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.25 }}
      className="group relative bg-white border border-[rgba(42,36,32,0.07)] hover:border-[rgba(201,168,76,0.3)] hover:shadow-lg transition-all duration-400"
      onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)}>
      <Link href={`/product/${product.slug}`}>
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          {product.is_new_arrival && <span className="badge-gold">New</span>}
          {product.is_bestseller && !product.is_new_arrival && <span className="badge-gold">Bestseller</span>}
          {product.is_exclusive && <span className="badge-outline">Exclusive</span>}
          {isOnSale && <span className="badge-gold">−{discount}%</span>}
        </div>

        {/* Wishlist */}
        <button onClick={e => { e.preventDefault(); setWishlisted(!wishlisted); toast.success(wishlisted ? 'Removed' : 'Saved') }}
          className={`absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center border transition-all duration-300 ${
            wishlisted ? 'bg-[#C9A84C] border-[#C9A84C] text-white' : 'bg-white border-[rgba(42,36,32,0.15)] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-white hover:border-[#C9A84C]'
          }`}>
          <Heart size={13} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>

        {/* Image */}
        <div className="relative aspect-[3/4] bg-[#F5F0E8] overflow-hidden">
          {primaryImage ? (
            <Image src={primaryImage.url} alt={primaryImage.alt_text ?? product.name} fill
              sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-105" priority={priority} />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#F5EFE6] to-[#EDE3D6]">
              <span className="text-7xl opacity-20">🫙</span>
            </div>
          )}
          {/* Quick add overlay */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: hovered ? 1 : 0 }}
            className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-[rgba(42,36,32,0.8)] to-transparent">
            <button onClick={handleAddToCart} className="btn-gold w-full text-[8px] py-2.5">Add to Cart</button>
          </motion.div>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-[8px] tracking-[2.5px] uppercase text-[#C9A84C] mb-1 font-semibold">{product.brand?.name}</p>
          <h3 className="font-display text-[17px] font-light mb-1 text-[#2A2420] leading-tight">{product.name}</h3>
          <p className="text-[9px] tracking-[1px] uppercase text-[#9A8A7A] mb-3 truncate">
            {product.notes?.filter((n: any) => n.note_type === 'top').slice(0, 3).map((n: any) => n.note.name).join(' · ')}
          </p>
          {product.review_count > 0 && (
            <div className="flex items-center gap-1.5 mb-2">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(s => (
                  <svg key={s} className={`w-2.5 h-2.5 ${s <= Math.round(product.average_rating) ? 'text-[#C9A84C]' : 'text-[#D5C9BA]'}`} viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-[9px] text-[#9A8A7A]">({product.review_count})</span>
            </div>
          )}
          <div className="flex items-baseline gap-2">
            <span className="font-display text-xl text-[#2A2420]">${defaultVariant?.price?.toFixed(0) ?? '—'}</span>
            {isOnSale && <span className="text-sm text-[#9A8A7A] line-through">${defaultVariant?.compare_at_price?.toFixed(0)}</span>}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
