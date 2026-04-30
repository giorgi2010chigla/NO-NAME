"use client"

import { Nav } from "./nav"
import { CartDrawer } from "./cart-drawer"
import { useCart } from "@/lib/cart"
import { Link, useLocation } from "wouter"
import { Instagram, Mail, Phone, Twitter } from "lucide-react"
import { motion } from "framer-motion"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const { isOpen, setIsOpen } = useCart()
  const [location] = useLocation()

  const underlineVariants = {
    initial: { width: 0 },
    hover: { width: "100%" }
  }

  const FooterLink = ({ href, children, active = false, isExternal = false }: { href: string, children: React.ReactNode, active?: boolean, isExternal?: boolean }) => {
    const content = (
      <motion.span
        initial="initial"
        whileHover="hover"
        animate={active ? "hover" : "initial"}
        className={`relative inline-block cursor-pointer ${active ? 'opacity-100 font-bold' : 'opacity-40 hover:opacity-100'}`}
      >
        <span className="relative">
          {children}
          <motion.span
            className="absolute -bottom-1 left-0 h-px bg-white"
            variants={underlineVariants}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          />
        </span>
      </motion.span>
    )

    if (isExternal) {
      return <a href={href}>{content}</a>
    }
    return <Link href={href}>{content}</Link>
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <CartDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <footer id="contact" className="border-t border-white/10 bg-black text-white py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-12 md:gap-6">
          <div className="col-span-1 md:col-span-2">
            <h2 className="font-display text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-6">no name</h2>
            <p className="text-white/60 max-w-sm text-sm uppercase tracking-widest leading-relaxed">
              We don't sell clothes. We sell art. A brutalist approach to modern wearable sculpture.
            </p>
          </div>

          <div className="space-y-4 text-sm font-medium uppercase tracking-widest">
            <h3 className="text-white/40 mb-6">Navigation</h3>
            <ul className="space-y-4 flex flex-col">
              <li>
                <FooterLink href="/" active={location === '/'}>Home</FooterLink>
              </li>
              <li>
                <FooterLink href="/shop" active={location === '/shop'}>Shop</FooterLink>
              </li>
              <li>
                <FooterLink href="#contact" isExternal>Contact</FooterLink>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4 text-sm font-medium uppercase tracking-widest">
            <h3 className="text-white/40 mb-6">Visit</h3>
            <p>Stoleshnikov Pereulok 12</p>
            <p>Moscow, Russia</p>
            <div className="pt-4 text-white/40">
              <p>Mon–Sat 11:00–21:00</p>
              <p>Sun 12:00–20:00</p>
            </div>
          </div>
          
          <div className="space-y-4 text-sm font-medium uppercase tracking-widest">
            <h3 className="text-white/40 mb-6">Contact</h3>
            <p>
              <a href="mailto:hello@no-name.store" className="flex items-center gap-2 hover:opacity-70 transition-opacity lowercase">
                <Mail className="w-4 h-4" />
                <span>hello@no-name.store</span>
              </a>
            </p>
            <p>
              <a href="tel:+74950000000" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
                <Phone className="w-4 h-4" />
                <span>+7 495 000 00 00</span>
              </a>
            </p>
            <div className="pt-6 flex gap-4">
              <motion.a 
                href="#" 
                className="hover:text-white/60 transition-colors"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Instagram className="w-5 h-5" />
              </motion.a>
              <motion.a 
                href="#" 
                className="hover:text-white/60 transition-colors"
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Twitter className="w-5 h-5" />
              </motion.a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
