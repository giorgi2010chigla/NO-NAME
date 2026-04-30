"use client"

import { useRoute, Link } from "wouter"
import { motion, AnimatePresence } from "framer-motion"
import { products, collections } from "@/lib/products"
import { useCart } from "@/lib/cart"
import { useToast } from "@/hooks/use-toast"
import { getAssetPath } from "@/lib/utils"
import { MotionButton } from "@/components/ui/button"
import { ArrowLeft, ShoppingCart } from "lucide-react"

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

export default function Collection() {
  const [, params] = useRoute("/collection/:name")
  const { addItem } = useCart()
  const { toast } = useToast()

  const collection = collections.find(c => c.id === params?.name)
  const collectionProducts = products.filter(p => p.collection === params?.name)

  if (!collection) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold uppercase tracking-tighter mb-8">Collection Not Found</h1>
          <Link href="/shop">
            <MotionButton variant="outline" className="uppercase tracking-widest">
              Back to Shop
            </MotionButton>
          </Link>
        </div>
      </div>
    )
  }

  const handleAddToCart = (product: typeof products[0]) => {
    addItem({ id: product.id, name: product.name, price: product.price, quantity: 1, image: product.img })
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  return (
    <div className="min-h-screen bg-black pb-64">
      {/* Hero */}
      <section className="relative h-[50vh] overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="w-full h-full"
        >
          <img 
            src={getAssetPath(collectionProducts[0]?.img || "/product-knit-1.png")} 
            alt={collection.name} 
            className="w-full h-full object-cover grayscale brightness-30"
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
            Collection
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-4xl md:text-6xl font-bold uppercase tracking-tighter"
          >
            {collection.name}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="text-white/60 uppercase tracking-widest text-xs mt-6 max-w-xl"
          >
            {collection.description}
          </motion.p>
        </div>
      </section>

      <div className="px-6 md:px-12 pt-24">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-12"
        >
          <Link href="/shop" className="flex items-center gap-2 text-white/40 hover:text-white transition-colors uppercase tracking-[0.3em] text-[10px]">
            <ArrowLeft className="w-4 h-4" />
            Back to Shop
          </Link>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-white/10"
        >
          <AnimatePresence mode='popLayout'>
            {collectionProducts.map((product) => (
              <motion.div 
                layout
                key={product.id} 
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative border-r border-b border-white/10 overflow-hidden"
              >
                <Link href={`/product/${product.id}`}>
                  <div className="aspect-[3/4] overflow-hidden bg-[#0a0a0a]">
                    <img 
                      src={getAssetPath(product.img)} 
                      alt={product.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                    />
                  </div>
                </Link>
                
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-90 transition-opacity duration-500 flex flex-col justify-between p-8">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.4em] text-white/40 mb-2">{product.category}</p>
                    <h3 className="text-2xl font-bold uppercase tracking-tighter leading-none">{product.name}</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-xl tracking-widest">${product.price}</p>
                    <MotionButton
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-white text-black hover:bg-black hover:text-white border-white transition-all py-6"
                    >
                      ADD TO CART
                    </MotionButton>
                    <Link href={`/product/${product.id}`} className="w-full block">
                      <MotionButton
                        variant="outline"
                        className="w-full border-white/20 hover:border-white transition-all py-6 uppercase tracking-widest text-[10px]"
                      >
                        VIEW DETAILS
                      </MotionButton>
                    </Link>
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
