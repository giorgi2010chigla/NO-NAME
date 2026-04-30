import { Nav } from "./nav";
import { CartDrawer } from "../cart-drawer";
import { ReactNode } from "react";

export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground">
      <Nav />
      <main className="flex-1">
        {children}
      </main>
      <CartDrawer />
      <footer id="contact" className="border-t border-border bg-background py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-6">
          <div className="col-span-1 md:col-span-2">
            <h2 className="font-display text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-6">no name</h2>
            <p className="text-muted-foreground max-w-sm text-sm uppercase tracking-widest leading-relaxed">
              We don't sell clothes. We sell art. A brutalist approach to modern wearable sculpture.
            </p>
          </div>
          
          <div className="space-y-4 text-sm font-medium uppercase tracking-widest">
            <h3 className="text-muted-foreground mb-6">Visit</h3>
            <p>Stoleshnikov Pereulok 12</p>
            <p>Moscow, Russia</p>
            <div className="pt-4 text-muted-foreground">
              <p>Mon–Sat 11:00–21:00</p>
              <p>Sun 12:00–20:00</p>
            </div>
          </div>
          
          <div className="space-y-4 text-sm font-medium uppercase tracking-widest">
            <h3 className="text-muted-foreground mb-6">Contact</h3>
            <p><a href="mailto:hello@no-name.store" className="hover:opacity-70 transition-opacity">hello@no-name.store</a></p>
            <p><a href="tel:+74950000000" className="hover:opacity-70 transition-opacity">+7 495 000 00 00</a></p>
            <div className="pt-4">
              <p><a href="#" className="hover:opacity-70 transition-opacity">@no.name.conceptstore</a></p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
