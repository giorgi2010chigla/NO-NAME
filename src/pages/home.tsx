"use client"

import { Link } from "wouter"
import { motion } from "framer-motion"
import { MotionButton } from "@/components/ui/button"
import { Ticker } from "@/components/ticker"
import { getAssetPath } from "@/lib/utils"
import { ArrowRight } from "lucide-react"
import { useCart } from "@/lib/cart"
import { useToast } from "@/hooks/use-toast"

export default function Home() {
  const { addItem } = useCart()
  const { toast } = useToast()

  const handleAddToCart = (product: any) => {
    addItem({ id: product.id, name: product.name, price: parseFloat(product.price), quantity: 1 })
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  const buttonVariants = {
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

  return (
    <div className="flex flex-col bg-black overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.5 }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 z-0"
        >
          <img 
            src={getAssetPath("/product-knit-2.png")} 
            alt="Hero" 
            className="w-full h-full object-cover grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
        </motion.div>
        
        <div className="container relative z-10 px-6 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-[15vw] md:text-[12vw] font-bold uppercase tracking-[-0.05em] leading-[0.8] mb-12 mix-blend-difference">
              NO NAME
            </h1>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 mt-12">
              <p className="text-sm md:text-base uppercase tracking-[0.4em] text-white/60 max-w-xs text-center md:text-left">
                Brutalist Concept Store <br />
                Articulating Form Through Fabric
              </p>
              
              <Link href="/shop">
                <MotionButton variant="outline" className="px-12 py-8 text-lg border-white hover:bg-white hover:text-black transition-all duration-500">
                  Enter Shop
                </MotionButton>
              </Link>
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-12 left-6 md:left-12 flex flex-col gap-2"
        >
          <span className="text-[10px] uppercase tracking-[0.5em] text-white/40">COLLECTION 001</span>
          <span className="text-[10px] uppercase tracking-[0.5em] text-white/40">© 2024 NO-NAME</span>
        </motion.div>
      </section>

      {/* Transitional Quote */}
      <section className="py-64 px-6 border-y border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-4xl md:text-6xl font-medium uppercase tracking-tighter leading-tight italic"
          >
            "Identity is a distraction. The object is everything."
          </motion.h2>
        </div>
      </section>

      <Ticker />

      {/* WHAT'S NEW Showcase */}
      <section className="py-32">
        <div className="px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
            <h2 className="text-5xl md:text-8xl font-bold uppercase tracking-tighter leading-none">WHAT'S NEW</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { id: 1, name: "Heavy Knit", price: "240", img: "/product-knit-1.png" },
              { id: 2, name: "Industrial Denim", price: "180", img: "/product-denim-1.png" },
              { id: 3, name: "Structured Belt", price: "95", img: "/product-acc-1.png" }
            ].map((product, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.2 }}
                className="flex flex-col group"
              >
                <div className="aspect-[3/4] overflow-hidden bg-[#0a0a0a] mb-6">
                  <img 
                    src={getAssetPath(product.img)} 
                    alt={product.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                  />
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold uppercase tracking-tighter">{product.name}</h3>
                    <p className="text-white/40 uppercase tracking-widest text-xs mt-1">Collection 001</p>
                  </div>
                  <p className="text-xl font-medium tracking-tighter">${product.price}</p>
                </div>
                <div className="mt-6 flex flex-col gap-2">
                  <motion.div
                    variants={buttonVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                  >
                    <MotionButton 
                      onClick={() => handleAddToCart(product)}
                      variant="outline" 
                      className="w-full border-white/20 hover:border-white transition-colors uppercase tracking-widest text-xs py-6"
                    >
                      Add to Cart
                    </MotionButton>
                  </motion.div>
                  <motion.div
                    variants={buttonVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                  >
                    <Link href="/shop" className="w-full">
                      <MotionButton variant="ghost" className="w-full text-white/40 hover:text-white transition-colors uppercase tracking-widest text-[10px] py-4">
                        View details
                      </MotionButton>
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-24 flex justify-center">
            <Link href="/shop" className="group flex items-center gap-4 text-xl md:text-2xl font-bold uppercase tracking-[0.3em] border-b-2 border-white pb-4 hover:opacity-50 transition-all">
              SEE MORE
              <motion.div
                animate={{ x: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              >
                <ArrowRight className="w-8 h-8" />
              </motion.div>
            </Link>
          </div>
        </div>
      </section>

      {/* Editorial Section */}
      <section className="py-32 bg-black">
        <div className="px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
              className="relative aspect-[4/5] overflow-hidden"
            >
              <img 
                src={getAssetPath("/product-jacket-1.png")} 
                alt="Editorial 1" 
                className="w-full h-full object-cover grayscale brightness-50"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-4xl md:text-6xl font-bold uppercase tracking-widest mix-blend-overlay text-white/50">ARCHIVE</h3>
              </div>
            </motion.div>
            <div className="space-y-12">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="relative aspect-square overflow-hidden"
              >
                <img 
                  src={getAssetPath("/product-knit-2.png")} 
                  alt="Editorial 2" 
                  className="w-full h-full object-cover grayscale contrast-125"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5 }}
                className="max-w-md"
              >
                <p className="text-lg uppercase tracking-widest text-white/40 leading-relaxed">
                  A study in volume and silhouette. Exploring the boundaries between protection and expression.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Manifesto */}
      <section className="py-64 bg-white text-black">
        <div className="px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-24">
          <div className="flex flex-col justify-center">
            <h2 className="text-6xl md:text-[10vw] font-bold uppercase tracking-tighter leading-[0.85] mb-12">
              BEYOND <br />LABELS
            </h2>
          </div>
          <div className="flex flex-col justify-end space-y-12">
            <p className="text-2xl md:text-3xl uppercase tracking-tighter font-medium leading-tight">
              We eliminate the ego. No branding. No marketing. Only the raw relationship between material and body.
            </p>
            <div className="h-px bg-black/10 w-full" />
            <p className="text-sm uppercase tracking-[0.2em] leading-relaxed text-black/60 max-w-md">
              Each garment is a unique exploration of geometry and physical presence. Made for those who find beauty in the austere and meaning in the void.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
