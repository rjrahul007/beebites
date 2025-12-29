"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tag, Clock } from "lucide-react"
import Image from "next/image"

const offers = [
  {
    id: "1",
    title: "50% OFF on First Order",
    description: "New users get 50% discount on their first order",
    code: "FIRST50",
    image: "/food-discount-banner.jpg",
    validUntil: "Dec 31, 2024",
  },
  {
    id: "2",
    title: "Free Delivery",
    description: "Free delivery on orders above ₹299",
    code: "FREEDEL",
    image: "/free-delivery-banner.jpg",
    validUntil: "Ongoing",
  },
  {
    id: "3",
    title: "Midnight Special",
    description: "Extra 20% off between 12 AM - 3 AM",
    code: "NIGHT20",
    image: "/late-night-food-banner.jpg",
    validUntil: "Daily",
  },
]

export function SpecialOffers() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Tag className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-bold">Special Offers</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {offers.map((offer) => (
          <Card key={offer.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <div className="relative h-32 w-full bg-gradient-to-r from-primary/20 to-secondary/20">
              <Image src={offer.image || "/placeholder.svg"} alt={offer.title} fill className="object-cover" />
              <Badge className="absolute top-2 right-2 bg-primary">
                <Tag className="h-3 w-3 mr-1" />
                {offer.code}
              </Badge>
            </div>
            <CardContent className="p-4 space-y-2">
              <h3 className="font-semibold text-lg text-balance">{offer.title}</h3>
              <p className="text-sm text-muted-foreground text-pretty">{offer.description}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground pt-2">
                <Clock className="h-3 w-3" />
                <span>Valid until {offer.validUntil}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
