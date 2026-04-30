"use client"

import { useState } from "react"
import { useRoute, useLocation, Link } from "wouter"
import { motion } from "framer-motion"
import { products } from "@/lib/products"
import { useCart } from "@/lib/cart"
import { useToast } from "@/hooks/use-toast"
import { getAssetPath } from "@/lib/utils"
import { MotionButton } from "@/components/ui/button"
import { ArrowLeft, ShoppingCart } from "lucide-react"

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id")
  const [, setLocation] = useLocation()
  const { addItem } = useCart()
  const { toast } = useToast()

  const product = products.find((p) => p.id === Number(params?.id))

  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)

  if (!product) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold uppercase tracking-tighter mb-8">Product Not Found</h1>
          <Link href="/shop">
            <MotionButton variant="outline" className="uppercase tracking-widest">
              Back to Shop
            </MotionButton>
          </Link>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast({
        title: "Please select a size",
        description: "Choose a size before adding to cart.",
        variant: "destructive"
      })
      return
    }
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      toast({
        title: "Please select a color",
        description: "Choose a color before adding to cart.",
        variant: "destructive"
      })
      return
    }
    addItem({ 
      id: product.id, 
      name: product.name, 
      price: product.price, 
      quantity: 1, 
      image: product.img 
    })
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  return (
    <div className="min-h-screen bg-black pt-32 pb-64">
      <div className="px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-12"
        >
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-white/40 hover:text-white transition-colors uppercase tracking-[0.3em] text-[10px]"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-[3/4] bg-[#0a0a0a] overflow-hidden"
          >
            <img 
              src={getAssetPath(product.img)} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Info Section */}
          <div className="flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="text-[10px] uppercase tracking-[0.5em] text-white/40 mb-4 block">
                {product.category} / {product.collection?.replace('-', ' ').toUpperCase() || 'Collection 001'}
              </span>
              <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter leading-none mb-8">
                {product.name}
              </h1>
              <p className="text-2xl tracking-widest mb-12">${product.price}</p>
              
              <div className="h-px bg-white/10 w-full mb-12" />
              
              <div className="space-y-8 mb-12">
                <h3 className="text-[10px] uppercase tracking-[0.4em] text-white/40">Description</h3>
                <p className="text-lg text-white/80 leading-relaxed uppercase tracking-tight max-w-md">
                  {product.description}
                </p>
              </div>

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-[10px] uppercase tracking-[0.4em] text-white/40 mb-4">Size</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[48px] py-3 px-4 border text-xs uppercase tracking-widest font-bold transition-all ${
                          selectedSize === size 
                            ? 'bg-white text-black border-white' 
                            : 'border-white/20 text-white/60 hover:border-white hover:text-white'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-[10px] uppercase tracking-[0.4em] text-white/40 mb-4">Color</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`py-3 px-6 border text-xs uppercase tracking-widest font-bold transition-all ${
                          selectedColor === color 
                            ? 'bg-white text-black border-white' 
                            : 'border-white/20 text-white/60 hover:border-white hover:text-white'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="h-px bg-white/10 w-full mb-12" />

              <div className="flex flex-col gap-4">
                <MotionButton
                  onClick={handleAddToCart}
                  className="w-full py-8 text-lg font-bold uppercase tracking-[0.2em] bg-white text-black hover:bg-white/90"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ShoppingCart className="w-5 h-5 mr-4" />
                  Add to Cart
                </MotionButton>
                
                <Link href="/cart">
                  <MotionButton
                    variant="outline"
                    className="w-full py-8 text-lg font-bold uppercase tracking-[0.2em] border-white/20 hover:border-white"
                  >
                    View Cart
                  </MotionButton>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
