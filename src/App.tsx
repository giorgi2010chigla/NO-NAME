import { useState, ReactNode } from "react"
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "@/components/ui/toaster"
import { TooltipProvider } from "@/components/ui/tooltip"
import { CartProvider } from "@/lib/cart"
import { MainLayout } from "@/components/layout/main-layout"
import { AnimatePresence, motion } from "framer-motion"
import Home from "@/pages/home"
import Shop from "@/pages/shop"
import Contact from "@/pages/contact"
import CartPage from "@/pages/cart"
import NotFound from "@/pages/not-found"

const queryClient = new QueryClient()

function FrozenRoute({ children }: { children: ReactNode }) {
  const [location] = useLocation()
  const [frozenLocation] = useState(location)

  return (
    <WouterRouter hook={() => [frozenLocation, () => {}]}>
      {children}
    </WouterRouter>
  )
}

function Router() {
  const [location] = useLocation()

  return (
    <MainLayout>
      <AnimatePresence mode="wait">
        <motion.div
          key={location}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <FrozenRoute>
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/shop" component={Shop} />
              <Route path="/contact" component={Contact} />
              <Route path="/cart" component={CartPage} />
              <Route component={NotFound} />
            </Switch>
          </FrozenRoute>
        </motion.div>
      </AnimatePresence>
    </MainLayout>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  )
}

export default App