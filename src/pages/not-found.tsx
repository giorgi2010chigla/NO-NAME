"use client"

import { Link } from "wouter"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8 text-white/40 uppercase tracking-widest">Page not found</p>
        <Link href="/">
          <span className="text-white hover:underline uppercase tracking-widest cursor-pointer">
            Go back home
          </span>
        </Link>
      </div>
    </div>
  )
}