"use client"

import { useCart } from "@/lib/cart"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export function Cart() {
  const { items, removeItem, updateQuantity, total, clearCart, setIsOpen } = useCart()
  const { toast } = useToast()

  const handleCheckout = () => {
    toast({
      title: "Checkout Successful",
      description: "Thank you for your purchase. Your order is being processed.",
    })
    clearCart()
    setIsOpen(false)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {items.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">Your cart is empty</p>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="flex-1">
                  <h3 className="font-bold uppercase tracking-widest text-xs">{item.name}</h3>
                  <p className="text-sm text-white/60 font-mono tracking-tighter">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    className="w-8 h-8 border hover:bg-accent"
                  >
                    -
                  </button>
                  <span className="w-4 text-center font-bold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 border hover:bg-accent"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-white/40 hover:text-white uppercase text-[10px] tracking-widest ml-2"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="p-4 border-t border-white/10">
        <div className="flex justify-between mb-8 uppercase tracking-widest">
          <span className="text-white/60">Subtotal</span>
          <span className="font-bold text-xl">${total.toFixed(2)}</span>
        </div>
        <Button 
          onClick={handleCheckout}
          className="w-full py-8 text-lg font-bold uppercase tracking-[0.2em]" 
          disabled={items.length === 0}
        >
          Proceed to checkout
        </Button>
      </div>
    </div>
  )
}