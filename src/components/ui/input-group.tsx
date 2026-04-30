"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

const InputGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("relative flex items-center", className)}
    {...props}
  />
))

const InputGroupAddon = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "inline-flex h-9 items-center rounded-md border border-input bg-transparent px-3 text-sm shadow-sm",
      className
    )}
    {...props}
  />
))

const InputGroupButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "inline-flex h-9 items-center justify-center rounded-md border border-input bg-transparent px-3 text-sm shadow-sm",
      className
    )}
    {...props}
  />
))

const InputGroupText = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "inline-flex h-9 items-center px-3 text-sm",
      className
    )}
    {...props}
  />
))

export { InputGroup, InputGroupAddon, InputGroupButton, InputGroupText }