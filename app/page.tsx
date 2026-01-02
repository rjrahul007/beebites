import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/header";
import { CategoryFilter } from "@/components/category-filter";
import { MenuGrid } from "@/components/menu-grid";
import { HeroCarousel } from "@/components/hero-carousel";
import { BottomNav } from "@/components/bottom-nav";
import { Footer } from "@/components/footer";
import { SearchBar } from "@/components/search-bar";
import { QuickReorder } from "@/components/quick-reorder";
import { SpecialOffers } from "@/components/special-offers";

export default async function HomePage() {
  const supabase = await createClient();

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch categories
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("display_order");

  // Fetch all menu items with their categories
  const { data } = await supabase
    .from("menu_items")
    .select(
      `
    id,
    name,
    description,
    price,
    image_url,
    is_vegetarian,
    preparation_time,
    calories,
    category:categories!menu_items_category_id_fkey (
      name,
      slug
    )
  `
    )
    .eq("is_available", true)
    .eq("category.is_active", true);

  const menuItems = data ?? [];
  // Normalize category shape: PostgREST returns category as an array when using relationship select
  const normalizedMenuItems = (menuItems as any[]).map((it) => ({
    ...it,
    category: Array.isArray(it.category)
      ? it.category[0] ?? null
      : it.category ?? null,
  }));

  return (
    // <div className="min-h-screen pb-20 md:pb-0">
    //   <Header />
    //   <HeroCarousel />
    //   <main className="container mx-auto px-4 py-8" id="menu">
    //     <div className="mb-8 flex justify-center">
    //       <SearchBar />
    //     </div>

    //     <CategoryFilter categories={categories || []} />
    //     <MenuGrid menuItems={normalizedMenuItems || []} />

    //     <div className="my-8">
    //       <SpecialOffers />
    //     </div>

    //     {user && (
    //       <div className="mb-8">
    //         <QuickReorder userId={user.id} />
    //       </div>
    //     )}
    //   </main>
    //   <BottomNav />
    // </div>
    // <div className="min-h-screen pb-20 md:pb-0">
    //   <Header />
    //   <HeroCarousel />

    //   <div className="mb-8 container mx-auto px-4 pt-8">
    //     <div className="flex justify-center">
    //       <SearchBar />
    //     </div>
    //   </div>

    //   {/* Sticky Category Filter - outside main container */}
    //   <CategoryFilter categories={categories || []} />

    //   <main className="container mx-auto px-4 py-8" id="menu">
    //     <MenuGrid menuItems={normalizedMenuItems || []} />

    //     <div className="my-8">
    //       <SpecialOffers />
    //     </div>

    //     {user && (
    //       <div className="mb-8">
    //         <QuickReorder userId={user.id} />
    //       </div>
    //     )}
    //   </main>
    //   <BottomNav />
    // </div>
    <div className="min-h-screen pb-20 md:pb-0">
      <Header />
      <HeroCarousel />
      <main className="container mx-auto px-4 py-8" id="menu">
        <div className="mb-8 flex justify-center">
          <SearchBar />
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-card-foreground mb-2">
            Our <span className="text-primary">Menu</span>
          </h2>
          <p className="text-muted-foreground">
            Explore our late-night favorites
          </p>
        </div>

        <CategoryFilter categories={categories || []} />

        <MenuGrid menuItems={normalizedMenuItems || []} />

        <div className="my-8">
          <SpecialOffers />
        </div>

        {user && (
          <div className="mb-8">
            <QuickReorder userId={user.id} />
          </div>
        )}
        <Footer />
      </main>
      <BottomNav />
    </div>
  );
}
