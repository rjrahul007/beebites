// import { createClient } from "@/lib/supabase/server";
// import { NextResponse } from "next/server";

// async function requireAdmin(supabase: any) {
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();
//   if (!user)
//     return {
//       error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
//       user: null,
//     };
//   const { data: profile } = await supabase
//     .from("profiles")
//     .select("role")
//     .eq("id", user.id)
//     .single();
//   const role = profile?.role;
//   if (!role || !(role === "ADMIN" || role === "SUPER_ADMIN")) {
//     return {
//       error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
//       user: null,
//     };
//   }
//   return { error: null, user };
// }

// export async function GET(request: Request) {
//   try {
//     const supabase = await createClient();
//     const { data: items } = await supabase
//       .from("menu_items")
//       .select(`*, category:categories!menu_items_category_id_fkey(name,slug)`)
//       .order("name");

//     return NextResponse.json({ items: items ?? [] });
//   } catch (err) {
//     console.error("[v0] menu items GET error:", err);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(request: Request) {
//   try {
//     const supabase = await createClient();
//     const { error: authErr, user } = await requireAdmin(supabase);
//     if (authErr) return authErr;

//     const body = await request.json();
//     const {
//       name,
//       description = null,
//       price,
//       image_url = null,
//       is_vegetarian = false,
//       is_available = true,
//       preparation_time = null,
//       calories = null,
//       category_id = null,
//     } = body;

//     if (!name || price == null || !category_id) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     const { error: insertErr } = await supabase.from("menu_items").insert({
//       name,
//       description,
//       price,
//       image_url,
//       is_vegetarian,
//       is_available,
//       preparation_time,
//       calories,
//       category_id,
//     });

//     if (insertErr) {
//       console.error("[v0] menu insert error:", insertErr);
//       return NextResponse.json(
//         { error: "Failed to create menu item" },
//         { status: 500 }
//       );
//     }

//     // Audit
//     await supabase.from("audit_logs").insert({
//       actor_id: user.id,
//       action: "create_menu_item",
//       resource_type: "menu_items",
//       details: { name },
//     });

//     return NextResponse.json({ message: "Created" });
//   } catch (err) {
//     console.error("[v0] menu items POST error:", err);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// export async function PATCH(request: Request) {
//   try {
//     const supabase = await createClient();
//     const { error: authErr, user } = await requireAdmin(supabase);
//     if (authErr) return authErr;

//     const body = await request.json();
//     const { id, ...patch } = body;
//     if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

//     const { error: updErr } = await supabase
//       .from("menu_items")
//       .update(patch)
//       .eq("id", id);
//     if (updErr) {
//       console.error("[v0] menu update error:", updErr);
//       return NextResponse.json({ error: "Failed to update" }, { status: 500 });
//     }

//     await supabase.from("audit_logs").insert({
//       actor_id: user.id,
//       action: "update_menu_item",
//       resource_type: "menu_items",
//       resource_id: id,
//       details: patch,
//     });

//     return NextResponse.json({ message: "Updated" });
//   } catch (err) {
//     console.error("[v0] menu PATCH error:", err);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// export async function DELETE(request: Request) {
//   try {
//     const supabase = await createClient();
//     const { error: authErr, user } = await requireAdmin(supabase);
//     if (authErr) return authErr;

//     const body = await request.json();
//     const { id } = body;
//     if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

//     const { error: delErr } = await supabase
//       .from("menu_items")
//       .delete()
//       .eq("id", id);
//     if (delErr) {
//       console.error("[v0] menu delete error:", delErr);
//       return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
//     }

//     await supabase.from("audit_logs").insert({
//       actor_id: user.id,
//       action: "delete_menu_item",
//       resource_type: "menu_items",
//       resource_id: id,
//     });

//     return NextResponse.json({ message: "Deleted" });
//   } catch (err) {
//     console.error("[v0] menu DELETE error:", err);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuth, requireStaff } from "@/lib/auth/require-auth";
import { ADMIN_ROLES, USER_ROLE } from "@/lib/domain/auth";

/* ======================================================
   GET — Admin + Kitchen
====================================================== */
export async function GET() {
  try {
    const supabase = await createClient();

    const { data: items, error } = await supabase
      .from("menu_items")
      .select(`*, category:categories!menu_items_category_id_fkey(name,slug)`)
      .order("name");

    if (error) {
      console.error("Menu GET error:", error);
      return NextResponse.json(
        { error: "Failed to fetch menu items" },
        { status: 500 }
      );
    }

    return NextResponse.json({ items: items ?? [] });
  } catch (err) {
    console.error("Menu GET error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/* ======================================================
   POST — Admin + Kitchen
====================================================== */
export async function POST(request: Request) {
  try {
    const { supabase, user, role } = await requireStaff(ADMIN_ROLES);

    const body = await request.json();
    const {
      name,
      description = null,
      price,
      image_url = null,
      is_vegetarian = false,
      is_available = true,
      preparation_time = null,
      calories = null,
      category_id,
    } = body;

    if (!name || price == null || !category_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("menu_items").insert({
      name,
      description,
      price,
      image_url,
      is_vegetarian,
      is_available,
      preparation_time,
      calories,
      category_id,
    });

    if (error) {
      console.error("Menu insert error:", error);
      return NextResponse.json(
        { error: "Failed to create menu item" },
        { status: 500 }
      );
    }

    await supabase.from("audit_logs").insert({
      actor_id: user.id,
      action: "MENU_ITEM_CREATED",
      resource_type: "menu_items",
      details: { name },
    });

    return NextResponse.json({ message: "Created" });
  } catch (err) {
    console.error("Menu POST error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/* ======================================================
   PATCH — Admin + Kitchen
====================================================== */
export async function PATCH(request: Request) {
  try {
    const { supabase, user, role } = await requireStaff(ADMIN_ROLES);

    const { id, ...patch } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const { error } = await supabase
      .from("menu_items")
      .update(patch)
      .eq("id", id);

    if (error) {
      console.error("Menu update error:", error);
      return NextResponse.json(
        { error: "Failed to update menu item" },
        { status: 500 }
      );
    }

    await supabase.from("audit_logs").insert({
      actor_id: user.id,
      action: "MENU_ITEM_UPDATED",
      resource_type: "menu_items",
      resource_id: id,
      details: patch,
    });

    return NextResponse.json({ message: "Updated" });
  } catch (err) {
    console.error("Menu PATCH error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/* ======================================================
   DELETE — ADMIN ONLY
====================================================== */
export async function DELETE(request: Request) {
  try {
    const { supabase, user, role } = await requireStaff(ADMIN_ROLES);

    if (role !== USER_ROLE.ADMIN) {
      return NextResponse.json(
        { error: "Only admin can delete menu items" },
        { status: 403 }
      );
    }

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const { error } = await supabase.from("menu_items").delete().eq("id", id);

    if (error) {
      console.error("Menu delete error:", error);
      return NextResponse.json(
        { error: "Failed to delete menu item" },
        { status: 500 }
      );
    }

    await supabase.from("audit_logs").insert({
      actor_id: user.id,
      action: "MENU_ITEM_DELETED",
      resource_type: "menu_items",
      resource_id: id,
    });

    return NextResponse.json({ message: "Deleted" });
  } catch (err) {
    console.error("Menu DELETE error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
