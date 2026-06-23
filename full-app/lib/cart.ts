import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartItem {
  productId: string
  variantId?: string
  name: string
  price: number
  quantity: number
  image?: string
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: string, variantId?: string) => void
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const items = get().items
        const existingIndex = items.findIndex(
          i => i.productId === item.productId && i.variantId === item.variantId
        )
        
        if (existingIndex >= 0) {
          const newItems = [...items]
          newItems[existingIndex].quantity += item.quantity
          set({ items: newItems })
        } else {
          set({ items: [...items, item] })
        }
      },
      
      removeItem: (productId, variantId) => {
        set({
          items: get().items.filter(
            i => !(i.productId === productId && i.variantId === variantId)
          ),
        })
      },
      
      updateQuantity: (productId, quantity, variantId) => {
        const items = get().items.map(item => {
          if (item.productId === productId && item.variantId === variantId) {
            return { ...item, quantity }
          }
          return item
        })
        set({ items })
      },
      
      clearCart: () => set({ items: [] }),
      
      getTotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      },
      
      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },
    }),
    {
      name: 'e-clean-cart',
    }
  )
)