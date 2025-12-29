"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface OrderRatingProps {
  orderId: string
}

export function OrderRating({ orderId }: OrderRatingProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [review, setReview] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    // In a real app, this would save to the database
    console.log("[v0] Submitting rating:", { orderId, rating, review })
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <div className="h-12 w-12 rounded-full bg-green-600 mx-auto flex items-center justify-center">
              <Star className="h-6 w-6 text-white fill-white" />
            </div>
            <p className="font-medium">Thank you for your feedback!</p>
            <p className="text-sm text-muted-foreground">Your rating helps us improve our service</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rate Your Order</CardTitle>
        <CardDescription>Share your experience with us</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="transition-transform hover:scale-110"
            >
              <Star
                className={cn(
                  "h-8 w-8 transition-colors",
                  (hoveredRating || rating) >= star ? "fill-primary text-primary" : "text-muted-foreground",
                )}
              />
            </button>
          ))}
        </div>

        <Textarea
          placeholder="Tell us about your experience (optional)"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          className="resize-none"
          rows={3}
        />

        <Button onClick={handleSubmit} disabled={rating === 0} className="w-full bg-primary hover:bg-primary/90">
          Submit Rating
        </Button>
      </CardContent>
    </Card>
  )
}
