import { useCart } from "@/lib/cart";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Minus, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, total } = useCart();
  const { toast } = useToast();

  const handleCheckout = () => {
    toast({
      title: "CHECKOUT UNAVAILABLE",
      description: "This is a conceptual demo.",
      variant: "destructive",
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-lg bg-background border-l border-border p-0 flex flex-col font-sans">
        <SheetHeader className="p-6 border-b border-border">
          <SheetTitle className="font-display font-bold text-2xl uppercase tracking-tighter">Cart ({items.length})</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-50 space-y-4">
              <p className="font-display text-2xl uppercase tracking-tighter">Your cart is empty</p>
              <p className="text-sm">Nothing to see here.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex gap-4">
                  <div className="w-24 h-32 bg-muted relative overflow-hidden flex-shrink-0">
                    <img 
                      src={item.images[0]} 
                      alt={item.name} 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-sm uppercase">{item.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1">SIZE: {item.size}</p>
                      </div>
                      <p className="font-mono text-sm">€{item.price}</p>
                    </div>
                    
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center border border-border">
                        <button 
                          onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                          className="p-2 hover:bg-muted transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-mono">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                          className="p-2 hover:bg-muted transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id, item.size)}
                        className="text-xs uppercase text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                      >
                        <X className="w-3 h-3" /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-border bg-background mt-auto">
          <div className="flex justify-between items-center mb-6">
            <span className="font-bold uppercase text-sm tracking-wider">Subtotal</span>
            <span className="font-mono text-xl">€{total}</span>
          </div>
          <Button 
            className="w-full rounded-none h-14 font-display font-bold text-xl uppercase tracking-widest"
            onClick={handleCheckout}
            disabled={items.length === 0}
          >
            Checkout
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
