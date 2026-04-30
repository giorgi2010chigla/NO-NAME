"use client"

import { Link } from "wouter"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export default function Home() {
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
            src="/product-knit-2.png" 
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
                <Button variant="outline" className="px-12 py-8 text-lg border-white hover:bg-white hover:text-black transition-all duration-500">
                  Enter Shop
                </Button>
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

      {/* Featured Grid */}
      <section className="py-32">
        <div className="px-6 md:px-12">
          <div className="flex justify-between items-end mb-24 gap-4">
            <h2 className="text-5xl md:text-8xl font-bold uppercase tracking-tighter leading-none">DROPS</h2>
            <Link href="/shop" className="text-sm uppercase tracking-widest border-b border-white pb-2 mb-2 md:mb-4 hover:opacity-50 transition-opacity whitespace-nowrap">
              Explore All
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-1 bg-white/5 border border-white/5">
            {[
              { name: "Sculptural Knit", price: "240", img: "/product-knit-1.png" },
              { name: "Raw Denim", price: "180", img: "/product-denim-1.png" },
              { name: "Industrial Shoe", price: "320", img: "/product-shoe-1.png" }
            ].map((product, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.2 }}
                className="group relative aspect-[3/4] overflow-hidden bg-[#0a0a0a]"
              >
                <img 
                  src={product.img} 
                  alt={product.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                  <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-2xl font-bold uppercase tracking-tighter mb-2">{product.name}</h3>
                    <p className="text-lg tracking-widest mb-6">${product.price}</p>
                    <Link href="/shop">
                      <Button className="w-full bg-white text-black hover:bg-black hover:text-white border-white">
                        View Product
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
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
