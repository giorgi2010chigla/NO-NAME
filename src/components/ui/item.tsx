"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export interface ItemProps extends React.ComponentProps<"div"> {
  selected?: boolean
}

const Item = React.forwardRef<HTMLDivElement, ItemProps>(
  ({ className, selected, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-between rounded-md border p-4 transition-colors",
          selected && "border-primary bg-accent",
          className
        )}
        {...props}
      />
    )
  }
)
Item.displayName = "Item"

export { Item }