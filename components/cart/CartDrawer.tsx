'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Minus, Plus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from './CartProvider'

interface CartDrawerProps {
  open: boolean
  onClose: () => void
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, subtotal, itemCount } = useCart()

  const freeShippingThreshold = 150
  const remaining = freeShippingThreshold - subtotal
  const shippingProgress = Math.min((subtotal / freeShippingThreshold) * 100, 100)

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md z-50 bg-[#141414] border-l border-[rgba(201,168,76,0.15)] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-7 border-b border-[rgba(201,168,76,0.1)]">
              <div>
                <h2 className="font-display text-2xl font-light">Your Selection</h2>
                <p className="text-[9px] tracking-[2px] text-[#6B5E4A] uppercase mt-1">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center text-[#6B5E4A] hover:text-[#C9A84C] border border-[rgba(201,168,76,0.2)] hover:border-[#C9A84C] transition-all duration-300 rounded-full"
              >
                <X size={16} />
              </button>
            </div>

            {/* Free shipping progress */}
            {subtotal < freeShippingThreshold && (
              <div className="px-7 py-4 border-b border-[rgba(201,168,76,0.1)]">
                <p className="text-[9px] tracking-[1px] text-[#9A9080] mb-2">
                  Add <span className="text-[#C9A84C]">${remaining.toFixed(0)}</span> more for free shipping
                </p>
                <div className="h-0.5 bg-[rgba(201,168,76,0.1)]">
                  <div
                    className="h-full bg-[#C9A84C] transition-all duration-500"
                    style={{ width: `${shippingProgress}%` }}
                  />
                </div>
              </div>
            )}
            {subtotal >= freeShippingThreshold && (
              <div className="px-7 py-3 border-b border-[rgba(201,168,76,0.1)] bg-[rgba(201,168,76,0.05)]">
                <p className="text-[9px] tracking-[1px] text-[#C9A84C]">✦ You qualify for free shipping</p>
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 px-7">
                  <div className="text-6xl opacity-20">🛒</div>
                  <p className="font-display text-2xl font-light text-[#6B5E4A]">Your cart is empty</p>
                  <p className="text-[10px] tracking-[2px] text-[#6B5E4A] uppercase">Discover our collection</p>
                  <button onClick={onClose} className="btn-outline-gold mt-4">
                    <Link href="/shop">Browse Fragrances</Link>
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-[rgba(201,168,76,0.08)]">
                  {items.map((item) => {
                    const primaryImage = item.product.images?.find(i => i.is_primary) ?? item.product.images?.[0]
                    return (
                      <motion.div
                        key={item.variant.id}
                        layout
                        exit={{ opacity: 0, x: 20 }}
                        className="flex gap-4 p-6"
                      >
                        {/* Image */}
                        <div className="w-20 h-24 bg-[#1E1E1E] flex items-center justify-center shrink-0 overflow-hidden">
                          {primaryImage ? (
                            <Image
                              src={primaryImage.url}
                              alt={item.product.name}
                              width={80}
                              height={96}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <span className="text-3xl">🫙</span>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-[8px] tracking-[2px] uppercase text-[#C9A84C] mb-1">
                            {item.product.brand?.name}
                          </p>
                          <p className="font-display text-base leading-tight mb-1 truncate">{item.product.name}</p>
                          <p className="text-[9px] text-[#6B5E4A] mb-3">{item.variant.size_ml}ml · {item.product.concentration?.toUpperCase()}</p>

                          <div className="flex items-center justify-between">
                            {/* Qty controls */}
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => updateQuantity(item.variant.id, item.quantity - 1)}
                                className="w-6 h-6 flex items-center justify-center border border-[rgba(201,168,76,0.2)] hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all"
                              >
                                <Minus size={10} />
                              </button>
                              <span className="text-sm w-4 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.variant.id, item.quantity + 1)}
                                className="w-6 h-6 flex items-center justify-center border border-[rgba(201,168,76,0.2)] hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all"
                              >
                                <Plus size={10} />
                              </button>
                            </div>
                            <span className="font-display text-lg text-[#C9A84C]">
                              ${(item.variant.price * item.quantity).toFixed(0)}
                            </span>
                          </div>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeItem(item.variant.id)}
                          className="text-[#3A3A3A] hover:text-red-400 transition-colors self-start mt-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-7 border-t border-[rgba(201,168,76,0.1)]">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-[10px] tracking-[2px] uppercase text-[#6B5E4A]">Subtotal</span>
                  <span className="font-display text-xl">${subtotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between items-baseline mb-6">
                  <span className="text-[10px] tracking-[2px] uppercase text-[#6B5E4A]">Shipping</span>
                  <span className="text-sm text-emerald-400">
                    {subtotal >= freeShippingThreshold ? 'Free' : `$${(15).toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between items-baseline mb-6 pb-6 border-b border-[rgba(201,168,76,0.1)]">
                  <span className="text-[10px] tracking-[3px] uppercase font-medium">Total</span>
                  <span className="font-display text-3xl text-[#C9A84C]">
                    ${(subtotal >= freeShippingThreshold ? subtotal : subtotal + 15).toFixed(0)}
                  </span>
                </div>
                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="btn-gold w-full block text-center py-4 text-[9px] tracking-[4px]"
                >
                  Proceed to Checkout
                </Link>
                <button
                  onClick={onClose}
                  className="w-full text-center mt-3 text-[9px] tracking-[2px] uppercase text-[#6B5E4A] hover:text-[#C9A84C] transition-colors py-2"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
