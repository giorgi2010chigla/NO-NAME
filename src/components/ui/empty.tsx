import * as React from "react"

import { cn } from "@/lib/utils"

const Empty = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col items-center justify-center py-12 text-center", className)}
    {...props}
  />
))
Empty.displayName = "Empty"

export { Empty }