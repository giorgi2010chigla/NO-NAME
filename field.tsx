"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export interface FieldProps extends React.ComponentProps<"div"> {
  error?: boolean
}

const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("space-y-2", error && "text-destructive", className)}
        {...props}
      />
    )
  }
)
Field.displayName = "Field"

const FieldLabel = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={cn("text-sm font-medium leading-none", className)}
      {...props}
    />
  )
})
FieldLabel.displayName = "FieldLabel"

const FieldDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-[0.8rem] text-muted-foreground", className)}
      {...props}
    />
  )
})
FieldDescription.displayName = "FieldDescription"

const FieldMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-[0.8rem] font-medium text-destructive", className)}
      {...props}
    />
  )
})
FieldMessage.displayName = "FieldMessage"

export { Field, FieldLabel, FieldDescription, FieldMessage }