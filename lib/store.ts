import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface CartItem {
  id: number
  name: string
  manufacturer: string
  price: number
  imageUrl: string
  quantity: number
}

export interface City {
  id: number
  name: string
  delivery: {
    fast: number | null
    regular: number | null
    slow: number | null
  }
}

export interface CheckoutData {
  firstName: string
  lastName: string
  email: string
  cityId: number | null
  deliveryType: "fast" | "regular" | "slow" | null
}

export interface User {
  id: number
  name: string
  email: string
}

interface CartStore {
  items: CartItem[]
  checkoutData: CheckoutData
  currentStep: number
  user: User | null
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  updateCheckoutData: (data: Partial<CheckoutData>) => void
  setCurrentStep: (step: number) => void
  setUser: (user: User | null) => void
  getTotalPrice: () => number
  getDeliveryPrice: (cities: City[]) => number
}

const initialCartItems: CartItem[] = [
  {
    id: 1,
    name: "Wireless Headphones",
    manufacturer: "SoundMax",
    price: 129.0,
    imageUrl: "https://picsum.photos/seed/headphones/300/200",
    quantity: 1,
  },
  {
    id: 2,
    name: "Smartphone X12",
    manufacturer: "TechNova",
    price: 899.0,
    imageUrl: "https://picsum.photos/seed/smartphone/300/200",
    quantity: 1,
  },
  {
    id: 3,
    name: "Gaming Laptop Pro",
    manufacturer: "HyperTech",
    price: 1599.5,
    imageUrl: "https://picsum.photos/seed/laptop/300/200",
    quantity: 1,
  },
]

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: initialCartItems,
      checkoutData: {
        firstName: "",
        lastName: "",
        email: "",
        cityId: null,
        deliveryType: null,
      },
      currentStep: 1,
      user: null,

      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id)
          if (existingItem) {
            return {
              items: state.items.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)),
            }
          }
          return { items: [...state.items, { ...item, quantity: 1 }] }
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((item) => (item.id === id ? { ...item, quantity } : item)),
        })),

      clearCart: () => set({ items: [] }),

      updateCheckoutData: (data) =>
        set((state) => ({
          checkoutData: { ...state.checkoutData, ...data },
        })),

      setCurrentStep: (step) => set({ currentStep: step }),

      setUser: (user) => set({ user }),

      getTotalPrice: () => {
        const { items } = get()
        return items.reduce((total, item) => total + item.price * item.quantity, 0)
      },

      getDeliveryPrice: (cities) => {
        const { checkoutData } = get()
        if (!checkoutData.cityId || !checkoutData.deliveryType) return 0

        const city = cities.find((c) => c.id === checkoutData.cityId)
        if (!city) return 0

        return city.delivery[checkoutData.deliveryType] || 0
      },
    }),
    {
      name: "cart-storage",
    },
  )
)
