import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuth, requireStaff } from "@/lib/auth/require-auth";
import { ADMIN_ROLES, USER_ROLE } from "@/lib/domain/auth";

export async function GET() {
  try {
    /* ---------- AUTH (ADMIN + KITCHEN) ---------- */
    const { supabase, user, role } = await requireStaff(ADMIN_ROLES);

    // Explicitly exclude DELIVERY
    if (role === USER_ROLE.DELIVERY) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    /* ---------- FETCH DELIVERY USERS ---------- */
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, phone")
      .eq("role", USER_ROLE.DELIVERY);

    if (error) {
      console.error("Delivery list error:", error);
      return NextResponse.json(
        { error: "Failed to fetch delivery users" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      delivery: data ?? [],
    });
  } catch (err) {
    console.error("Delivery list route error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
