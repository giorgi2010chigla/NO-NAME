"use client"

import { Nav } from "../../../nav"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      <Nav />
      <main className="pt-16">
        {children}
      </main>
    </>
  )
}