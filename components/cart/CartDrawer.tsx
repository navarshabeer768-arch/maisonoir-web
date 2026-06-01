'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Minus, Plus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from './CartProvider'

interface CartDrawerProps { open: boolean; onClose: () => void }

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, subtotal, itemCount } = useCart()
  const freeShipping = 150
  const remaining = freeShipping - subtotal
  const progress = Math.min((subtotal / freeShipping) * 100, 100)
  const shipping = subtotal >= freeShipping ? 0 : 15
  const total = subtotal + shipping

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" onClick={onClose} />
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md z-50 bg-white border-l border-[rgba(42,36,32,0.1)] flex flex-col shadow-2xl">
            
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[rgba(42,36,32,0.08)]">
              <div>
                <h2 className="font-display text-2xl font-light text-[#2A2420]">Your Selection</h2>
                <p className="text-[9px] tracking-[2px] text-[#9A8A7A] uppercase mt-0.5">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
              </div>
              <button onClick={onClose} className="w-9 h-9 flex items-center justify-center text-[#9A8A7A] hover:text-[#2A2420] border border-[rgba(42,36,32,0.1)] hover:border-[rgba(42,36,32,0.3)] rounded-full transition-all">
                <X size={16} />
              </button>
            </div>

            {/* Shipping progress */}
            {subtotal < freeShipping ? (
              <div className="px-6 py-3 border-b border-[rgba(42,36,32,0.06)] bg-amber-50">
                <p className="text-[9px] tracking-[1px] text-[#6B5E4A] mb-1.5">
                  Add <span className="text-[#C9A84C] font-semibold">${remaining.toFixed(0)}</span> more for free shipping
                </p>
                <div className="h-1 bg-[rgba(42,36,32,0.08)] rounded-full">
                  <div className="h-full bg-[#C9A84C] rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>
              </div>
            ) : (
              <div className="px-6 py-2.5 border-b border-emerald-100 bg-emerald-50">
                <p className="text-[9px] tracking-[1px] text-emerald-700">✓ You qualify for free shipping</p>
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 px-7">
                  <span className="text-5xl opacity-20">🛒</span>
                  <p className="font-display text-2xl font-light text-[#9A8A7A]">Your cart is empty</p>
                  <button onClick={onClose}>
                    <Link href="/shop" className="btn-dark mt-2 text-[9px]">Browse Fragrances</Link>
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-[rgba(42,36,32,0.06)]">
                  {items.map(item => {
                    const img = item.product.images?.find(i => i.is_primary) ?? item.product.images?.[0]
                    return (
                      <motion.div key={item.variant.id} layout exit={{ opacity: 0, x: 20 }} className="flex gap-4 p-5">
                        <div className="w-16 h-20 bg-[#F5F0E8] flex items-center justify-center shrink-0 overflow-hidden">
                          {img ? <Image src={img.url} alt={item.product.name} width={64} height={80} className="object-cover w-full h-full" /> : <span className="text-2xl">🫙</span>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[8px] tracking-[2px] uppercase text-[#C9A84C] font-semibold mb-0.5">{item.product.brand?.name}</p>
                          <p className="font-display text-base leading-tight mb-1 text-[#2A2420] truncate">{item.product.name}</p>
                          <p className="text-[9px] text-[#9A8A7A] mb-3">{item.variant.size_ml}ml</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 border border-[rgba(42,36,32,0.15)]">
                              <button onClick={() => updateQuantity(item.variant.id, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center hover:bg-[#FAF7F2] transition-colors"><Minus size={10} /></button>
                              <span className="text-sm w-4 text-center text-[#2A2420]">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.variant.id, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center hover:bg-[#FAF7F2] transition-colors"><Plus size={10} /></button>
                            </div>
                            <span className="font-display text-lg text-[#2A2420]">${(item.variant.price * item.quantity).toFixed(0)}</span>
                          </div>
                        </div>
                        <button onClick={() => removeItem(item.variant.id)} className="text-[#C5BDB5] hover:text-red-400 transition-colors self-start mt-1">
                          <Trash2 size={13} />
                        </button>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-[rgba(42,36,32,0.08)] bg-[#FAF7F2]">
                <div className="space-y-2 mb-5">
                  <div className="flex justify-between text-[11px] text-[#6B5E4A]">
                    <span>Subtotal</span><span className="text-[#2A2420]">${subtotal.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#6B5E4A]">Shipping</span>
                    <span className={shipping === 0 ? 'text-emerald-600' : 'text-[#2A2420]'}>{shipping === 0 ? 'Free' : `$${shipping}`}</span>
                  </div>
                  <div className="flex justify-between pt-2.5 border-t border-[rgba(42,36,32,0.08)]">
                    <span className="text-[9px] tracking-[2px] uppercase font-semibold text-[#2A2420]">Total</span>
                    <span className="font-display text-2xl text-[#2A2420]">${total.toFixed(0)}</span>
                  </div>
                </div>
                <Link href="/checkout" onClick={onClose} className="btn-dark w-full block text-center py-4 text-[9px] tracking-[3px]">
                  Proceed to Checkout
                </Link>
                <button onClick={onClose} className="w-full text-center mt-3 text-[9px] tracking-[2px] uppercase text-[#9A8A7A] hover:text-[#C9A84C] transition-colors py-1">
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
