"use client"

import { Link, useLocation } from "wouter"
import { ShoppingBag } from "lucide-react"
import { useCart } from "@/lib/cart"
import { motion } from "framer-motion"

export function Nav() {
  const [location] = useLocation()
  const { itemCount, setIsOpen } = useCart()

  const navItemVariants = {
    initial: { opacity: 0.6 },
    hover: { opacity: 1 }
  }

  const underlineVariants = {
    initial: { width: 0 },
    hover: { width: "100%" }
  }

  const NavLink = ({ href, children, active }: { href: string, children: React.ReactNode, active: boolean }) => (
    <Link href={href}>
      <motion.span
        initial="initial"
        whileHover="hover"
        animate={active ? "hover" : "initial"}
        className="relative cursor-pointer py-1"
      >
        <motion.span variants={navItemVariants} transition={{ duration: 0.2 }}>
          {children}
        </motion.span>
        <motion.span
          className="absolute -bottom-1 left-0 h-px bg-white"
          variants={underlineVariants}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        />
      </motion.span>
    </Link>
  )

  return (
    <header className="fixed top-0 left-0 right-0 z-50 mix-blend-difference border-b border-white/10 text-white pointer-events-none">
      <div className="flex h-16 items-center justify-between px-6 md:px-12 pointer-events-auto">
        <Link href="/" className="font-display font-bold text-2xl tracking-tighter uppercase">
          no name
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-widest uppercase">
          <NavLink href="/" active={location === '/'}>Home</NavLink>
          <NavLink href="/shop" active={location === '/shop'}>Shop</NavLink>
          <NavLink href="/contact" active={location === '/contact'}>Contact</NavLink>
        </nav>
        <Link href="/cart">
          <motion.button
            className="flex items-center gap-2 group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-sm font-medium hidden sm:inline-block tracking-widest">CART</span>
            <div className="relative">
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
            </div>
          </motion.button>
        </Link>
      </div>
    </header>
  )
}
