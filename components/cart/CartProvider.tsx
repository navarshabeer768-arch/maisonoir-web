'use client'
import { createContext, useContext } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product, ProductVariant } from '@/types'

export interface CartItem {
  product: Product
  variant: ProductVariant
  quantity: number
}

interface CartStore {
  items: CartItem[]
  addItem: (product: Product, variant: ProductVariant, quantity?: number) => void
  removeItem: (variantId: string) => void
  updateQuantity: (variantId: string, quantity: number) => void
  clearCart: () => void
  get itemCount(): number
  get subtotal(): number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, variant, quantity = 1) => {
        const items = get().items
        const existing = items.find(i => i.variant.id === variant.id)
        if (existing) {
          set({ items: items.map(i =>
            i.variant.id === variant.id
              ? { ...i, quantity: Math.min(i.quantity + quantity, 10) }
              : i
          )})
        } else {
          set({ items: [...items, { product, variant, quantity }] })
        }
      },

      removeItem: (variantId) => {
        set({ items: get().items.filter(i => i.variant.id !== variantId) })
      },

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId)
          return
        }
        set({ items: get().items.map(i =>
          i.variant.id === variantId ? { ...i, quantity: Math.min(quantity, 10) } : i
        )})
      },

      clearCart: () => set({ items: [] }),

      get itemCount() {
        return get().items.reduce((sum, i) => sum + i.quantity, 0)
      },

      get subtotal() {
        return get().items.reduce((sum, i) => {
          // Ensure price is always a number (handles Zustand rehydration string issue)
          const price = typeof i.variant.price === 'string'
            ? parseFloat(i.variant.price as string)
            : i.variant.price
          return sum + (price * i.quantity)
        }, 0)
      },
    }),
    { name: 'maisonoir-cart' }
  )
)

const CartContext = createContext<CartStore | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  return <CartContext.Provider value={null}>{children}</CartContext.Provider>
}

export function useCart() {
  return useCartStore()
}
