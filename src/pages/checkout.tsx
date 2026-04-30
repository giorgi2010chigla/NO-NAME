"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useLocation } from "wouter"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useCart } from "@/lib/cart"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { MotionButton } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check, ChevronRight, Loader2 } from "lucide-react"
import { getAssetPath } from "@/lib/utils"

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

type Step = "address" | "payment" | "review"

const STEPS: { id: Step; label: string }[] = [
  { id: "address", label: "Address" },
  { id: "payment", label: "Payment" },
  { id: "review", label: "Confirm" },
]

const PAYMENT_OPTIONS = [
  { id: "visa", label: "Visa" },
  { id: "mastercard", label: "Mastercard" },
  { id: "google_pay", label: "Google Pay" },
] as const

type PaymentMethod = (typeof PAYMENT_OPTIONS)[number]["id"]

function emptyAddressForm() {
  return {
    recipientName: "",
    line1: "",
    line2: "",
    city: "",
    region: "",
    postalCode: "",
    country: "",
    phone: "",
  }
}

export default function CheckoutPage() {
  const [, setLocation] = useLocation()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { items, total, isLoading: cartLoading } = useCart()

  const [step, setStep] = React.useState<Step>("address")
  const [selectedAddressId, setSelectedAddressId] = React.useState<string | null>(null)
  const [showAddressForm, setShowAddressForm] = React.useState(false)
  const [addressForm, setAddressForm] = React.useState(emptyAddressForm())
  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>("visa")
  const [paymentReference, setPaymentReference] = React.useState("")

  React.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      window.location.href = "/api/login"
    }
  }, [authLoading, isAuthenticated])

  const addressesQuery = useQuery<Address[]>({
    queryKey: ["/api/addresses"],
    queryFn: async () => {
      const res = await fetch("/api/addresses", { credentials: "include" })
      if (!res.ok) throw new Error("Failed to load addresses")
      return res.json()
    },
    enabled: isAuthenticated,
  })

  React.useEffect(() => {
    const list = addressesQuery.data
    if (list && list.length > 0 && !selectedAddressId) {
      setSelectedAddressId(list[0].id)
    }
    if (list && list.length === 0) {
      setShowAddressForm(true)
    }
  }, [addressesQuery.data, selectedAddressId])

  const createAddressMutation = useMutation({
    mutationFn: async (data: typeof addressForm) => {
      const res = await fetch("/api/addresses", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientName: data.recipientName,
          line1: data.line1,
          line2: data.line2 || null,
          city: data.city,
          region: data.region,
          postalCode: data.postalCode,
          country: data.country,
          phone: data.phone || null,
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || "Failed to save address")
      }
      return (await res.json()) as Address
    },
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: ["/api/addresses"] })
      setSelectedAddressId(created.id)
      setShowAddressForm(false)
      setAddressForm(emptyAddressForm())
      toast({ title: "Address saved" })
    },
    onError: (err: Error) => {
      toast({
        title: "Could not save address",
        description: err.message,
        variant: "destructive",
      })
    },
  })

  const checkoutMutation = useMutation({
    mutationFn: async () => {
      if (!selectedAddressId) throw new Error("No shipping address selected")
      const res = await fetch("/api/checkout", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          addressId: selectedAddressId,
          paymentMethod,
          paymentReference: paymentReference || undefined,
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || "Checkout failed")
      }
      return (await res.json()) as { id: string }
    },
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] })
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] })
      setLocation(`/order-confirmation?id=${order.id}`)
    },
    onError: (err: Error) => {
      toast({
        title: "Checkout failed",
        description: err.message,
        variant: "destructive",
      })
    },
  })

  if (authLoading || (!isAuthenticated && authLoading === false)) {
    return (
      <div className="min-h-screen bg-black pt-32 pb-64 px-6 flex items-center justify-center text-white/60 uppercase tracking-widest text-xs">
        Redirecting to sign-in…
      </div>
    )
  }

  if (cartLoading) {
    return (
      <div className="min-h-screen bg-black pt-32 pb-64 px-6 flex items-center justify-center text-white/60 uppercase tracking-widest text-xs">
        Loading cart…
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-black pt-32 pb-64 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter leading-none mb-8">
            Cart is empty
          </h1>
          <p className="text-white/60 uppercase tracking-widest text-xs mb-12">
            Add something to your bag before checking out.
          </p>
          <MotionButton
            onClick={() => setLocation("/shop")}
            className="px-12 py-6 uppercase tracking-[0.2em] font-bold"
          >
            Back to shop
          </MotionButton>
        </div>
      </div>
    )
  }

  const selectedAddress = addressesQuery.data?.find((a) => a.id === selectedAddressId)
  const stepIndex = STEPS.findIndex((s) => s.id === step)

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createAddressMutation.mutate(addressForm)
  }

  const goNext = () => {
    if (step === "address") {
      if (!selectedAddressId) {
        toast({
          title: "Choose an address",
          description: "Add or select a shipping address to continue.",
        })
        return
      }
      setStep("payment")
    } else if (step === "payment") {
      setStep("review")
    }
  }

  const goBack = () => {
    if (step === "payment") setStep("address")
    else if (step === "review") setStep("payment")
  }

  return (
    <div className="min-h-screen bg-black pt-32 pb-64 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-7xl font-bold uppercase tracking-tighter leading-none mb-12"
          data-testid="text-checkout-heading"
        >
          Checkout
        </motion.h1>

        {/* Step indicator */}
        <div className="flex items-center gap-4 mb-12">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.id}>
              <button
                onClick={() => i < stepIndex && setStep(s.id)}
                className={`flex items-center gap-3 ${
                  i <= stepIndex ? "text-white" : "text-white/30"
                }`}
                disabled={i > stepIndex}
                data-testid={`button-step-${s.id}`}
              >
                <div
                  className={`w-8 h-8 border ${
                    i < stepIndex
                      ? "border-white bg-white text-black"
                      : i === stepIndex
                      ? "border-white"
                      : "border-white/30"
                  } flex items-center justify-center text-xs font-bold`}
                >
                  {i < stepIndex ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className="uppercase text-xs tracking-[0.3em] hidden sm:inline">{s.label}</span>
              </button>
              {i < STEPS.length - 1 && (
                <ChevronRight className="w-4 h-4 text-white/30" />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main column */}
          <div className="lg:col-span-2 border border-white/10 p-6 md:p-8">
            <AnimatePresence mode="wait">
              {step === "address" && (
                <motion.div
                  key="address"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="uppercase tracking-[0.3em] text-xs text-white/60 mb-6">
                    Shipping address
                  </h2>

                  {addressesQuery.isLoading ? (
                    <p className="text-white/40 uppercase text-xs tracking-widest">Loading…</p>
                  ) : (
                    <>
                      <div className="space-y-3 mb-6">
                        {addressesQuery.data?.map((addr) => (
                          <button
                            key={addr.id}
                            onClick={() => {
                              setSelectedAddressId(addr.id)
                              setShowAddressForm(false)
                            }}
                            className={`w-full text-left border p-4 transition-colors ${
                              selectedAddressId === addr.id && !showAddressForm
                                ? "border-white bg-white/5"
                                : "border-white/10 hover:border-white/40"
                            }`}
                            data-testid={`button-address-${addr.id}`}
                          >
                            <div className="font-bold uppercase tracking-widest text-sm mb-2">
                              {addr.recipientName}
                            </div>
                            <div className="text-white/60 text-xs uppercase tracking-wider leading-relaxed">
                              {addr.line1}
                              {addr.line2 ? `, ${addr.line2}` : ""}
                              <br />
                              {addr.city}, {addr.region} {addr.postalCode}
                              <br />
                              {addr.country}
                              {addr.phone ? ` · ${addr.phone}` : ""}
                            </div>
                          </button>
                        ))}
                      </div>

                      {!showAddressForm ? (
                        <button
                          onClick={() => {
                            setShowAddressForm(true)
                            setSelectedAddressId(null)
                          }}
                          className="text-xs uppercase tracking-[0.3em] text-white/60 hover:text-white border border-white/20 hover:border-white px-6 py-3"
                          data-testid="button-add-address"
                        >
                          + Add new address
                        </button>
                      ) : (
                        <form onSubmit={handleAddressSubmit} className="space-y-4 mt-4 border-t border-white/10 pt-6">
                          <h3 className="uppercase text-[10px] tracking-[0.3em] text-white/40">New address</h3>
                          <div>
                            <Label className="text-[10px] uppercase tracking-widest text-white/60">Recipient name</Label>
                            <Input
                              required
                              value={addressForm.recipientName}
                              onChange={(e) => setAddressForm({ ...addressForm, recipientName: e.target.value })}
                              className="bg-transparent border-white/20 mt-2"
                              data-testid="input-recipient-name"
                            />
                          </div>
                          <div>
                            <Label className="text-[10px] uppercase tracking-widest text-white/60">Address line 1</Label>
                            <Input
                              required
                              value={addressForm.line1}
                              onChange={(e) => setAddressForm({ ...addressForm, line1: e.target.value })}
                              className="bg-transparent border-white/20 mt-2"
                              data-testid="input-line1"
                            />
                          </div>
                          <div>
                            <Label className="text-[10px] uppercase tracking-widest text-white/60">Address line 2 (optional)</Label>
                            <Input
                              value={addressForm.line2}
                              onChange={(e) => setAddressForm({ ...addressForm, line2: e.target.value })}
                              className="bg-transparent border-white/20 mt-2"
                              data-testid="input-line2"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-[10px] uppercase tracking-widest text-white/60">City</Label>
                              <Input
                                required
                                value={addressForm.city}
                                onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                                className="bg-transparent border-white/20 mt-2"
                                data-testid="input-city"
                              />
                            </div>
                            <div>
                              <Label className="text-[10px] uppercase tracking-widest text-white/60">State / Region</Label>
                              <Input
                                required
                                value={addressForm.region}
                                onChange={(e) => setAddressForm({ ...addressForm, region: e.target.value })}
                                className="bg-transparent border-white/20 mt-2"
                                data-testid="input-region"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-[10px] uppercase tracking-widest text-white/60">Postal code</Label>
                              <Input
                                required
                                value={addressForm.postalCode}
                                onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                                className="bg-transparent border-white/20 mt-2"
                                data-testid="input-postal-code"
                              />
                            </div>
                            <div>
                              <Label className="text-[10px] uppercase tracking-widest text-white/60">Country</Label>
                              <Input
                                required
                                value={addressForm.country}
                                onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                                className="bg-transparent border-white/20 mt-2"
                                data-testid="input-country"
                              />
                            </div>
                          </div>
                          <div>
                            <Label className="text-[10px] uppercase tracking-widest text-white/60">Phone (optional)</Label>
                            <Input
                              value={addressForm.phone}
                              onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                              className="bg-transparent border-white/20 mt-2"
                              data-testid="input-phone"
                            />
                          </div>
                          <div className="flex gap-3 pt-2">
                            <MotionButton
                              type="submit"
                              disabled={createAddressMutation.isPending}
                              className="px-8 py-4 uppercase tracking-[0.2em] text-xs font-bold"
                              data-testid="button-save-address"
                            >
                              {createAddressMutation.isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                "Save address"
                              )}
                            </MotionButton>
                            {(addressesQuery.data?.length ?? 0) > 0 && (
                              <button
                                type="button"
                                onClick={() => {
                                  setShowAddressForm(false)
                                  setAddressForm(emptyAddressForm())
                                  if (addressesQuery.data?.[0]) {
                                    setSelectedAddressId(addressesQuery.data[0].id)
                                  }
                                }}
                                className="px-8 py-4 uppercase tracking-[0.2em] text-xs text-white/60 hover:text-white"
                                data-testid="button-cancel-address"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </form>
                      )}
                    </>
                  )}
                </motion.div>
              )}

              {step === "payment" && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="uppercase tracking-[0.3em] text-xs text-white/60 mb-6">
                    Payment method
                  </h2>

                  <div className="border border-yellow-400/30 bg-yellow-400/5 p-4 mb-6 text-[10px] uppercase tracking-widest text-yellow-200/80 leading-relaxed">
                    Demo mode — no real payment is processed. Do not enter real card numbers.
                  </div>

                  <div className="space-y-3 mb-8">
                    {PAYMENT_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setPaymentMethod(option.id)}
                        className={`w-full text-left border p-4 transition-colors flex items-center gap-4 ${
                          paymentMethod === option.id
                            ? "border-white bg-white/5"
                            : "border-white/10 hover:border-white/40"
                        }`}
                        data-testid={`button-payment-${option.id}`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full border-2 ${
                            paymentMethod === option.id ? "border-white bg-white" : "border-white/40"
                          }`}
                        />
                        <span className="uppercase tracking-[0.2em] text-sm font-bold">{option.label}</span>
                      </button>
                    ))}
                  </div>

                  <div>
                    <Label className="text-[10px] uppercase tracking-widest text-white/60">
                      Reference / nickname (optional)
                    </Label>
                    <Input
                      value={paymentReference}
                      onChange={(e) => setPaymentReference(e.target.value)}
                      placeholder="e.g. Personal card"
                      className="bg-transparent border-white/20 mt-2"
                      data-testid="input-payment-reference"
                    />
                    <p className="text-[10px] uppercase tracking-widest text-white/40 mt-2">
                      No card numbers are collected.
                    </p>
                  </div>
                </motion.div>
              )}

              {step === "review" && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="uppercase tracking-[0.3em] text-xs text-white/60 mb-6">
                    Review &amp; confirm
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <h3 className="uppercase text-[10px] tracking-[0.3em] text-white/40 mb-3">Shipping to</h3>
                      {selectedAddress ? (
                        <div className="text-sm uppercase tracking-wider leading-relaxed" data-testid="text-review-address">
                          <div className="font-bold">{selectedAddress.recipientName}</div>
                          <div className="text-white/60">
                            {selectedAddress.line1}
                            {selectedAddress.line2 ? `, ${selectedAddress.line2}` : ""}
                            <br />
                            {selectedAddress.city}, {selectedAddress.region} {selectedAddress.postalCode}
                            <br />
                            {selectedAddress.country}
                            {selectedAddress.phone ? ` · ${selectedAddress.phone}` : ""}
                          </div>
                        </div>
                      ) : (
                        <p className="text-white/40 text-xs uppercase">No address selected</p>
                      )}
                    </div>

                    <div className="h-px bg-white/10" />

                    <div>
                      <h3 className="uppercase text-[10px] tracking-[0.3em] text-white/40 mb-3">Payment</h3>
                      <p className="text-sm uppercase tracking-wider" data-testid="text-review-payment">
                        {PAYMENT_OPTIONS.find((p) => p.id === paymentMethod)?.label}
                        {paymentReference ? ` — ${paymentReference}` : ""}
                      </p>
                      <p className="text-[10px] uppercase tracking-widest text-white/40 mt-1">
                        Demo only — no charges will be made
                      </p>
                    </div>

                    <div className="h-px bg-white/10" />

                    <div>
                      <h3 className="uppercase text-[10px] tracking-[0.3em] text-white/40 mb-3">Items</h3>
                      <ul className="space-y-3">
                        {items.map((item) => (
                          <li key={item.id} className="flex gap-4 items-center text-sm">
                            <div className="w-12 h-12 bg-accent overflow-hidden flex-shrink-0">
                              <img
                                src={getAssetPath(item.image)}
                                alt={item.name}
                                className="w-full h-full object-cover grayscale"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="uppercase tracking-widest text-xs font-bold truncate">{item.name}</div>
                              <div className="text-[10px] uppercase tracking-widest text-white/40">
                                {item.color ?? "—"} / {item.size ?? "—"} · qty {item.quantity}
                              </div>
                            </div>
                            <div className="font-mono text-xs">${(item.price * item.quantity).toFixed(2)}</div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-between mt-12 pt-6 border-t border-white/10">
              <button
                onClick={goBack}
                className={`text-xs uppercase tracking-[0.3em] text-white/60 hover:text-white ${
                  stepIndex === 0 ? "invisible" : ""
                }`}
                data-testid="button-back"
              >
                ← Back
              </button>
              {step !== "review" ? (
                <MotionButton
                  onClick={goNext}
                  className="px-12 py-4 uppercase tracking-[0.2em] text-xs font-bold"
                  data-testid="button-next"
                >
                  Continue
                </MotionButton>
              ) : (
                <MotionButton
                  onClick={() => checkoutMutation.mutate()}
                  disabled={checkoutMutation.isPending}
                  className="px-12 py-4 uppercase tracking-[0.2em] text-xs font-bold"
                  data-testid="button-place-order"
                >
                  {checkoutMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    `Place order — $${total.toFixed(2)}`
                  )}
                </MotionButton>
              )}
            </div>
          </div>

          {/* Summary column */}
          <aside className="border border-white/10 p-6 h-fit lg:sticky lg:top-32">
            <h3 className="uppercase tracking-[0.3em] text-[10px] text-white/40 mb-6">Order summary</h3>
            <ul className="space-y-3 mb-6">
              {items.map((item) => (
                <li key={item.id} className="flex justify-between text-xs uppercase tracking-widest">
                  <span className="truncate pr-2">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-mono whitespace-nowrap">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="h-px bg-white/10 mb-4" />
            <div className="flex justify-between text-xs uppercase tracking-widest text-white/60 mb-2">
              <span>Subtotal</span>
              <span className="font-mono">${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs uppercase tracking-widest text-white/60 mb-4">
              <span>Shipping</span>
              <span className="font-mono">Free</span>
            </div>
            <div className="h-px bg-white/10 mb-4" />
            <div className="flex justify-between uppercase tracking-widest text-sm font-bold">
              <span>Total</span>
              <span className="font-mono" data-testid="text-summary-total">${total.toFixed(2)}</span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
