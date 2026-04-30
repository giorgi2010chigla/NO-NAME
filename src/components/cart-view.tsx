"use client"

import { useCart } from "@/lib/cart"
import { isShopifyConfigured } from "@/lib/shopify"
import { MotionButton } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import { getAssetPath } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import { useState } from "react"

export function Cart() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart()
  const { toast } = useToast()
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const handleCheckout = async () => {
    if (items.length === 0) return

    setIsCheckingOut(true)

    try {
      if (isShopifyConfigured) {
        // Shopify checkout - redirect to Shopify
        // Create cart and redirect (this would need full implementation)
        const { createCart, addToCart, redirectToCheckout } = await import("@/lib/shopify")
        
        const cart = await createCart()
        
        // Add items to Shopify cart
        for (const item of items) {
          if (item.variantId) {
            await addToCart(cart.id, item.variantId, item.quantity)
          }
        }
        
        // Redirect to Shopify checkout
        redirectToCheckout(cart)
      } else {
        // Demo mode - show success and clear cart
        await new Promise(resolve => setTimeout(resolve, 1500))
        toast({
          title: "Checkout Successful",
          description: "Thank you for your purchase. Your order is being processed.",
        })
        clearCart()
      }
    } catch (error) {
      console.error("Checkout error:", error)
      toast({
        title: "Checkout Failed",
        description: "There was an error processing your checkout. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCheckingOut(false)
    }
  }

  return (
    <div className="flex flex-col">
      <div className="p-4">
        {items.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">Your cart is empty</p>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex gap-4 items-center"
              >
                <div className="w-16 h-16 bg-accent overflow-hidden">
                  <img 
                    src={getAssetPath(item.image)} 
                    alt={item.name} 
                    className="w-full h-full object-cover grayscale"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold uppercase tracking-widest text-xs">{item.name}</h3>
                  <p className="text-sm text-white/60 font-mono tracking-tighter">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    className="w-8 h-8 border hover:bg-accent"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                  >
                    -
                  </motion.button>
                  <span className="w-4 text-center font-bold">{item.quantity}</span>
                  <motion.button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 border hover:bg-accent"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                  >
                    +
                  </motion.button>
                  <motion.button
                    onClick={() => removeItem(item.id)}
                    className="text-white/40 hover:text-white uppercase text-[10px] tracking-widest ml-2"
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.15 }}
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
          <span className="font-bold text-xl">${total.toFixed(2)}</span>
        </div>
        <MotionButton
          onClick={handleCheckout}
          className="w-full py-8 text-lg font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2" 
          disabled={items.length === 0 || isCheckingOut}
          whileHover={items.length > 0 && !isCheckingOut ? { scale: 1.02 } : {}}
          whileTap={items.length > 0 && !isCheckingOut ? { scale: 0.98 } : {}}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {isCheckingOut ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : isShopifyConfigured ? (
            "Proceed to checkout"
          ) : (
            "Proceed to checkout (Demo)"
          )}
        </MotionButton>
        {!isShopifyConfigured && items.length > 0 && (
          <p className="text-center text-white/40 text-xs mt-4 tracking-wider">
            Configure Shopify to enable real payments
          </p>
        )}
      </div>
    </div>
  )
}