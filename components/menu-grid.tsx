// "use client";

// import { useMemo } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Plus, Minus, Leaf, Clock, Flame } from "lucide-react";
// import { useCart } from "@/hooks/use-cart";
// import { useMenuFilters } from "@/hooks/use-menu-filters";
// import Image from "next/image";

// interface MenuItem {
//   id: string;
//   name: string;
//   description: string;
//   price: number;
//   image_url: string;
//   is_vegetarian: boolean;
//   preparation_time: number;
//   calories: number;
//   category: {
//     slug: string;
//     name: string;
//   };
// }

// interface MenuGridProps {
//   menuItems: MenuItem[];
// }

// export function MenuGrid({ menuItems }: MenuGridProps) {
//   const { category, diet } = useMenuFilters();
//   const { addItem, removeItem, getItemQuantity } = useCart();

//   const filteredItems = useMemo(() => {
//     if (!menuItems.length) return [];

//     return menuItems.filter((item) => {
//       const slug = item.category.slug;

//       // 1. Beverages override everything
//       if (diet === "beverages") {
//         return slug === "beverages";
//       }

//       // 2. Category filter
//       if (category && slug !== category) {
//         return false;
//       }

//       // 3. Veg / Non-veg
//       if (diet === "veg") {
//         return item.is_vegetarian && slug !== "beverages";
//       }

//       if (diet === "non-veg") {
//         return !item.is_vegetarian && slug !== "beverages";
//       }

//       // 4. All
//       return true;
//     });
//   }, [menuItems, category, diet]);

//   /* ---------------- UI ---------------- */
//   console.log({
//     total: menuItems.length,
//     filtered: filteredItems.length,
//     diet,
//     category,
//   });
//   if (filteredItems.length === 0) {
//     return (
//       <div className="text-center text-muted-foreground py-16">
//         No items match your selection 🍽️
//       </div>
//     );
//   }

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//       {filteredItems.map((item) => {
//         const quantity = getItemQuantity(item.id);
//         const isBeverage = item.category.slug === "beverages";
//         return (
//           <Card
//             key={item.id}
//             className="overflow-hidden transition-all hover:shadow-lg"
//           >
//             <div className="relative h-48 w-full overflow-hidden bg-muted">
//               <Image
//                 src={item.image_url || "/placeholder.svg"}
//                 alt={item.name}
//                 fill
//                 className="object-cover"
//                 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//               />
//               {!isBeverage &&
//                 (item.is_vegetarian ? (
//                   <Badge className="absolute top-2 right-2 bg-green-600 border-2 border-white hover:bg-green-700">
//                     <Leaf className="h-3 w-3 mr-1 fill-white" />
//                     Veg
//                   </Badge>
//                 ) : (
//                   <Badge className="absolute top-2 right-2 bg-red-600 border-2 border-white hover:bg-red-700">
//                     Non-Veg
//                   </Badge>
//                 ))}
//             </div>
//             <CardHeader>
//               <CardTitle className="text-xl text-balance">
//                 {item.name}
//               </CardTitle>
//               <CardDescription className="text-pretty">
//                 {item.description}
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
//                 <div className="flex items-center gap-1">
//                   <Clock className="h-4 w-4" />
//                   <span>{item.preparation_time} min</span>
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <Flame className="h-4 w-4" />
//                   <span>{item.calories} cal</span>
//                 </div>
//               </div>
//               <div className="text-2xl font-bold text-primary">
//                 ₹{item.price.toFixed(2)}
//               </div>
//             </CardContent>
//             <CardFooter>
//               {quantity === 0 ? (
//                 <Button
//                   onClick={() => addItem(item)}
//                   className="w-full bg-primary hover:bg-primary/90"
//                 >
//                   <Plus className="h-4 w-4 mr-2" />
//                   Add to Cart
//                 </Button>
//               ) : (
//                 <div className="flex items-center justify-between w-full">
//                   <Button
//                     variant="outline"
//                     size="icon"
//                     onClick={() => removeItem(item.id)}
//                     className="border-primary text-primary hover:bg-primary/10"
//                   >
//                     <Minus className="h-4 w-4" />
//                   </Button>
//                   <span className="text-lg font-semibold">{quantity}</span>
//                   <Button
//                     variant="outline"
//                     size="icon"
//                     onClick={() => addItem(item)}
//                     className="border-primary text-primary hover:bg-primary/10"
//                   >
//                     <Plus className="h-4 w-4" />
//                   </Button>
//                 </div>
//               )}
//             </CardFooter>
//           </Card>
//         );
//       })}
//     </div>
//   );
// }

// version - 2
// "use client";

// import { useMemo } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Plus, Minus, Leaf, Clock, Flame } from "lucide-react";
// import { useCart } from "@/hooks/use-cart";
// import { useMenuFilters } from "@/hooks/use-menu-filters";
// import Image from "next/image";
// import { cn } from "@/lib/utils";

// interface MenuItem {
//   id: string;
//   name: string;
//   description: string;
//   price: number;
//   image_url: string;
//   is_vegetarian: boolean;
//   preparation_time: number;
//   calories: number;
//   category: {
//     slug: string;
//     name: string;
//   };
// }

// interface MenuGridProps {
//   menuItems: MenuItem[];
// }

// // Menu Card Component (extracted for reuse)
// function MenuCard({ item }: { item: MenuItem }) {
//   const { addItem, removeItem, getItemQuantity } = useCart();
//   const quantity = getItemQuantity(item.id);
//   const isBeverage = item.category.slug === "beverages";

//   return (
//     <Card className="overflow-hidden transition-all hover:shadow-md border-border/40 flex-shrink-0">
//       {/* Compact Image */}
//       <div className="relative h-32 md:h-40 w-full overflow-hidden bg-muted">
//         <Image
//           src={item.image_url || "/placeholder.svg"}
//           alt={item.name}
//           fill
//           className="object-cover"
//           sizes="(max-width: 768px) 50vw, 33vw"
//         />
//         {!isBeverage && (
//           <Badge
//             className={cn(
//               "absolute top-1.5 right-1.5 h-5 px-1.5 text-[10px] border",
//               item.is_vegetarian
//                 ? "bg-green-600 border-white hover:bg-green-700"
//                 : "bg-red-600 border-white hover:bg-red-700"
//             )}
//           >
//             {item.is_vegetarian ? (
//               <Leaf className="h-2.5 w-2.5 fill-white" />
//             ) : (
//               "Non-Veg"
//             )}
//           </Badge>
//         )}
//       </div>

//       {/* Compact Content */}
//       <CardHeader className="p-3 pb-2">
//         <CardTitle className="text-sm font-semibold leading-tight line-clamp-1">
//           {item.name}
//         </CardTitle>
//         <CardDescription className="text-xs line-clamp-2 mt-1">
//           {item.description}
//         </CardDescription>
//       </CardHeader>

//       <CardContent className="p-3 pt-0">
//         {/* Info Icons - Compact */}
//         <div className="flex items-center gap-3 text-[10px] text-muted-foreground mb-2">
//           <div className="flex items-center gap-0.5">
//             <Clock className="h-3 w-3" />
//             <span>{item.preparation_time}m</span>
//           </div>
//           <div className="flex items-center gap-0.5">
//             <Flame className="h-3 w-3" />
//             <span>{item.calories}</span>
//           </div>
//         </div>

//         {/* Price */}
//         <div className="text-lg font-bold text-primary">
//           ₹{item.price.toFixed(0)}
//         </div>
//       </CardContent>

//       {/* Compact Footer */}
//       <CardFooter className="p-3 pt-0">
//         {quantity === 0 ? (
//           <Button
//             onClick={() => addItem(item)}
//             size="sm"
//             className="w-full h-8 text-xs bg-primary hover:bg-primary/90"
//           >
//             <Plus className="h-3 w-3 mr-1" />
//             Add
//           </Button>
//         ) : (
//           <div className="flex items-center justify-between w-full gap-2">
//             <Button
//               variant="outline"
//               size="icon"
//               onClick={() => removeItem(item.id)}
//               className="h-7 w-7 border-primary text-primary hover:bg-primary/10"
//             >
//               <Minus className="h-3 w-3" />
//             </Button>
//             <span className="text-sm font-semibold min-w-[20px] text-center">
//               {quantity}
//             </span>
//             <Button
//               variant="outline"
//               size="icon"
//               onClick={() => addItem(item)}
//               className="h-7 w-7 border-primary text-primary hover:bg-primary/10"
//             >
//               <Plus className="h-3 w-3" />
//             </Button>
//           </div>
//         )}
//       </CardFooter>
//     </Card>
//   );
// }

// export function MenuGrid({ menuItems }: MenuGridProps) {
//   const { category, diet } = useMenuFilters();

//   // Check if any filter is active
//   const isFiltered = category !== null || diet !== "all";

//   // Filtered items for when filters are active
//   const filteredItems = useMemo(() => {
//     if (!menuItems.length) return [];

//     return menuItems.filter((item) => {
//       const slug = item.category.slug;

//       // 1. Beverages override everything
//       if (diet === "beverages") {
//         return slug === "beverages";
//       }

//       // 2. Category filter
//       if (category && slug !== category) {
//         return false;
//       }

//       // 3. Veg / Non-veg
//       if (diet === "veg") {
//         return item.is_vegetarian && slug !== "beverages";
//       }

//       if (diet === "non-veg") {
//         return !item.is_vegetarian && slug !== "beverages";
//       }

//       // 4. All
//       return true;
//     });
//   }, [menuItems, category, diet]);

//   // Group items by category for horizontal scrolling
//   const itemsByCategory = useMemo(() => {
//     if (!menuItems.length) return {};

//     const grouped: Record<string, MenuItem[]> = {};

//     menuItems.forEach((item) => {
//       const categoryName = item.category.name;
//       if (!grouped[categoryName]) {
//         grouped[categoryName] = [];
//       }
//       grouped[categoryName].push(item);
//     });

//     return grouped;
//   }, [menuItems]);

//   // Get popular items (first 10 items for now - you can add a is_popular field later)
//   const popularItems = useMemo(() => {
//     return menuItems.slice(0, 10);
//   }, [menuItems]);

//   if (filteredItems.length === 0 && isFiltered) {
//     return (
//       <div className="text-center text-muted-foreground py-12">
//         <p className="text-sm">No items match your selection 🍽️</p>
//       </div>
//     );
//   }

//   // FILTERED VIEW - Compact Grid
//   if (isFiltered) {
//     return (
//       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
//         {filteredItems.map((item) => (
//           <MenuCard key={item.id} item={item} />
//         ))}
//       </div>
//     );
//   }

//   // BROWSE VIEW - Category-based Horizontal Scrolling
//   return (
//     <div className="space-y-6">
//       {/* Popular Items Section */}
//       {popularItems.length > 0 && (
//         <section>
//           <div className="flex items-center justify-between mb-3">
//             <h3 className="text-lg font-semibold">Popular Items 🔥</h3>
//           </div>
//           <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
//             <div className="flex gap-3 pb-2">
//               {popularItems.map((item) => (
//                 <div key={item.id} className="w-[160px] md:w-[180px]">
//                   <MenuCard item={item} />
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>
//       )}

//       {/* Category Sections */}
//       {Object.entries(itemsByCategory).map(([categoryName, items]) => (
//         <section key={categoryName}>
//           <div className="flex items-center justify-between mb-3">
//             <h3 className="text-lg font-semibold">{categoryName}</h3>
//             <span className="text-xs text-muted-foreground">
//               {items.length} items
//             </span>
//           </div>
//           <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
//             <div className="flex gap-3 pb-2">
//               {items.map((item) => (
//                 <div key={item.id} className="w-[160px] md:w-[180px]">
//                   <MenuCard item={item} />
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>
//       ))}
//     </div>
//   );
// }

// version-3
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
import { Plus, Minus, Leaf, Clock, Flame, Star } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useMenuFilters } from "@/hooks/use-menu-filters";
import Image from "next/image";
import { cn } from "@/lib/utils";

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

// Premium Menu Card Component
function MenuCard({ item }: { item: MenuItem }) {
  const { addItem, removeItem, getItemQuantity } = useCart();
  const quantity = getItemQuantity(item.id);
  const isBeverage = item.category.slug === "beverages";

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-0 bg-card shadow-sm p-0">
      {/* Premium Image with Overlay */}
      <div className="relative h-40 md:h-44 w-full overflow-hidden bg-gradient-to-br from-muted/50 to-muted">
        <Image
          src={item.image_url || "/placeholder.svg"}
          alt={item.name}
          fill
          className="object-cover object-center transition-transform duration-500 group-hover:scale-102"
          sizes="(max-width: 768px) 50vw, 33vw"
        />

        {/* Gradient Overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

        {/* Veg/Non-Veg Badge - Top Left */}
        {!isBeverage && (
          <div className="absolute top-2 left-2">
            {item.is_vegetarian ? (
              <div className="flex items-center justify-center w-5 h-5 rounded-sm bg-white shadow-md border-2 border-green-600">
                <div className="w-2 h-2 rounded-full bg-green-600" />
              </div>
            ) : (
              <div className="flex items-center justify-center w-5 h-5 rounded-sm bg-white shadow-md border-2 border-red-600">
                <div className="w-2 h-2 rounded-full bg-red-600" />
              </div>
            )}
          </div>
        )}

        {/* Rating Badge - Top Right (optional - can add rating field later) */}
        <Badge className="absolute top-2 right-2 bg-white/95 text-foreground border-0 shadow-md hover:bg-white backdrop-blur-sm">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-0.5" />
          <span className="text-xs font-semibold text-gray-600">4.5</span>
        </Badge>
      </div>

      {/* Content Section */}
      <div className="p-3.5">
        {/* Title */}
        <h3 className="font-semibold text-sm leading-tight mb-1.5 line-clamp-1 text-foreground">
          {item.name}
        </h3>

        {/* Description */}
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
          {item.description}
        </p>

        {/* Info Row - Time & Calories */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>{item.preparation_time} min</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Flame className="h-3.5 w-3.5 text-orange-500" />
            <span>{item.calories} cal</span>
          </div>
        </div>

        {/* Price & Add Button Row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-foreground">
              ₹{item.price.toFixed(0)}
            </span>
          </div>

          {quantity === 0 ? (
            <Button
              onClick={() => addItem(item)}
              size="sm"
              className="h-9 px-4 text-xs font-semibold bg-primary hover:bg-primary/90 shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add
            </Button>
          ) : (
            <div className="flex items-center gap-1 bg-primary/10 rounded-lg px-1 py-1 border border-primary/20 mr-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeItem(item.id)}
                className="h-7 w-7 hover:bg-primary/20 text-primary p-0"
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="text-sm font-bold text-primary min-w-[20px] text-center">
                {quantity}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => addItem(item)}
                className="h-7 w-7 hover:bg-primary/20 text-primary p-0"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

export function MenuGrid({ menuItems }: MenuGridProps) {
  const { category, diet } = useMenuFilters();

  // Check if any filter is active
  const isFiltered = category !== null || diet !== "all";

  // Filtered items for when filters are active
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

  // Group items by category for horizontal scrolling
  const itemsByCategory = useMemo(() => {
    if (!menuItems.length) return {};

    const grouped: Record<string, MenuItem[]> = {};

    menuItems.forEach((item) => {
      const categoryName = item.category.name;
      if (!grouped[categoryName]) {
        grouped[categoryName] = [];
      }
      grouped[categoryName].push(item);
    });

    return grouped;
  }, [menuItems]);

  // Get popular items (first 10 items for now - you can add a is_popular field later)
  const popularItems = useMemo(() => {
    return menuItems.slice(0, 10);
  }, [menuItems]);

  if (filteredItems.length === 0 && isFiltered) {
    return (
      <div className="text-center text-muted-foreground py-16 px-4">
        <div className="text-4xl mb-3">🍽️</div>
        <p className="text-sm font-medium">No items match your selection</p>
        <p className="text-xs mt-1">Try adjusting your filters</p>
      </div>
    );
  }

  // FILTERED VIEW - Compact Grid
  if (isFiltered) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredItems.map((item) => (
          <MenuCard key={item.id} item={item} />
        ))}
      </div>
    );
  }

  // BROWSE VIEW - Category-based Horizontal Scrolling
  return (
    <div className="space-y-8">
      {/* Popular Items Section */}
      {popularItems.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-foreground">
                Popular Right Now
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Most ordered items this week
              </p>
            </div>
          </div>
          <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 md:-mx-0 md:px-0">
            <div className="flex gap-4 pb-2">
              {popularItems.map((item) => (
                <div
                  key={item.id}
                  className="w-[170px] md:w-[200px] flex-shrink-0"
                >
                  <MenuCard item={item} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Category Sections */}
      {Object.entries(itemsByCategory).map(([categoryName, items]) => (
        <section key={categoryName}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-foreground">
                {categoryName}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {items.length} delicious {items.length === 1 ? "item" : "items"}
              </p>
            </div>
          </div>
          <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 md:-mx-0 md:px-0">
            <div className="flex gap-4 pb-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="w-[170px] md:w-[200px] flex-shrink-0"
                >
                  <MenuCard item={item} />
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
