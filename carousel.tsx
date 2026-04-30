"use client"

import * as React from "react"
import useEmblaCarousel, {
  type EmblaCarouselType,
  type EmblaOptionsType,
} from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type CarouselApi = EmblaCarouselType
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: "horizontal" | "vertical"
  setApi?: (api: CarouselApi) => void
}

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(({ className, opts, orientation = "horizontal", plugins, setApi, ...props }, ref) => {
  const [carouselRef, setCarouselRef] = React.useState<CarouselApi | null>(null)
  const [canScrollPrev, setCanScrollPrev] = React.useState(false)
  const [canScrollNext, setCanScrollNext] = React.useState(false)

  const onInit = React.useCallback((api: CarouselApi) => {
    if (!setApi) return
    setApi(api)
  }, [setApi])

  const onSelect = React.useCallback((api: CarouselApi) => {
    if (!api) return
    setCanScrollPrev(api.canScrollPrev())
    setCanScrollNext(api.canScrollNext())
  }, [])

  const onKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault()
        carouselRef?.scrollPrev()
      } else if (event.key === "ArrowRight") {
        event.preventDefault()
        carouselRef?.scrollNext()
      }
    },
    [carouselRef]
  )

  const scrollPrev = React.useCallback(() => {
    carouselRef?.scrollPrev()
  }, [carouselRef])

  const scrollNext = React.useCallback(() => {
    carouselRef?.scrollNext()
  }, [carouselRef])

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault()
        scrollPrev()
      } else if (event.key === "ArrowRight") {
        event.preventDefault()
        scrollNext()
      }
    },
    [scrollPrev, scrollNext]
  )

  return (
    <div
      ref={ref}
      onKeyDown={handleKeyDown}
      className={cn("relative", className)}
      role="region"
      aria-roledescription="carousel"
      {...props}
    >
      <div
        ref={setCarouselRef}
        className="overflow-hidden"
        {...(opts as React.ComponentProps<"div">)}
      >
        <div
          className={cn(
            "flex",
            orientation === "horizontal" ? "" : "flex-col"
          )}
        >
          {props.children}
        </div>
      </div>
    </div>
  )
})
Carousel.displayName = "Carousel"

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("flex", className)} {...props} />
  )
})
CarouselContent.displayName = "CarouselContent"

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn("min-w-0 shrink-0 grow-0 basis-full", className)}
      {...props}
    />
  )
})
CarouselItem.displayName = "CarouselItem"

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const scrollPrev = React.useCallback(() => {
    // scrollPrev logic here
  }, [])

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute h-8 w-8 rounded-full",
        className
      )}
      onClick={scrollPrev}
      {...props}
    >
      <ChevronLeft className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  )
})
CarouselPrevious.displayName = "CarouselPrevious"

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const scrollNext = React.useCallback(() => {
    // scrollNext logic here
  }, [])

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute h-8 w-8 rounded-full",
        className
      )}
      onClick={scrollNext}
      {...props}
    >
      <ChevronRight className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  )
})
CarouselNext.displayName = "CarouselNext"

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
}