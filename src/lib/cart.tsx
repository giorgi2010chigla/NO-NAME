"use client"

import * as React from "react"
import { useAuth } from "@/hooks/use-auth"
import { useQueryClient } from "@tanstack/react-query"

export interface CartItem {
  id: string | number
  productId: number
  name: string
  price: number
  quantity: number
  image: string
  size?: string | null
  color?: string | null
}

interface CartContextType {
  items: CartItem[]
  itemCount: number
  total: number
  isLoading: boolean
  addItem: (item: {
    productId: number
    name: string
    price: number
    image: string
    size?: string | null
    color?: string | null
    quantity?: number
  }) => Promise<void>
  removeItem: (id: string | number) => Promise<void>
  updateQuantity: (id: string | number, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  refresh: () => Promise<void>
}

const CartContext = React.createContext<CartContextType | undefined>(undefined)

const LOCAL_KEY = "noname.cart.v1"

interface ServerCartItem {
  id: string
  productId: number
  productName: string
  productImage: string
  unitPrice: number
  size: string | null
  color: string | null
  quantity: number
}

function loadLocal(): CartItem[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(LOCAL_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as CartItem[]
    if (!Array.isArray(parsed)) return []
    return parsed
  } catch {
    return []
  }
}

function saveLocal(items: CartItem[]) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(LOCAL_KEY, JSON.stringify(items))
  } catch {
    // ignore quota errors
  }
}

function fromServer(item: ServerCartItem): CartItem {
  return {
    id: item.id,
    productId: item.productId,
    name: item.productName,
    price: item.unitPrice,
    quantity: item.quantity,
    image: item.productImage,
    size: item.size,
    color: item.color,
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const queryClient = useQueryClient()
  const [items, setItems] = React.useState<CartItem[]>(() => loadLocal())
  const [isLoading, setIsLoading] = React.useState(false)
  const mergedRef = React.useRef(false)

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0)
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0)

  const fetchServerCart = React.useCallback(async (): Promise<CartItem[]> => {
    const res = await fetch("/api/cart", { credentials: "include" })
    if (!res.ok) throw new Error("Failed to load cart")
    const data = (await res.json()) as ServerCartItem[]
    return data.map(fromServer)
  }, [])

  // Sync logic when auth state changes
  React.useEffect(() => {
    if (authLoading) return

    if (!isAuthenticated) {
      // Logged out: load from local storage, reset merge marker
      mergedRef.current = false
      setItems(loadLocal())
      return
    }

    // Authenticated: merge any local items into server cart, then load
    let cancelled = false
    const sync = async () => {
      setIsLoading(true)
      try {
        if (!mergedRef.current) {
          const local = loadLocal()
          if (local.length > 0) {
            await Promise.all(
              local.map((item) =>
                fetch("/api/cart", {
                  method: "POST",
                  credentials: "include",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    productId: item.productId,
                    productName: item.name,
                    productImage: item.image,
                    unitPrice: item.price,
                    size: item.size ?? null,
                    color: item.color ?? null,
                    quantity: item.quantity,
                  }),
                }).catch(() => null)
              )
            )
            saveLocal([])
          }
          mergedRef.current = true
        }
        const server = await fetchServerCart()
        if (!cancelled) setItems(server)
      } catch (err) {
        console.error("[cart] sync failed", err)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    sync()
    return () => {
      cancelled = true
    }
  }, [isAuthenticated, authLoading, fetchServerCart])

  // Persist local cart whenever items change while logged out
  React.useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      saveLocal(items)
    }
  }, [items, isAuthenticated, authLoading])

  const refresh = React.useCallback(async () => {
    if (!isAuthenticated) {
      setItems(loadLocal())
      return
    }
    setIsLoading(true)
    try {
      const server = await fetchServerCart()
      setItems(server)
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, fetchServerCart])

  const addItem: CartContextType["addItem"] = async (item) => {
    const quantity = item.quantity ?? 1
    if (isAuthenticated) {
      const res = await fetch("/api/cart", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: item.productId,
          productName: item.name,
          productImage: item.image,
          unitPrice: item.price,
          size: item.size ?? null,
          color: item.color ?? null,
          quantity,
        }),
      })
      if (!res.ok) throw new Error("Failed to add item")
      await refresh()
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] })
      return
    }
    setItems((prev) => {
      const existing = prev.find(
        (i) =>
          i.productId === item.productId &&
          (i.size ?? null) === (item.size ?? null) &&
          (i.color ?? null) === (item.color ?? null)
      )
      if (existing) {
        return prev.map((i) =>
          i === existing ? { ...i, quantity: i.quantity + quantity } : i
        )
      }
      return [
        ...prev,
        {
          id: `local-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity,
          image: item.image,
          size: item.size ?? null,
          color: item.color ?? null,
        },
      ]
    })
  }

  const removeItem: CartContextType["removeItem"] = async (id) => {
    if (isAuthenticated) {
      await fetch(`/api/cart/${id}`, { method: "DELETE", credentials: "include" })
      await refresh()
      return
    }
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  const updateQuantity: CartContextType["updateQuantity"] = async (id, quantity) => {
    if (quantity <= 0) {
      await removeItem(id)
      return
    }
    if (isAuthenticated) {
      await fetch(`/api/cart/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      })
      await refresh()
      return
    }
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)))
  }

  const clearCart: CartContextType["clearCart"] = async () => {
    if (isAuthenticated) {
      await fetch("/api/cart", { method: "DELETE", credentials: "include" })
      await refresh()
      return
    }
    setItems([])
    saveLocal([])
  }

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        total,
        isLoading,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        refresh,
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
