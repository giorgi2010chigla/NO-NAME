"use client"

import * as React from "react"

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  itemCount: number
  total: number
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  setIsOpen: (open: boolean) => void
  isOpen: boolean
}

const CartContext = React.createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>([])
  const [isOpen, setIsOpen] = React.useState(false)

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0)
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0)

  const addItem = (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i
        )
      }
      return [...prev, { ...item, quantity: item.quantity || 1 }]
    })
  }

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    )
  }

  return (
    <CartContext.Provider
      value={{ items, itemCount, total, addItem, removeItem, updateQuantity, setIsOpen, isOpen }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = React.useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}