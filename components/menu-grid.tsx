"use client";

import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, Leaf, Clock, Flame } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useMenuFilters } from "@/hooks/use-menu-filters";
import Image from "next/image";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  is_vegetarian: boolean;
  preparation_time: number;
  calories: number;
  category: {
    slug: string;
    name: string;
  };
}

interface MenuGridProps {
  menuItems: MenuItem[];
}

export function MenuGrid({ menuItems }: MenuGridProps) {
  const { category, diet } = useMenuFilters();
  const { addItem, removeItem, getItemQuantity } = useCart();

  const filteredItems = useMemo(() => {
    if (!menuItems.length) return [];

    return menuItems.filter((item) => {
      const slug = item.category.slug;

      // 1. Beverages override everything
      if (diet === "beverages") {
        return slug === "beverages";
      }

      // 2. Category filter
      if (category && slug !== category) {
        return false;
      }

      // 3. Veg / Non-veg
      if (diet === "veg") {
        return item.is_vegetarian && slug !== "beverages";
      }

      if (diet === "non-veg") {
        return !item.is_vegetarian && slug !== "beverages";
      }

      // 4. All
      return true;
    });
  }, [menuItems, category, diet]);

  /* ---------------- UI ---------------- */
  console.log({
    total: menuItems.length,
    filtered: filteredItems.length,
    diet,
    category,
  });
  if (filteredItems.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-16">
        No items match your selection 🍽️
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredItems.map((item) => {
        const quantity = getItemQuantity(item.id);
        const isBeverage = item.category.slug === "beverages";
        return (
          <Card
            key={item.id}
            className="overflow-hidden transition-all hover:shadow-lg"
          >
            <div className="relative h-48 w-full overflow-hidden bg-muted">
              <Image
                src={item.image_url || "/placeholder.svg"}
                alt={item.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {!isBeverage &&
                (item.is_vegetarian ? (
                  <Badge className="absolute top-2 right-2 bg-green-600 border-2 border-white hover:bg-green-700">
                    <Leaf className="h-3 w-3 mr-1 fill-white" />
                    Veg
                  </Badge>
                ) : (
                  <Badge className="absolute top-2 right-2 bg-red-600 border-2 border-white hover:bg-red-700">
                    Non-Veg
                  </Badge>
                ))}
            </div>
            <CardHeader>
              <CardTitle className="text-xl text-balance">
                {item.name}
              </CardTitle>
              <CardDescription className="text-pretty">
                {item.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{item.preparation_time} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <Flame className="h-4 w-4" />
                  <span>{item.calories} cal</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-primary">
                ₹{item.price.toFixed(2)}
              </div>
            </CardContent>
            <CardFooter>
              {quantity === 0 ? (
                <Button
                  onClick={() => addItem(item)}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              ) : (
                <div className="flex items-center justify-between w-full">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeItem(item.id)}
                    className="border-primary text-primary hover:bg-primary/10"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-lg font-semibold">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => addItem(item)}
                    className="border-primary text-primary hover:bg-primary/10"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
