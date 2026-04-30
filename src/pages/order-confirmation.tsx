"use client"

import { useEffect, useMemo } from "react"
import { useLocation, Link } from "wouter"
import { motion } from "framer-motion"
import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@/hooks/use-auth"
import { MotionButton } from "@/components/ui/button"
import { Check } from "lucide-react"

interface Order {
  id: string
  status: string
  totalCents: number
  paymentMethod: string
  shippingAddress: {
    recipientName: string
    line1: string
    line2: string | null
    city: string
    region: string
    postalCode: string
    country: string
  }
  items: Array<{
    productName: string
    quantity: number
    unitPrice: number
    size: string | null
    color: string | null
  }>
  createdAt: string
}

export default function OrderConfirmationPage() {
  const [location] = useLocation()
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  const orderId = useMemo(() => {
    const search = location.includes("?") ? location.split("?")[1] : ""
    const params = new URLSearchParams(search)
    return params.get("id") || (typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("id") : null)
  }, [location])

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      window.location.href = "/api/login"
    }
  }, [authLoading, isAuthenticated])

  const ordersQuery = useQuery<Order[]>({
    queryKey: ["/api/orders"],
    queryFn: async () => {
      const res = await fetch("/api/orders", { credentials: "include" })
      if (!res.ok) throw new Error("Failed to load orders")
      return res.json()
    },
    enabled: isAuthenticated,
  })

  const order = ordersQuery.data?.find((o) => o.id === orderId) ?? ordersQuery.data?.[0]

  return (
    <div className="min-h-screen bg-black pt-32 pb-64 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <div className="w-16 h-16 border-2 border-white flex items-center justify-center">
            <Check className="w-8 h-8" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold uppercase tracking-tighter leading-none mb-6 text-center"
          data-testid="text-confirmation-heading"
        >
          Order placed
        </motion.h1>
        <p className="text-white/60 uppercase tracking-widest text-xs text-center mb-12">
          We've received your order and sent a confirmation by email.
        </p>

        {ordersQuery.isLoading ? (
          <p className="text-white/40 text-center text-xs uppercase tracking-widest">Loading…</p>
        ) : order ? (
          <div className="border border-white/10 p-8 space-y-6">
            <div>
              <h3 className="uppercase text-[10px] tracking-[0.3em] text-white/40 mb-2">Order ID</h3>
              <p className="font-mono text-xs break-all" data-testid="text-order-id">{order.id}</p>
            </div>

            <div className="h-px bg-white/10" />

            <div>
              <h3 className="uppercase text-[10px] tracking-[0.3em] text-white/40 mb-3">Shipping to</h3>
              <div className="text-sm uppercase tracking-wider leading-relaxed">
                <div className="font-bold">{order.shippingAddress.recipientName}</div>
                <div className="text-white/60">
                  {order.shippingAddress.line1}
                  {order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ""}
                  <br />
                  {order.shippingAddress.city}, {order.shippingAddress.region} {order.shippingAddress.postalCode}
                  <br />
                  {order.shippingAddress.country}
                </div>
              </div>
            </div>

            <div className="h-px bg-white/10" />

            <div>
              <h3 className="uppercase text-[10px] tracking-[0.3em] text-white/40 mb-3">Items</h3>
              <ul className="space-y-2">
                {order.items.map((item, i) => (
                  <li key={i} className="flex justify-between text-xs uppercase tracking-widest">
                    <span className="truncate pr-2">
                      {item.productName} ({item.color ?? "—"} / {item.size ?? "—"}) × {item.quantity}
                    </span>
                    <span className="font-mono whitespace-nowrap">
                      ${(item.unitPrice * item.quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="h-px bg-white/10" />

            <div className="flex justify-between uppercase tracking-widest text-sm font-bold">
              <span>Total</span>
              <span className="font-mono" data-testid="text-confirmation-total">
                ${(order.totalCents / 100).toFixed(2)}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-white/40 text-center text-xs uppercase tracking-widest">Order not found.</p>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <Link href="/shop" className="block">
            <MotionButton className="px-12 py-4 uppercase tracking-[0.2em] text-xs font-bold w-full">
              Continue shopping
            </MotionButton>
          </Link>
          <Link href="/account/orders" className="block">
            <MotionButton
              variant="outline"
              className="px-12 py-4 uppercase tracking-[0.2em] text-xs font-bold w-full border-white/20 hover:border-white"
            >
              View orders
            </MotionButton>
          </Link>
        </div>
      </div>
    </div>
  )
}
