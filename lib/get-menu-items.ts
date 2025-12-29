import { createClient } from "@/lib/supabase/server";
import { DietFilter } from "@/hooks/use-menu-filters";
import { cache } from "react";

export const getMenuItems = cache(
  async (category: string | null, diet: DietFilter) => {
    const supabase = createClient();

    let query = (await supabase)
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
        category:categories!inner (
          name,
          slug
        )
      `
      )
      .eq("is_available", true);

    if (diet === "beverages") {
      query = query.eq("category.slug", "beverages");
    } else if (diet === "veg") {
      query = query.eq("is_vegetarian", true).neq("category.slug", "beverages");
    } else if (diet === "non-veg") {
      query = query
        .eq("is_vegetarian", false)
        .neq("category.slug", "beverages");
    }

    if (category && diet !== "beverages") {
      query = query.eq("category.slug", category);
    }

    const { data, error } = await query;
    if (error) throw error;

    // 🔥 NORMALIZE HERE — ONCE
    const normalizedMenuItems = (data ?? []).map((item) => ({
      ...item,
      category: item.category[0], // guaranteed to exist due to !inner
    }));

    return normalizedMenuItems;
  }
);
