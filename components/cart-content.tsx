// "use client"

// import { useCart } from "@/hooks/use-cart"
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Plus, Minus, Trash2, ShoppingBag } from "lucide-react"
// import Image from "next/image"
// import Link from "next/link"
// import { CheckoutDialog } from "@/components/checkout-dialog"
// import { useState } from "react"

// interface Profile {
//   id: string
//   full_name: string
//   phone: string | null
//   address: string | null
//   city: string | null
//   pincode: string | null
// }

// interface CartContentProps {
//   profile: Profile | null
// }

// export function CartContent({ profile }: CartContentProps) {
//   const { items, addItem, removeItem, getTotalPrice, clearCart } = useCart()
//   const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

//   if (items.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center py-16 space-y-4">
//         <ShoppingBag className="h-24 w-24 text-muted-foreground" />
//         <h2 className="text-2xl font-semibold text-muted-foreground">Your cart is empty</h2>
//         <p className="text-muted-foreground">Add some delicious items to get started!</p>
//         <Button asChild className="bg-primary hover:bg-primary/90 mt-4">
//           <Link href="/">Browse Menu</Link>
//         </Button>
//       </div>
//     )
//   }

//   const subtotal = getTotalPrice()
//   const deliveryFee = 49
//   const tax = subtotal * 0.05
//   const total = subtotal + deliveryFee + tax

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//       <div className="lg:col-span-2 space-y-4">
//         {items.map((item) => (
//           <Card key={item.id}>
//             <CardContent className="p-6">
//               <div className="flex items-start gap-4">
//                 <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
//                   <Image src={item.image_url || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <h3 className="text-lg font-semibold text-balance">{item.name}</h3>
//                   <p className="text-lg font-bold text-primary mt-2">₹{item.price.toFixed(2)}</p>
//                 </div>
//                 <div className="flex flex-col items-end gap-4">
//                   <div className="flex items-center gap-2">
//                     <Button
//                       variant="outline"
//                       size="icon"
//                       onClick={() => removeItem(item.id)}
//                       className="h-8 w-8 border-primary text-primary hover:bg-primary/10"
//                     >
//                       <Minus className="h-4 w-4" />
//                     </Button>
//                     <span className="text-lg font-semibold w-8 text-center">{item.quantity}</span>
//                     <Button
//                       variant="outline"
//                       size="icon"
//                       onClick={() => addItem(item)}
//                       className="h-8 w-8 border-primary text-primary hover:bg-primary/10"
//                     >
//                       <Plus className="h-4 w-4" />
//                     </Button>
//                   </div>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => {
//                       for (let i = 0; i < item.quantity; i++) {
//                         removeItem(item.id)
//                       }
//                     }}
//                     className="text-destructive hover:text-destructive/90"
//                   >
//                     <Trash2 className="h-4 w-4 mr-2" />
//                     Remove
//                   </Button>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       <div className="lg:col-span-1">
//         <Card className="sticky top-24">
//           <CardHeader>
//             <CardTitle>Order Summary</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="flex justify-between text-sm">
//               <span className="text-muted-foreground">Subtotal</span>
//               <span className="font-medium">₹{subtotal.toFixed(2)}</span>
//             </div>
//             <div className="flex justify-between text-sm">
//               <span className="text-muted-foreground">Delivery Fee</span>
//               <span className="font-medium">₹{deliveryFee.toFixed(2)}</span>
//             </div>
//             <div className="flex justify-between text-sm">
//               <span className="text-muted-foreground">Tax (5%)</span>
//               <span className="font-medium">₹{tax.toFixed(2)}</span>
//             </div>
//             <div className="border-t pt-4">
//               <div className="flex justify-between text-lg font-bold">
//                 <span>Total</span>
//                 <span className="text-primary">₹{total.toFixed(2)}</span>
//               </div>
//             </div>
//           </CardContent>
//           <CardFooter className="flex-col gap-2">
//             <Button onClick={() => setIsCheckoutOpen(true)} className="w-full bg-primary hover:bg-primary/90" size="lg">
//               Proceed to Checkout
//             </Button>
//             <Button variant="outline" onClick={clearCart} className="w-full bg-transparent">
//               Clear Cart
//             </Button>
//           </CardFooter>
//         </Card>
//       </div>

//       <CheckoutDialog
//         isOpen={isCheckoutOpen}
//         onClose={() => setIsCheckoutOpen(false)}
//         profile={profile}
//         total={total}
//       />
//     </div>
//   )
// }

"use client";

import { useCart } from "@/hooks/use-cart";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Tag,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CheckoutDialog } from "@/components/checkout-dialog";
import { useState } from "react";

interface Profile {
  id: string;
  full_name: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  pincode: string | null;
}

interface CartContentProps {
  profile: Profile | null;
}

export function CartContent({ profile }: CartContentProps) {
  const { items, addItem, removeItem, getTotalPrice, clearCart } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full" />
          <ShoppingBag
            className="h-24 w-24 text-muted-foreground/40 relative"
            strokeWidth={1.5}
          />
        </div>
        <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-sm text-muted-foreground text-center mb-6 max-w-sm">
          Start exploring our delicious menu!
        </p>
        <Button
          asChild
          size="sm"
          className="bg-primary hover:bg-primary/90 shadow-lg h-10"
        >
          <Link href="/">
            Browse Menu
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const deliveryFee = 49;
  const tax = subtotal * 0.05;
  const total = subtotal + deliveryFee + tax;

  return (
    <div className="space-y-4">
      {/* Cart Items Section - Compact */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-base font-bold">
            Items{" "}
            <span className="text-muted-foreground text-sm font-normal">
              ({items.length})
            </span>
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearCart}
            className="text-destructive hover:text-destructive h-8 text-xs px-2"
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            Clear All
          </Button>
        </div>

        {items.map((item) => (
          <Card key={item.id} className="border-0 shadow-sm">
            <CardContent className="p-3">
              <div className="flex gap-3">
                {/* Compact Item Image */}
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={item.image_url || "/placeholder.svg"}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Item Details - Compact */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h3 className="font-semibold text-sm line-clamp-1 leading-tight">
                      {item.name}
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        for (let i = 0; i < item.quantity; i++) {
                          removeItem(item.id);
                        }
                      }}
                      className="h-6 w-6 text-muted-foreground hover:text-destructive flex-shrink-0"
                    >
                      <X className="h-3.5 w-3.5 text-red-600" />
                    </Button>
                  </div>

                  <p className="text-sm font-bold text-primary mb-2">
                    ₹{item.price.toFixed(0)}
                  </p>

                  {/* Quantity Controls - Ultra Compact */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 bg-muted rounded-md p-0.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        className="h-6 w-6 hover:bg-primary/20 text-primary"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-xs font-semibold w-6 text-center">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => addItem(item)}
                        className="h-6 w-6 hover:bg-primary/20 text-primary"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    {/* Item Total */}
                    <span className="text-xs font-semibold text-muted-foreground">
                      ₹{(item.price * item.quantity).toFixed(0)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Order Summary Section - Ultra Compact */}
      <Card className="border-0 shadow-lg overflow-hidden sticky bottom-0 lg:relative">
        {/* Compact Header */}
        <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent p-3 pb-2">
          <h3 className="text-sm font-bold">Order Summary</h3>
        </CardHeader>

        <CardContent className="p-3 pt-2 space-y-2">
          {/* Price Breakdown - Minimal */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Subtotal</span>
              <span className="text-xs font-medium">
                ₹{subtotal.toFixed(0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Delivery</span>
              <span className="text-xs font-medium">
                ₹{deliveryFee.toFixed(0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Tax (5%)</span>
              <span className="text-xs font-medium">₹{tax.toFixed(0)}</span>
            </div>
          </div>

          {/* Minimal Divider */}
          <div className="border-t border-dashed" />

          {/* Total - Compact */}
          <div className="flex justify-between items-center bg-primary/5 -mx-3 px-3 py-2 rounded-lg">
            <span className="text-sm font-bold">Total</span>
            <span className="text-lg font-bold text-primary">
              ₹{total.toFixed(0)}
            </span>
          </div>

          {/* Savings Badge - Minimal */}
          <div className="flex items-center gap-1.5 text-[10px] text-green-600 bg-green-50 dark:bg-green-950/20 px-2 py-1.5 rounded-md">
            <Tag className="h-2.5 w-2.5" />
            <span>You saved ₹50!</span>
          </div>
        </CardContent>

        <CardFooter className="flex-col gap-2 p-3 pt-0">
          <Button
            onClick={() => setIsCheckoutOpen(true)}
            className="w-full bg-primary hover:bg-primary/90 shadow-md h-10 text-sm font-semibold"
          >
            Proceed to Checkout
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <p className="text-[10px] text-center text-muted-foreground">
            Safe and secure checkout 🔒
          </p>
        </CardFooter>
      </Card>

      <CheckoutDialog
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        profile={profile}
        total={total}
      />
    </div>
  );
}
