"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

const Sonner = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("fixed bottom-0 right-0 z-[100] flex max-h-screen flex-col", className)}
    {...props}
  />
))
Sonner.displayName = "Sonner"

export { Sonner }