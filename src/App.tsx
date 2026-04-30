import { Switch, Route, Router as WouterRouter, useLocation } from "wouter"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "@/components/ui/toaster"
import { TooltipProvider } from "@/components/ui/tooltip"
import { CartProvider } from "@/lib/cart"
import { MainLayout } from "@/components/layout/main-layout"
import { AnimatePresence, motion } from "framer-motion"
import Home from "@/pages/home"
import Shop from "@/pages/shop"
import NotFound from "@/pages/not-found"

const queryClient = new QueryClient()

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
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <Switch location={location}>
            <Route path="/" component={Home} />
            <Route path="/shop" component={Shop} />
            <Route component={NotFound} />
          </Switch>
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