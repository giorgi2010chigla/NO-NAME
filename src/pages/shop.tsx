"use client"

import { useCart } from "@/lib/cart"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const products = [
  { id: 1, name: "Classic Tee", price: 29.99, category: "tops" },
  { id: 2, name: "Denim Jacket", price: 89.99, category: "outerwear" },
  { id: 3, name: "Leather Belt", price: 45.00, category: "accessories" },
  { id: 4, name: "Running Shoes", price: 120.00, category: "footwear" },
]

export default function Shop() {
  const { addItem } = useCart()

  return (
    <div className="min-h-screen py-12">
      <div className="container px-4 md:px-6">
        <h1 className="text-3xl font-bold tracking-tighter mb-8">Shop</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id}>
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
                <CardDescription>{product.category}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold mb-4">${product.price.toFixed(2)}</p>
                <Button 
                  onClick={() => addItem({ id: product.id, name: product.name, price: product.price, quantity: 1 })}
                  className="w-full"
                >
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}