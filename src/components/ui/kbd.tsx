import * as React from "react"

import { cn } from "@/lib/utils"

const Kbd = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "inline-flex h-5 min-w-5 items-center justify-center rounded border bg-muted px-1 font-mono text-[10px] font-medium text-muted-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
Kbd.displayName = "Kbd"

export { Kbd }