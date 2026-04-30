"use client"

import { motion } from "framer-motion"
import { MotionButton } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function Contact() {
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Message Sent",
      description: "We'll get back to you as soon as possible.",
    })
    const target = e.target as HTMLFormElement
    target.reset()
  }

  return (
    <div className="min-h-screen bg-black pt-32 pb-64 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.header 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-24"
        >
          <h1 className="text-7xl md:text-[10vw] font-bold uppercase tracking-tighter leading-[0.8] mb-8">
            CONTACT
          </h1>
          <p className="text-white/40 uppercase tracking-[0.4em] text-[10px] md:text-xs">
            Direct communication for inquiries and collaborations.
          </p>
        </motion.header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-12">
              <div className="space-y-4">
                <Label htmlFor="name" className="uppercase tracking-[0.2em] text-[10px] text-white/60">Full Name</Label>
                <Input 
                  id="name" 
                  placeholder="JOHN DOE" 
                  className="bg-transparent border-white/10 border-x-0 border-t-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-white transition-colors uppercase tracking-widest"
                  required
                />
              </div>
              
              <div className="space-y-4">
                <Label htmlFor="email" className="uppercase tracking-[0.2em] text-[10px] text-white/60">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="JOHN@EXAMPLE.COM" 
                  className="bg-transparent border-white/10 border-x-0 border-t-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-white transition-colors uppercase tracking-widest"
                  required
                />
              </div>

              <div className="space-y-4">
                <Label htmlFor="message" className="uppercase tracking-[0.2em] text-[10px] text-white/60">Message</Label>
                <Textarea 
                  id="message" 
                  placeholder="YOUR INQUIRY..." 
                  className="bg-transparent border-white/10 border-x-0 border-t-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-white transition-colors min-h-[150px] resize-none uppercase tracking-widest"
                  required
                />
              </div>

              <MotionButton 
                type="submit"
                className="w-full py-8 text-lg font-bold uppercase tracking-[0.2em]"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Send Message
              </MotionButton>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-16"
          >
            <div>
              <h3 className="text-white/40 uppercase tracking-[0.4em] text-[10px] mb-4">Location</h3>
              <p className="text-xl uppercase tracking-tighter">
                Berlin / Moscow / Tokyo<br />
                Global Digital Presence
              </p>
            </div>

            <div>
              <h3 className="text-white/40 uppercase tracking-[0.4em] text-[10px] mb-4">Email</h3>
              <p className="text-xl uppercase tracking-tighter hover:text-white/60 transition-colors cursor-pointer">
                studio@no-name.com
              </p>
            </div>

            <div>
              <h3 className="text-white/40 uppercase tracking-[0.4em] text-[10px] mb-4">Social</h3>
              <div className="flex flex-col gap-2">
                <a href="https://instagram.com/noname" target="_blank" rel="noopener noreferrer" className="text-xl uppercase tracking-tighter hover:text-white/60 transition-colors">Instagram</a>
                <a href="https://twitter.com/noname" target="_blank" rel="noopener noreferrer" className="text-xl uppercase tracking-tighter hover:text-white/60 transition-colors">Twitter</a>
                <a href="https://are.na/noname" target="_blank" rel="noopener noreferrer" className="text-xl uppercase tracking-tighter hover:text-white/60 transition-colors">Are.na</a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
