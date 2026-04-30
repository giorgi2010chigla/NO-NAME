"use client"

import { useState } from "react"
import { useCart } from "@/lib/cart"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

const products = [
  { id: 1, name: "Heavy Knit Sweater", price: 240, category: "tops", img: "/product-knit-1.png" },
  { id: 2, name: "Industrial Denim", price: 180, category: "outerwear", img: "/product-denim-1.png" },
  { id: 3, name: "Structured Belt", price: 95, category: "accessories", img: "/product-acc-1.png" },
  { id: 4, name: "Brutalist Boot", price: 320, category: "footwear", img: "/product-shoe-1.png" },
  { id: 5, name: "Sculptural Knit", price: 210, category: "tops", img: "/product-knit-2.png" },
  { id: 6, name: "Oversized Shell", price: 450, category: "outerwear", img: "/product-coat-1.png" },
  { id: 7, name: "Cast Silver Ring", price: 120, category: "accessories", img: "/product-acc-2.png" },
  { id: 8, name: "Modular Shoe", price: 280, category: "footwear", img: "/product-shoe-2.png" },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1]
    }
  }
}

export default function Shop() {
  const { addItem } = useCart()
  const { toast } = useToast()
  const [activeCategory, setActiveCategory] = useState("all")

  const filteredProducts = activeCategory === "all" 
    ? products 
    : products.filter(p => p.category === activeCategory.toLowerCase())

  const handleAddToCart = (product: typeof products[0]) => {
    addItem({ id: product.id, name: product.name, price: product.price, quantity: 1 })
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  return (
    <div className="min-h-screen bg-black pb-64">
      {/* Visual Hero */}
      <section className="relative h-[60vh] overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="w-full h-full"
        >
          <img 
            src="/product-denim-2.png" 
            alt="Shop Hero" 
            className="w-full h-full object-cover grayscale brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </motion.div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
           <motion.span 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.5 }}
             className="text-[10px] uppercase tracking-[1em] text-white/40 mb-6"
           >
             Collection 001
           </motion.span>
           <motion.h2 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.7 }}
             className="text-4xl md:text-6xl font-bold uppercase tracking-tighter"
           >
             PERPETUAL FORM
           </motion.h2>
        </div>
      </section>

      <div className="px-6 md:px-12 pt-24">
        <header className="mb-24 flex flex-col md:flex-row justify-between items-end gap-12">
          <div className="max-w-2xl">
            <motion.h1 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-7xl md:text-[10vw] font-bold uppercase tracking-tighter leading-[0.8] mb-8"
            >
              STORE
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-white/40 uppercase tracking-[0.4em] text-[10px] md:text-xs"
            >
              Curated objects for the human form / Moscow / Berlin
            </motion.p>
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="flex gap-8 text-[10px] uppercase tracking-[0.3em] font-medium border-b border-white/10 pb-4 w-full md:w-auto overflow-x-auto whitespace-nowrap"
          >
            {['All', 'Tops', 'Outerwear', 'Accessories', 'Footwear'].map((cat) => (
              <button 
                key={cat} 
                onClick={() => setActiveCategory(cat.toLowerCase())}
                className={`hover:text-white transition-colors cursor-pointer ${
                  activeCategory === cat.toLowerCase() ? "text-white" : "text-white/40"
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        </header>

        <motion.div 
          layout
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border-t border-l border-white/10"
        >
          <AnimatePresence mode='popLayout'>
            {filteredProducts.map((product) => (
              <motion.div 
                layout
                key={product.id} 
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative border-r border-b border-white/10 p-0 overflow-hidden"
              >
                <div className="aspect-[3/4] overflow-hidden bg-[#0a0a0a]">
                  <img 
                    src={product.img} 
                    alt={product.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                  />
                </div>
                
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-90 transition-opacity duration-500 flex flex-col justify-between p-8">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.4em] text-white/40 mb-2">{product.category}</p>
                    <h3 className="text-2xl font-bold uppercase tracking-tighter leading-none">{product.name}</h3>
                  </div>
                  
                  <div className="space-y-6">
                    <p className="text-xl tracking-widest">${product.price}</p>
                    <Button 
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-white text-black hover:bg-black hover:text-white border-white transition-all py-8"
                    >
                      ADD TO CART
                    </Button>
                  </div>
                </div>

                <div className="p-6 flex justify-between items-center bg-black">
                   <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-widest text-white/40">{product.category}</span>
                      <span className="text-sm font-bold uppercase tracking-tighter">{product.name}</span>
                   </div>
                   <span className="text-sm font-medium tracking-widest">${product.price}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}
