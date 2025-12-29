"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"

interface OrderTrackingProps {
  status: string
  deliveryAddress: string
}

export function OrderTracking({ status, deliveryAddress }: OrderTrackingProps) {
  const isActive = status === "out_for_delivery"

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Navigation className="h-5 w-5 text-primary" />
          Track Your Order
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-2">
          <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <p className="font-medium">Delivery Address</p>
            <p className="text-sm text-muted-foreground">{deliveryAddress}</p>
          </div>
        </div>

        {isActive ? (
          <>
            <div className="relative h-48 bg-muted rounded-lg overflow-hidden flex items-center justify-center">
              <div className="text-center space-y-2">
                <div className="h-16 w-16 rounded-full bg-primary/20 mx-auto flex items-center justify-center animate-pulse">
                  <Navigation className="h-8 w-8 text-primary" />
                </div>
                <p className="text-sm font-medium">Tracking in progress...</p>
                <Badge className="bg-green-600">Out for Delivery</Badge>
              </div>
            </div>
            <Button variant="outline" className="w-full bg-transparent" disabled>
              <MapPin className="h-4 w-4 mr-2" />
              Live tracking coming soon
            </Button>
          </>
        ) : (
          <div className="h-32 bg-muted rounded-lg flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Map will appear when order is out for delivery</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
