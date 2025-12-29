"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const slides = [
  {
    title: "Satisfy Your Late Night Cravings",
    subtitle: "Delicious food delivered to your door, even at midnight",
    image: "/delicious-pizza-with-melted-cheese-at-night.jpg",
    cta: "Order Now",
  },
  {
    title: "Hot & Fresh Burgers",
    subtitle: "Juicy burgers made to perfection, delivered fast",
    image: "/gourmet-burger-fries.png",
    cta: "View Menu",
  },
  {
    title: "Crispy Fried Chicken",
    subtitle: "Golden and crispy, just the way you like it",
    image: "/crispy-fried-chicken-bucket.jpg",
    cta: "Order Now",
  },
]

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-background to-muted/20">
      <div className="relative h-[400px] md:h-[500px]">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/40 z-10" />
            <Image
              src={slide.image || "/placeholder.svg"}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="relative z-20 container mx-auto px-4 h-full flex items-center">
              <div className="max-w-2xl space-y-4">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-balance">
                  {slide.title.split(" ").slice(0, -2).join(" ")}{" "}
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {slide.title.split(" ").slice(-2).join(" ")}
                  </span>
                </h1>
                <p className="text-lg text-muted-foreground md:text-xl text-pretty">{slide.subtitle}</p>
                <div className="flex items-center gap-4 pt-2">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
                    <span className="text-sm font-medium">Open Now</span>
                  </div>
                  <div className="h-px w-8 bg-border" />
                  <span className="text-sm text-muted-foreground">Delivery in 30-45 mins</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Buttons */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-background/80 hover:bg-background/90"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-background/80 hover:bg-background/90"
          onClick={nextSlide}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>

        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide ? "w-8 bg-primary" : "w-2 bg-muted-foreground/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
