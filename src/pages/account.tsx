"use client"

import { useEffect } from "react"
import { Link } from "wouter"
import { motion } from "framer-motion"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { MotionButton } from "@/components/ui/button"

interface Address {
  id: string
  recipientName: string
  line1: string
  line2: string | null
  city: string
  region: string
  postalCode: string
  country: string
  phone: string | null
}

export default function AccountPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = "/api/login"
    }
  }, [isLoading, isAuthenticated])

  const addressesQuery = useQuery<Address[]>({
    queryKey: ["/api/addresses"],
    queryFn: async () => {
      const res = await fetch("/api/addresses", { credentials: "include" })
      if (!res.ok) throw new Error("Failed to load addresses")
      return res.json()
    },
    enabled: isAuthenticated,
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/addresses/${id}`, {
        method: "DELETE",
        credentials: "include",
      })
      if (!res.ok) throw new Error("Failed to delete address")
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/addresses"] })
      toast({ title: "Address removed" })
    },
  })

  return (
    <div className="min-h-screen bg-black pt-32 pb-64 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-7xl font-bold uppercase tracking-tighter leading-none mb-12"
          data-testid="text-account-heading"
        >
          Account
        </motion.h1>

        <section className="border border-white/10 p-8 mb-8">
          <h2 className="uppercase tracking-[0.3em] text-[10px] text-white/40 mb-4">Profile</h2>
          {user ? (
            <div className="space-y-2 text-sm uppercase tracking-wider">
              {(user.firstName || user.lastName) && (
                <p className="font-bold" data-testid="text-account-name">
                  {user.firstName} {user.lastName}
                </p>
              )}
              <p className="text-white/60" data-testid="text-account-email">{user.email}</p>
            </div>
          ) : (
            <p className="text-white/40 text-xs uppercase">Loading…</p>
          )}
        </section>

        <section className="border border-white/10 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="uppercase tracking-[0.3em] text-[10px] text-white/40">Saved addresses</h2>
            <Link href="/checkout" className="text-[10px] uppercase tracking-[0.3em] text-white/60 hover:text-white">
              + Add via checkout
            </Link>
          </div>
          {addressesQuery.isLoading ? (
            <p className="text-white/40 text-xs uppercase">Loading…</p>
          ) : addressesQuery.data && addressesQuery.data.length > 0 ? (
            <ul className="space-y-4">
              {addressesQuery.data.map((addr) => (
                <li key={addr.id} className="border border-white/10 p-4 flex items-start justify-between gap-4">
                  <div className="text-sm uppercase tracking-wider leading-relaxed">
                    <div className="font-bold mb-1">{addr.recipientName}</div>
                    <div className="text-white/60">
                      {addr.line1}
                      {addr.line2 ? `, ${addr.line2}` : ""}
                      <br />
                      {addr.city}, {addr.region} {addr.postalCode}
                      <br />
                      {addr.country}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteMutation.mutate(addr.id)}
                    className="text-[10px] uppercase tracking-[0.3em] text-white/40 hover:text-white"
                    data-testid={`button-delete-address-${addr.id}`}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-white/40 text-xs uppercase tracking-widest">
              No saved addresses yet. Add one during checkout.
            </p>
          )}
        </section>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/account/orders" className="flex-1 block">
            <MotionButton
              variant="outline"
              className="w-full px-12 py-6 uppercase tracking-[0.2em] text-xs font-bold border-white/20 hover:border-white"
              data-testid="link-account-orders"
            >
              View orders
            </MotionButton>
          </Link>
          <a href="/api/logout" className="flex-1 block">
            <MotionButton
              variant="outline"
              className="w-full px-12 py-6 uppercase tracking-[0.2em] text-xs font-bold border-white/20 hover:border-white"
              data-testid="button-logout-account"
            >
              Sign out
            </MotionButton>
          </a>
        </div>
      </div>
    </div>
  )
}
