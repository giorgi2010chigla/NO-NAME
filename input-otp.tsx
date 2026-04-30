"use client"

import * as React from "react"
import * as InputOTPPrimitive from "input-otp"
import { Dash } from "lucide-react"

import { cn } from "@/lib/utils"

const InputOTP = React.forwardRef<
  React.ElementRef<typeof InputOTPPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof InputOTPPrimitive.Root>
>(({ className, ...props }, ref) => (
  <InputOTPPrimitive.Root
    ref={ref}
    className={cn("flex items-center gap-2 has-[:disabled]:opacity-50", className)}
    {...props}
  />
))
InputOTP.displayName = InputOTPPrimitive.Root.displayName

const InputOTPGroup = React.forwardRef<
  React.ElementRef<typeof InputOTPPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof InputOTPPrimitive.Group>
>(({ className, ...props }, ref) => (
  <InputOTPPrimitive.Group
    ref={ref}
    className={cn("flex items-center", className)}
    {...props}
  />
))
InputOTPGroup.displayName = InputOTPPrimitive.Group.displayName

const InputOTPSlot = React.forwardRef<
  React.ElementRef<typeof InputOTPPrimitive.Slot>,
  React.ComponentPropsWithoutRef<typeof InputOTPPrimitive.Slot>
>(({ className, ...props }, ref) => (
  <InputOTPPrimitive.Slot
    ref={ref}
    className={cn(
      "flex h-9 w-9 items-center justify-center rounded-md border bg-background text-sm shadow-sm transition-all [&:has([data-active])]:bg-accent [&:has([data-active])]:ring-1 [&:has([data-active])]:ring-ring",
      className
    )}
    {...props}
  />
))
InputOTPSlot.displayName = InputOTPPrimitive.Slot.displayName

const InputOTPSeparator = React.forwardRef<
  React.ElementRef<typeof InputOTPPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof InputOTPPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <InputOTPPrimitive.Separator
    ref={ref}
    className={cn("flex items-center justify-center", className)}
    {...props}
  >
    <Dash className="h-4 w-4 text-muted-foreground" />
  </InputOTPPrimitive.Separator>
))
InputOTPSeparator.displayName = InputOTPPrimitive.Separator.displayName

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }