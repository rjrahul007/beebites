// "use client";

// import { useRouter, useSearchParams } from "next/navigation";

// export type DietFilter = "all" | "veg" | "non-veg" | "beverages";

// interface MenuFilters {
//   category: string | null;
//   diet: DietFilter;
// }

// export function useMenuFilters() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const category = searchParams.get("category");

//   const rawDiet = searchParams.get("diet") as DietFilter | null;

//   const diet: DietFilter =
//     rawDiet === "veg" || rawDiet === "non-veg" || rawDiet === "beverages"
//       ? rawDiet
//       : "all";

//   const updateFilters = (updates: Partial<MenuFilters>) => {
//     const params = new URLSearchParams(searchParams.toString());

//     if ("category" in updates) {
//       if (updates.category) {
//         params.set("category", updates.category);
//       } else {
//         params.delete("category");
//       }
//     }

//     if ("diet" in updates) {
//       if (updates.diet && updates.diet !== "all") {
//         params.set("diet", updates.diet);
//       } else {
//         params.delete("diet");
//       }
//     }

//     router.replace(`?${params.toString()}`, { scroll: false });
//   };

//   return {
//     category,
//     diet,
//     updateFilters,
//   };
// }

"use client";

import { useRouter, useSearchParams } from "next/navigation";

export type DietFilter = "all" | "veg" | "non-veg" | "beverages";

interface MenuFilters {
  category: string | null;
  diet: DietFilter;
}

export function useMenuFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const category = searchParams.get("category");

  const rawDiet = searchParams.get("diet") as DietFilter | null;

  const diet: DietFilter =
    rawDiet === "veg" || rawDiet === "non-veg" || rawDiet === "beverages"
      ? rawDiet
      : "all";

  const updateFilters = (updates: Partial<MenuFilters>) => {
    const params = new URLSearchParams(searchParams.toString());

    if ("category" in updates) {
      if (updates.category) {
        params.set("category", updates.category);
      } else {
        params.delete("category");
      }
    }

    if ("diet" in updates) {
      if (updates.diet && updates.diet !== "all") {
        params.set("diet", updates.diet);
      } else {
        params.delete("diet");
      }
    }

    const query = params.toString();
    router.replace(query ? `?${query}` : "/", { scroll: false });
  };

  return {
    category,
    diet,
    updateFilters,
  };
}
