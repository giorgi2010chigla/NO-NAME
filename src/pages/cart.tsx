"use client"

import { Cart } from "@/components/cart-view"
import { motion } from "framer-motion"

export default function CartPage() {
  return (
    <div className="min-h-screen bg-black pt-32 pb-64 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.header 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <h1 className="text-7xl md:text-[10vw] font-bold uppercase tracking-tighter leading-[0.8] mb-8">
            CART
          </h1>
        </motion.header>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="border border-white/10"
        >
          <Cart />
        </motion.div>
      </div>
    </div>
  )
}
