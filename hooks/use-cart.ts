"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image_url: string
}

interface CartStore {
  items: CartItem[]
  addItem: (item: { id: string; name: string; price: number; image_url: string }) => void
  removeItem: (id: string) => void
  clearCart: () => void
  getItemQuantity: (id: string) => number
  getTotalPrice: () => number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id)
          if (existingItem) {
            return {
              items: state.items.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)),
            }
          }
          return {
            items: [...state.items, { ...item, quantity: 1 }],
          }
        }),
      removeItem: (id) =>
        set((state) => {
          const existingItem = state.items.find((i) => i.id === id)
          if (existingItem && existingItem.quantity > 1) {
            return {
              items: state.items.map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i)),
            }
          }
          return {
            items: state.items.filter((i) => i.id !== id),
          }
        }),
      clearCart: () => set({ items: [] }),
      getItemQuantity: (id) => {
        const item = get().items.find((i) => i.id === id)
        return item ? item.quantity : 0
      },
      getTotalPrice: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      },
    }),
    {
      name: "cart-storage",
    },
  ),
)
