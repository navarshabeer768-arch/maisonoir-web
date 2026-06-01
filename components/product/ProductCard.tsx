'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, BarChart3 } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { useCart } from '@/components/cart/CartProvider'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
  priority?: boolean
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [hovered, setHovered] = useState(false)
  const { addItem } = useCart()

  const primaryImage = product.images?.find(i => i.is_primary) ?? product.images?.[0]
  const defaultVariant = product.variants?.find(v => v.is_active) ?? product.variants?.[0]
  const isOnSale = defaultVariant?.compare_at_price && defaultVariant.compare_at_price > defaultVariant.price
  const discount = isOnSale
    ? Math.round((1 - defaultVariant!.price / defaultVariant!.compare_at_price!) * 100)
    : 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!defaultVariant) return
    addItem(product, defaultVariant)
    toast.success(`${product.name} added to cart`)
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsWishlisted(!isWishlisted)
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist')
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-[#1A1A1A] dark:bg-[#1A1A1A] border border-transparent hover:border-[rgba(201,168,76,0.2)] transition-all duration-500"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <Link href={`/product/${product.slug}`}>
        {/* Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
          {product.is_new_arrival && <span className="badge-gold">New</span>}
          {product.is_bestseller && !product.is_new_arrival && <span className="badge-gold">Bestseller</span>}
          {product.is_exclusive && <span className="badge-outline">Exclusive</span>}
          {product.is_arabic_collection && <span className="badge-outline">Arabic</span>}
          {isOnSale && <span className="badge-gold">−{discount}%</span>}
        </div>

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          className={`absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center border transition-all duration-300 ${
            isWishlisted
              ? 'bg-[#C9A84C] border-[#C9A84C] text-[#0A0A0A]'
              : 'border-[rgba(201,168,76,0.3)] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0A0A0A]'
          }`}
        >
          <Heart size={14} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>

        {/* Image */}
        <div className="relative aspect-[3/4] bg-[#141414] overflow-hidden">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt_text ?? product.name}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority={priority}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-8xl opacity-30">🫙</span>
            </div>
          )}

          {/* Hover overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: hovered ? 1 : 0 }}
            className="absolute inset-0 bg-[rgba(10,10,10,0.6)] flex flex-col items-center justify-center gap-3"
          >
            <button
              onClick={handleAddToCart}
              className="btn-gold text-[8px] tracking-[3px] px-6 py-3"
            >
              Add to Cart
            </button>
            <span className="text-[9px] tracking-[2px] uppercase text-[rgba(201,168,76,0.8)] hover:text-[#C9A84C] transition-colors">
              Quick View
            </span>
          </motion.div>
        </div>

        {/* Info */}
        <div className="p-5">
          <p className="text-[8px] tracking-[3px] uppercase text-[#C9A84C] mb-1.5">
            {product.brand?.name}
          </p>
          <h3 className="font-display text-[18px] font-light mb-1.5 leading-tight">
            {product.name}
          </h3>
          <p className="text-[9px] tracking-[1px] uppercase text-[#5A5048] mb-3 truncate">
            {product.notes?.filter(n => n.note_type === 'top').slice(0, 3).map(n => n.note.name).join(' · ')}
          </p>

          {/* Rating */}
          {product.review_count > 0 && (
            <div className="flex items-center gap-2 mb-3">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(s => (
                  <svg key={s} className={`w-2.5 h-2.5 ${s <= Math.round(product.average_rating) ? 'text-[#C9A84C]' : 'text-[#3A3A3A]'}`} viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-[9px] text-[#5A5048]">({product.review_count})</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="font-display text-xl text-[#C9A84C]">
              ${defaultVariant?.price?.toFixed(0) ?? '—'}
            </span>
            {isOnSale && (
              <span className="font-display text-sm text-[#5A5048] line-through">
                ${defaultVariant?.compare_at_price?.toFixed(0)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
