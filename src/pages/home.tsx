"use client"

import { Link } from "wouter"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Welcome to NO-NAME
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  A concept store for the modern age. Discover our unique collection.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/shop">
                  <Button>Shop Now</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}