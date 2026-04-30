"use client"

import { Link, useLocation } from "wouter"
import { ShoppingBag } from "lucide-react"
import { useCart } from "@/lib/cart"
import { motion } from "framer-motion"

export function Nav() {
  const [location] = useLocation()
  const { itemCount, setIsOpen } = useCart()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 mix-blend-difference border-b border-white/10 text-white pointer-events-none">
      <div className="flex h-16 items-center justify-between px-6 md:px-12 pointer-events-auto">
        <Link href="/" className="font-display font-bold text-2xl tracking-tighter uppercase">
          no name
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-widest uppercase">
          <Link href="/" className={`relative ${location === '/' ? 'opacity-100' : 'opacity-60'}`}>
            <span className="relative inline-block">
              Home
              <motion.span
                className="absolute -bottom-1 left-0 w-0 h-px bg-white"
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              />
            </span>
          </Link>
          <Link href="/shop" className={`relative ${location === '/shop' ? 'opacity-100' : 'opacity-60'}`}>
            <span className="relative inline-block">
              Shop
              <motion.span
                className="absolute -bottom-1 left-0 w-0 h-px bg-white"
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              />
            </span>
          </Link>
          <a href="#contact" className="relative opacity-60 cursor-pointer">
            <span className="relative inline-block">
              Contact
              <motion.span
                className="absolute -bottom-1 left-0 w-0 h-px bg-white"
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              />
            </span>
          </a>
        </nav>
        <motion.button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-sm font-medium hidden sm:inline-block">CART</span>
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-white text-black text-[10px] font-bold w-4 h-4 flex items-center justify-center"
              >
                {itemCount}
              </motion.span>
            )}
          </div>
        </motion.button>
      </div>
    </header>
  )
}
