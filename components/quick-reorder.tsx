"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Clock } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useRouter } from "next/navigation"

interface PastOrder {
  id: string
  created_at: string
  total_amount: number
  items: Array<{
    menu_item_id: string
    quantity: number
    menu_item: {
      id: string
      name: string
      price: number
      image_url: string
      is_available: boolean
    }
  }>
}

export function QuickReorder({ userId }: { userId: string }) {
  const [recentOrder, setRecentOrder] = useState<PastOrder | null>(null)
  const { addItem } = useCart()
  const router = useRouter()

  useEffect(() => {
    const fetchRecentOrder = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from("orders")
        .select(
          `
          id,
          created_at,
          total_amount,
          order_items (
            menu_item_id,
            quantity,
            menu_items (
              id,
              name,
              price,
              image_url,
              is_available
            )
          )
        `,
        )
        .eq("user_id", userId)
        .eq("status", "delivered")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()

      if (data) {
        const transformedOrder = {
          ...data,
          items: data.order_items.map((item: any) => ({
            menu_item_id: item.menu_item_id,
            quantity: item.quantity,
            menu_item: item.menu_items,
          })),
        }
        setRecentOrder(transformedOrder)
      }
    }

    fetchRecentOrder()
  }, [userId])

  const handleReorder = () => {
    if (!recentOrder) return

    recentOrder.items.forEach((item) => {
      if (item.menu_item.is_available) {
        for (let i = 0; i < item.quantity; i++) {
          addItem({
            id: item.menu_item.id,
            name: item.menu_item.name,
            price: item.menu_item.price,
            image_url: item.menu_item.image_url,
          })
        }
      }
    })

    router.push("/cart")
  }

  if (!recentOrder) return null

  return (
    <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Quick Reorder
        </CardTitle>
        <CardDescription>Order again from your last delivery</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="text-sm">
            <span className="font-medium">{recentOrder.items.length} items</span>
            <span className="text-muted-foreground"> • </span>
            <span className="font-semibold text-primary">₹{recentOrder.total_amount.toFixed(2)}</span>
          </div>
          <Button onClick={handleReorder} className="w-full bg-primary hover:bg-primary/90">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Reorder Now
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
