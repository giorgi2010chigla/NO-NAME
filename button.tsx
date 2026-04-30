import { Link, useLocation } from "wouter";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";

export function Nav() {
  const [location] = useLocation();
  const { itemCount, setIsOpen } = useCart();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 mix-blend-difference border-b border-white/10 text-white pointer-events-none">
      <div className="flex h-16 items-center justify-between px-6 md:px-12 pointer-events-auto">
        <Link href="/" className="font-display font-bold text-2xl tracking-tighter uppercase">
          no name
        </Link>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-widest uppercase">
          <Link href="/" className={`hover:text-white/70 transition-colors ${location === '/' ? 'opacity-100' : 'opacity-60'}`}>
            Home
          </Link>
          <Link href="/shop" className={`hover:text-white/70 transition-colors ${location === '/shop' ? 'opacity-100' : 'opacity-60'}`}>
            Shop
          </Link>
          <a href="#contact" className="opacity-60 hover:text-white/70 transition-colors cursor-pointer">
            Contact
          </a>
        </nav>

        <button 
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 hover:opacity-70 transition-opacity"
        >
          <span className="text-sm font-medium hidden sm:inline-block">CART</span>
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {itemCount}
              </span>
            )}
          </div>
        </button>
      </div>
    </header>
  );
}
