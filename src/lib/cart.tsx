"use client"

import * as React from "react"
import { isShopifyConfigured, createCart, addToCart, redirectToCheckout, ShopifyCart } from "./shopify"

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
  variantId?: string // Shopify variant ID if integrated
}

interface CartContextType {
  items: CartItem[]
  itemCount: number
  total: number
  shopifyCart: ShopifyCart | null
  isShopifyReady: boolean
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  checkout: () => Promise<void>
  initShopifyCart: () => Promise<void>
}

const CartContext = React.createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = "no-name-cart"

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>([])
  const [shopifyCart, setShopifyCart] = React.useState<ShopifyCart | null>(null)
  const [isInitialized, setIsInitialized] = React.useState(false)

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0)
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0)

  // Load cart from localStorage on mount
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        setItems(parsed.items || [])
      }
    } catch {
      // Ignore localStorage errors
    }
    setIsInitialized(true)
  }, [])

  // Save cart to localStorage on changes
  React.useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ items }))
      } catch {
        // Ignore localStorage errors
      }
    }
  }, [items, isInitialized])

  // Initialize Shopify cart if configured
  const initShopifyCart = React.useCallback(async () => {
    if (!isShopifyConfigured) return
    
    const savedCartId = sessionStorage.getItem("shopify-cart-id")
    if (savedCartId && !shopifyCart) {
      // Could restore existing cart here if needed
      // For now, start fresh
    }
  }, [shopifyCart])

  const addItem = React.useCallback((item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i
        )
      }
      return [...prev, { ...item, quantity: item.quantity || 1 }]
    })

    // If Shopify is configured and we have a cart, add item to Shopify too
    if (isShopifyConfigured && shopifyCart && item.variantId) {
      addToCart(shopifyCart.id, item.variantId, item.quantity || 1).then(setShopifyCart)
    }
  }, [shopifyCart])

  const removeItem = React.useCallback((id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const updateQuantity = React.useCallback((id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    )
  }, [removeItem])

  const clearCart = React.useCallback(() => {
    setItems([])
    setShopifyCart(null)
    sessionStorage.removeItem("shopify-cart-id")
  }, [])

  const checkout = React.useCallback(async () => {
    if (!isShopifyConfigured) {
      return
    }

    try {
      const cart = await createCart()
      
      // Add all items to Shopify cart
      for (const item of items) {
        if (item.variantId) {
          await addToCart(cart.id, item.variantId, item.quantity)
        }
      }
      
      redirectToCheckout(cart)
    } catch (error) {
      console.error("Checkout error:", error)
      throw error
    }
  }, [items])

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        total,
        shopifyCart,
        isShopifyReady: isShopifyConfigured,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        checkout,
        initShopifyCart,
      }}
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