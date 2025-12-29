"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Leaf } from "lucide-react";
import { GiChickenOven } from "react-icons/gi";
import { RiDrinks2Fill } from "react-icons/ri";
import { useMenuFilters } from "@/hooks/use-menu-filters";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface CategoryFilterProps {
  categories: Category[];
}

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const { category, diet, updateFilters } = useMenuFilters();

  /* ---------------- CATEGORY HANDLERS ---------------- */

  const handleCategoryClick = (slug: string | null) => {
    updateFilters({
      category: category === slug ? null : slug,
    });
  };

  /* ---------------- DIET HANDLERS ---------------- */

  const handleDietClick = (diet: "all" | "veg" | "non-veg" | "beverages") => {
    updateFilters({
      diet,
      // UX rule: Beverage overrides category
      category: diet === "beverages" ? null : undefined,
    });
  };

  return (
    <div className="mb-8 space-y-4">
      <div>
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-card-foreground mb-2">
            Our <span className="text-primary">Menu</span>
          </h2>
          <p className="text-muted-foreground">
            Explore our late-night favorites
          </p>
        </div>
        <div className="flex flex-wrap gap-3 justify-center">
          <Button
            variant={!category ? "default" : "outline"}
            onClick={() =>
              updateFilters({
                category: null,
                diet: "all",
              })
            }
            className={cn(!category && "bg-primary text-primary-foreground")}
          >
            All Items
          </Button>

          {categories.map((cat) => {
            const active = category === cat.slug;
            return (
              <Button
                key={cat.id}
                variant={active ? "default" : "outline"}
                onClick={() => handleCategoryClick(cat.slug)}
                className={cn(
                  "transition-all",
                  active && "bg-primary text-primary-foreground"
                )}
              >
                {cat.name}
              </Button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 justify-center mt-4">
          <Leaf className="h-5 w-5 text-green-600" />
          Dietary Preference
        </h3>
        <div className="flex flex-wrap gap-3 justify-center">
          <Button
            variant={diet === "all" ? "default" : "outline"}
            onClick={() => handleDietClick("all")}
            className={cn(
              diet === "all" && "bg-primary text-primary-foreground"
            )}
          >
            All
          </Button>
          <Button
            variant={diet === "veg" ? "default" : "outline"}
            onClick={() => handleDietClick("veg")}
            className={cn(
              "transition-all border-green-600",
              "border-green-600",
              diet === "veg"
                ? "bg-green-600 text-white hover:bg-green-700"
                : "text-green-600 hover:bg-green-50"
            )}
          >
            <Leaf className="h-4 w-4 mr-1" />
            Veg
          </Button>
          <Button
            variant={diet === "non-veg" ? "default" : "outline"}
            onClick={() => handleDietClick("non-veg")}
            className={cn(
              "transition-all",
              diet === "non-veg" && "bg-primary text-primary-foreground"
            )}
          >
            <GiChickenOven className="h-4 w-4 mr-1" />
            Non-Veg
          </Button>
          <Button
            variant={diet === "beverages" ? "default" : "outline"}
            onClick={() => handleDietClick("beverages")}
            className={cn(
              "transition-all",
              diet === "beverages" && "bg-primary text-primary-foreground"
            )}
          >
            <RiDrinks2Fill className="h-4 w-4 mr-1" />
            Beverages
          </Button>
        </div>
      </div>
    </div>
  );
}
