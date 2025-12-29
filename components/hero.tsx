export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center space-y-6">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-balance">
            Satisfy Your{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Late Night Cravings
            </span>
          </h1>
          <p className="text-lg text-muted-foreground md:text-xl text-pretty">
            Delicious food delivered to your door, even at midnight. Order now and indulge in your favorite comfort
            foods.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium">Open Now</span>
            </div>
            <div className="h-px w-8 bg-border hidden sm:block" />
            <span className="text-sm text-muted-foreground">Delivery in 30-45 mins</span>
          </div>
        </div>
      </div>
    </section>
  )
}
