"use client"

import { useCart } from "@/lib/cart"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ShoppingBag, Plus } from "lucide-react"

const products = [
  { id: 1, name: "Classic Tee", price: 29.99, category: "tops", img: "/product-knit-1.png" },
  { id: 2, name: "Denim Jacket", price: 89.99, category: "outerwear", img: "/product-denim-1.png" },
  { id: 3, name: "Leather Belt", price: 45.00, category: "accessories", img: "/product-acc-1.png" },
  { id: 4, name: "Running Shoes", price: 120.00, category: "footwear", img: "/product-shoe-1.png" },
  { id: 5, name: "Heavy Knit", price: 145.00, category: "tops", img: "/product-knit-2.png" },
  { id: 6, name: "Oversized Coat", price: 210.00, category: "outerwear", img: "/product-coat-1.png" },
  { id: 7, name: "Silver Ring", price: 65.00, category: "accessories", img: "/product-acc-2.png" },
  { id: 8, name: "Avant Shoes", price: 195.00, category: "footwear", img: "/product-shoe-2.png" },
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
      ease: [0.23, 1, 0.32, 1]
    }
  }
}

export default function Shop() {
  const { addItem } = useCart()

  return (
    <div className="min-h-screen bg-black pt-24 pb-32">
      <div className="container px-6">
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <h1 className="text-6xl md:text-8xl font-bold uppercase tracking-tighter mb-4">Shop</h1>
            <p className="text-white/40 uppercase tracking-[0.3em] text-sm">
              All collections / {products.length} Items
            </p>
          </div>
          <div className="flex gap-4 text-xs uppercase tracking-widest overflow-x-auto pb-4 md:pb-0">
            {['All', 'Tops', 'Outerwear', 'Accessories', 'Footwear'].map((cat) => (
              <button key={cat} className={`px-6 py-2 border border-white/10 hover:border-white transition-colors whitespace-nowrap ${cat === 'All' ? 'bg-white text-black' : ''}`}>
                {cat}
              </button>
            ))}
          </div>
        </header>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12"
        >
          {products.map((product) => (
            <motion.div 
              key={product.id} 
              variants={itemVariants}
              className="group"
            >
              <div className="aspect-[3/4] overflow-hidden bg-white/5 relative mb-6">
                <img 
                  src={product.img} 
                  alt={product.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-6">
                  <div className="mb-6 text-center">
                    <p className="text-white/60 text-xs uppercase tracking-widest mb-2">{product.category}</p>
                    <h3 className="text-xl font-bold uppercase tracking-tighter">{product.name}</h3>
                  </div>
                  <Button 
                    onClick={() => addItem({ id: product.id, name: product.name, price: product.price, quantity: 1 })}
                    className="w-full bg-white text-black hover:bg-black hover:text-white border border-white transition-all rounded-none font-bold uppercase tracking-widest"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add to Cart
                  </Button>
                </div>
                <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md px-3 py-1 border border-white/10">
                  <p className="text-sm font-bold tracking-widest">${product.price}</p>
                </div>
              </div>
              
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest mb-1 group-hover:text-white/70 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs uppercase tracking-widest text-white/40">{product.category}</p>
                </div>
                <button 
                  onClick={() => addItem({ id: product.id, name: product.name, price: product.price, quantity: 1 })}
                  className="p-2 border border-white/10 hover:bg-white hover:text-black transition-all group-hover:border-white"
                >
                  <ShoppingBag className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
