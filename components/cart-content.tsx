"use client"

import { useCart } from "@/hooks/use-cart"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Minus, Trash2, ShoppingBag } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { CheckoutDialog } from "@/components/checkout-dialog"
import { useState } from "react"

interface Profile {
  id: string
  full_name: string
  phone: string | null
  address: string | null
  city: string | null
  pincode: string | null
}

interface CartContentProps {
  profile: Profile | null
}

export function CartContent({ profile }: CartContentProps) {
  const { items, addItem, removeItem, getTotalPrice, clearCart } = useCart()
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <ShoppingBag className="h-24 w-24 text-muted-foreground" />
        <h2 className="text-2xl font-semibold text-muted-foreground">Your cart is empty</h2>
        <p className="text-muted-foreground">Add some delicious items to get started!</p>
        <Button asChild className="bg-primary hover:bg-primary/90 mt-4">
          <Link href="/">Browse Menu</Link>
        </Button>
      </div>
    )
  }

  const subtotal = getTotalPrice()
  const deliveryFee = 49
  const tax = subtotal * 0.05
  const total = subtotal + deliveryFee + tax

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                  <Image src={item.image_url || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-balance">{item.name}</h3>
                  <p className="text-lg font-bold text-primary mt-2">₹{item.price.toFixed(2)}</p>
                </div>
                <div className="flex flex-col items-end gap-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                      className="h-8 w-8 border-primary text-primary hover:bg-primary/10"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-lg font-semibold w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => addItem(item)}
                      className="h-8 w-8 border-primary text-primary hover:bg-primary/10"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      for (let i = 0; i < item.quantity; i++) {
                        removeItem(item.id)
                      }
                    }}
                    className="text-destructive hover:text-destructive/90"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="lg:col-span-1">
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Delivery Fee</span>
              <span className="font-medium">₹{deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax (5%)</span>
              <span className="font-medium">₹{tax.toFixed(2)}</span>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">₹{total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button onClick={() => setIsCheckoutOpen(true)} className="w-full bg-primary hover:bg-primary/90" size="lg">
              Proceed to Checkout
            </Button>
            <Button variant="outline" onClick={clearCart} className="w-full bg-transparent">
              Clear Cart
            </Button>
          </CardFooter>
        </Card>
      </div>

      <CheckoutDialog
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        profile={profile}
        total={total}
      />
    </div>
  )
}
