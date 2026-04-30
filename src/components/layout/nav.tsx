"use client"

import { Link, useLocation } from "wouter"
import { ShoppingBag, User, LogOut } from "lucide-react"
import { useCart } from "@/lib/cart"
import { useAuth } from "@/hooks/use-auth"
import { motion } from "framer-motion"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Nav() {
  const [location] = useLocation()
  const { itemCount } = useCart()
  const { user, isAuthenticated, isLoading, logout } = useAuth()

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

  const displayName = user?.firstName || user?.email?.split("@")[0] || "Account"

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

        <div className="flex items-center gap-4 md:gap-6">
          {!isLoading && !isAuthenticated && (
            <a
              href="/api/login"
              className="text-xs sm:text-sm font-medium uppercase tracking-widest hover:opacity-70 transition-opacity"
              data-testid="link-login"
            >
              <span className="hidden sm:inline">Sign in</span>
              <User className="w-5 h-5 sm:hidden" />
            </a>
          )}

          {!isLoading && isAuthenticated && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center gap-2 text-xs sm:text-sm font-medium uppercase tracking-widest hover:opacity-70 transition-opacity outline-none"
                  data-testid="button-account-menu"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline truncate max-w-[100px]">{displayName}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-black border border-white/20 text-white min-w-[200px] mix-blend-normal"
              >
                <DropdownMenuLabel className="uppercase text-[10px] tracking-[0.3em] text-white/60">
                  Signed in as
                  <div className="text-white/90 normal-case tracking-normal text-xs mt-1 truncate">
                    {user?.email}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem asChild>
                  <Link
                    href="/account"
                    className="uppercase text-xs tracking-widest cursor-pointer hover:bg-white/10 focus:bg-white/10"
                    data-testid="link-account"
                  >
                    Account
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/account/orders"
                    className="uppercase text-xs tracking-widest cursor-pointer hover:bg-white/10 focus:bg-white/10"
                    data-testid="link-orders"
                  >
                    Orders
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem
                  onClick={() => logout()}
                  className="uppercase text-xs tracking-widest cursor-pointer hover:bg-white/10 focus:bg-white/10"
                  data-testid="button-logout"
                >
                  <LogOut className="w-3 h-3 mr-2" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Link href="/cart">
            <motion.button
              className="flex items-center gap-2 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              data-testid="button-cart"
            >
              <span className="text-sm font-medium hidden sm:inline-block tracking-widest">
                CART{itemCount > 0 ? ` (${itemCount})` : ""}
              </span>
              <div className="relative">
                <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center sm:hidden">
                    {itemCount}
                  </span>
                )}
              </div>
            </motion.button>
          </Link>
        </div>
      </div>
    </header>
  )
}
