"use client"

import { useEffect } from "react"
import { Link } from "wouter"
import { motion } from "framer-motion"
import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@/hooks/use-auth"
import { MotionButton } from "@/components/ui/button"

interface Order {
  id: string
  status: string
  totalCents: number
  createdAt: string
  shippingAddress: { recipientName: string; city: string; country: string }
  items: Array<{ productName: string; quantity: number; unitPrice: number }>
}

export default function OrdersPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()

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

  return (
    <div className="min-h-screen bg-black pt-32 pb-64 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-7xl font-bold uppercase tracking-tighter leading-none mb-12"
          data-testid="text-orders-heading"
        >
          Orders
        </motion.h1>

        {ordersQuery.isLoading ? (
          <p className="text-white/40 text-xs uppercase tracking-widest">Loading…</p>
        ) : ordersQuery.data && ordersQuery.data.length > 0 ? (
          <ul className="space-y-6">
            {ordersQuery.data.map((order) => (
              <li key={order.id} className="border border-white/10 p-6" data-testid={`row-order-${order.id}`}>
                <div className="flex flex-wrap items-baseline justify-between gap-4 mb-4">
                  <div>
                    <div className="uppercase text-[10px] tracking-[0.3em] text-white/40">Order</div>
                    <div className="font-mono text-xs break-all" data-testid={`text-order-id-${order.id}`}>
                      {order.id}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="uppercase text-[10px] tracking-[0.3em] text-white/40">Total</div>
                    <div className="font-mono text-sm font-bold">${(order.totalCents / 100).toFixed(2)}</div>
                  </div>
                </div>
                <div className="text-xs uppercase tracking-widest text-white/60 mb-3">
                  {new Date(order.createdAt).toLocaleString()} · {order.status}
                </div>
                <ul className="text-xs uppercase tracking-widest text-white/70 space-y-1">
                  {order.items.map((item, i) => (
                    <li key={i}>
                      {item.productName} × {item.quantity}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        ) : (
          <div className="border border-white/10 p-12 text-center">
            <p className="text-white/60 uppercase tracking-widest text-xs mb-8">No orders yet.</p>
            <Link href="/shop">
              <MotionButton className="px-12 py-4 uppercase tracking-[0.2em] text-xs font-bold">
                Start shopping
              </MotionButton>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
