"use client"

import { Link } from "wouter"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.23, 1, 0.32, 1],
    },
  },
}

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.4 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <img 
            src="/product-jacket-1.png" 
            alt="Hero background" 
            className="w-full h-full object-cover grayscale"
          />
        </motion.div>
        
        <div className="container relative z-10 px-6">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl"
          >
            <motion.h1 
              variants={itemVariants}
              className="text-7xl md:text-9xl font-bold uppercase tracking-tighter leading-none mb-8"
            >
              No Name <br />
              <span className="text-outline">Collection</span>
            </motion.h1>
            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-xl uppercase tracking-widest text-white/60 mb-12 max-w-xl"
            >
              A brutalist approach to modern wearable sculpture. 
              Stripped of identity, defined by form.
            </motion.p>
            <motion.div variants={itemVariants}>
              <Link href="/shop">
                <Button size="lg" className="px-12 py-8 text-lg font-bold tracking-widest uppercase">
                  Explore Shop <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-12 left-12 hidden md:block"
        >
          <div className="flex gap-12 text-[10px] uppercase tracking-[0.3em] text-white/40">
            <div>EST. 2024</div>
            <div>SCULPTURAL FORM</div>
            <div>MOSCOW / BERLIN</div>
          </div>
        </motion.div>
      </section>

      {/* Featured Section */}
      <section className="py-32 bg-black border-y border-white/10">
        <div className="container px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter">Featured Items</h2>
            <Link href="/shop" className="text-sm uppercase tracking-widest border-b border-white pb-1 hover:text-white/60 hover:border-white/60 transition-all">
              View all products
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[
              { name: "Denim Jacket", price: 89, img: "/product-denim-1.png" },
              { name: "Sculptural Knit", price: 120, img: "/product-knit-1.png" },
              { name: "Heavy Boots", price: 180, img: "/product-shoe-1.png" }
            ].map((product, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="aspect-[3/4] overflow-hidden bg-white/5 mb-6 relative">
                  <img 
                    src={product.img} 
                    alt={product.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="outline" className="text-white border-white hover:bg-white hover:text-black">
                      Quick View
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-start uppercase tracking-widest text-sm">
                  <div>
                    <h3 className="font-bold mb-1">{product.name}</h3>
                    <p className="text-white/40">Limited Edition</p>
                  </div>
                  <p className="">${product.price}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-48 bg-white text-black">
        <div className="container px-6">
          <div className="max-w-5xl mx-auto">
            <motion.h2 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-8xl font-bold uppercase tracking-tighter leading-none mb-16"
            >
              We don't <br />
              label art. <br />
              We wear it.
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <p className="text-xl md:text-2xl uppercase tracking-wider leading-relaxed">
                  NO-NAME is a response to the hyper-branded landscape of modern fashion. 
                  We believe that the garment should speak louder than the logo. 
                  Our pieces are architectural experiments in silhouette and texture.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="space-y-8"
              >
                <p className="text-sm uppercase tracking-[0.2em] leading-loose text-black/60">
                  Each item is handcrafted in our atelier using heritage techniques merged with 
                  industrial materials. We prioritize longevity over trends and structure 
                  over decoration.
                </p>
                <Button variant="outline" className="border-black text-black hover:bg-black hover:text-white rounded-none uppercase tracking-widest px-8 py-6">
                  Our Process
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-32">
        <div className="container px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div 
              whileHover={{ scale: 0.98 }}
              className="relative h-[600px] overflow-hidden group cursor-pointer"
            >
              <img src="/product-denim-2.png" className="absolute inset-0 w-full h-full object-cover grayscale transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all" />
              <div className="absolute bottom-12 left-12">
                <h3 className="text-4xl font-bold uppercase tracking-tighter mb-4">Outerwear</h3>
                <Button className="rounded-none bg-white text-black hover:bg-black hover:text-white">Shop Now</Button>
              </div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 0.98 }}
              className="relative h-[600px] overflow-hidden group cursor-pointer"
            >
              <img src="/product-acc-1.png" className="absolute inset-0 w-full h-full object-cover grayscale transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all" />
              <div className="absolute bottom-12 left-12">
                <h3 className="text-4xl font-bold uppercase tracking-tighter mb-4">Accessories</h3>
                <Button className="rounded-none bg-white text-black hover:bg-black hover:text-white">Shop Now</Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-32 border-t border-white/10">
        <div className="container px-6 flex flex-col items-center text-center">
          <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-8">Join the collective</h2>
          <p className="text-white/60 uppercase tracking-widest mb-12 max-w-lg">
            Receive updates on new drops and secret exhibitions.
          </p>
          <form className="flex flex-col md:flex-row w-full max-w-md gap-4">
            <input 
              type="email" 
              placeholder="EMAIL ADDRESS" 
              className="flex-1 bg-transparent border-b border-white/40 focus:border-white outline-none py-4 uppercase tracking-widest text-sm"
            />
            <Button className="rounded-none px-12 uppercase tracking-widest font-bold">Submit</Button>
          </form>
        </div>
      </section>
      
      <style>{`
        .text-outline {
          color: transparent;
          -webkit-text-stroke: 1px white;
        }
      `}</style>
    </div>
  )
}
