"use client"

import { useCart } from "@/lib/cart"
import { useAuth } from "@/hooks/use-auth"
import { MotionButton } from "@/components/ui/button"
import { motion } from "framer-motion"
import { getAssetPath } from "@/lib/utils"
import { Link } from "wouter"

export function Cart() {
  const { items, removeItem, updateQuantity, total, isLoading } = useCart()
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  return (
    <div className="flex flex-col">
      <div className="p-4">
        {isLoading || authLoading ? (
          <p className="text-center text-white/40 py-8 uppercase tracking-widest text-xs" data-testid="text-cart-loading">
            Loading your cart…
          </p>
        ) : items.length === 0 ? (
          <p className="text-center text-white/60 py-8 uppercase tracking-widest text-xs" data-testid="text-cart-empty">
            Your cart is empty
          </p>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex gap-4 items-center"
                data-testid={`row-cart-item-${item.id}`}
              >
                <div className="w-16 h-16 bg-accent overflow-hidden flex-shrink-0">
                  <img
                    src={getAssetPath(item.image)}
                    alt={item.name}
                    className="w-full h-full object-cover grayscale"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold uppercase tracking-widest text-xs truncate">{item.name}</h3>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">
                    {item.color ?? "—"} / {item.size ?? "—"}
                  </p>
                  <p className="text-sm text-white/60 font-mono tracking-tighter mt-1">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    className="w-8 h-8 border border-white/20 hover:bg-white/10"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    data-testid={`button-decrement-${item.id}`}
                  >
                    -
                  </motion.button>
                  <span className="w-4 text-center font-bold" data-testid={`text-quantity-${item.id}`}>{item.quantity}</span>
                  <motion.button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 border border-white/20 hover:bg-white/10"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    data-testid={`button-increment-${item.id}`}
                  >
                    +
                  </motion.button>
                  <motion.button
                    onClick={() => removeItem(item.id)}
                    className="text-white/40 hover:text-white uppercase text-[10px] tracking-widest ml-2"
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.15 }}
                    data-testid={`button-remove-${item.id}`}
                  >
                    Remove
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <div className="p-4 border-t border-white/10">
        <div className="flex justify-between mb-8 uppercase tracking-widest">
          <span className="text-white/60">Subtotal</span>
          <span className="font-bold text-xl" data-testid="text-cart-total">${total.toFixed(2)}</span>
        </div>

        {!isAuthenticated && items.length > 0 && (
          <p className="mb-4 text-[10px] uppercase tracking-[0.25em] text-white/50 text-center">
            Sign in to save your cart and check out
          </p>
        )}

        {isAuthenticated ? (
          <Link href="/checkout" className="block">
            <MotionButton
              className="w-full py-8 text-lg font-bold uppercase tracking-[0.2em]"
              disabled={items.length === 0}
              whileHover={items.length > 0 ? { scale: 1.02 } : {}}
              whileTap={items.length > 0 ? { scale: 0.98 } : {}}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              data-testid="button-checkout"
            >
              Proceed to checkout
            </MotionButton>
          </Link>
        ) : (
          <a href="/api/login" className="block">
            <MotionButton
              className="w-full py-8 text-lg font-bold uppercase tracking-[0.2em]"
              disabled={items.length === 0}
              whileHover={items.length > 0 ? { scale: 1.02 } : {}}
              whileTap={items.length > 0 ? { scale: 0.98 } : {}}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              data-testid="button-signin-checkout"
            >
              Sign in to checkout
            </MotionButton>
          </a>
        )}
      </div>
    </div>
  )
}
