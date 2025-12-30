// import { createClient } from "@/lib/supabase/server";
// import { NextResponse } from "next/server";

// export async function GET() {
//   try {
//     const supabase = await createClient();
//     // Simple admin check: ensure caller is authenticated and admin
//     const {
//       data: { user },
//     } = await supabase.auth.getUser();
//     if (!user)
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     const { data: profile } = await supabase
//       .from("profiles")
//       .select("role")
//       .eq("id", user.id)
//       .single();
//     const role = profile?.role;
//     if (
//       !role ||
//       !(role === "ADMIN" || role === "SUPER_ADMIN" || role === "KITCHEN")
//     ) {
//       return NextResponse.json({ error: "Forbidden" }, { status: 403 });
//     }

//     // Aggregates
//     const { data: totalOrdersData } = await supabase
//       .from("orders")
//       .select("id");
//     const totalOrders = (totalOrdersData || []).length;

//     const { data: paidRows } = await supabase
//       .from("orders")
//       .select("total_amount")
//       .eq("payment_status", "paid");
//     const totalRevenue = (paidRows || []).reduce(
//       (s: number, r: any) => s + Number(r.total_amount || 0),
//       0
//     );

//     const statuses = [
//       "PENDING",
//       "CONFIRMED",
//       "PREPARING",
//       "OUT_FOR_DELIVERY",
//       "DELIVERED",
//       "CANCELLED",
//     ];
//     const ordersByStatus: Record<string, number> = {};
//     for (const s of statuses) {
//       const { data } = await supabase
//         .from("orders")
//         .select("id")
//         .eq("status", s);
//       ordersByStatus[s] = (data || []).length;
//     }

//     return NextResponse.json({ totalOrders, totalRevenue, ordersByStatus });
//   } catch (err) {
//     console.error("[v0] analytics summary error:", err);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import { requireAuth, requireStaff } from "@/lib/auth/require-auth";
import { ADMIN_ROLES, USER_ROLE } from "@/lib/domain/auth";
import { ORDER_STATUS } from "@/lib/domain/order";
export const dynamic = "force-dynamic";
/* Cache analytics for 30 seconds */

export async function GET() {
  try {
    /* ---------- AUTH (ADMIN + KITCHEN) ---------- */
    const { supabase, user, role } = await requireStaff(ADMIN_ROLES);

    if (role === USER_ROLE.DELIVERY) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    /* ---------- PARALLEL DB AGGREGATES ---------- */
    const [financialRes, statusCountsRes] = await Promise.all([
      supabase
        .from("order_financial_summary")
        .select(
          `
          total_orders,
          gross_revenue,
          refunded_revenue,
          net_revenue,
          cancelled_revenue
        `
        )
        .single(),

      supabase.from("order_status_counts").select("status, count"),
    ]);

    if (financialRes.error || !financialRes.data) {
      console.error("Financial summary error:", financialRes.error);
      return NextResponse.json(
        { error: "Failed to fetch revenue data" },
        { status: 500 }
      );
    }

    /* ---------- ORDERS BY STATUS ---------- */
    const ordersByStatus: Record<string, number> = {};

    // Initialize all statuses to 0 (UI-safe)
    Object.values(ORDER_STATUS).forEach((status) => {
      ordersByStatus[status] = 0;
    });

    if (statusCountsRes.error) {
      console.error("Order status count error:", statusCountsRes.error);
    } else {
      for (const row of statusCountsRes.data ?? []) {
        ordersByStatus[row.status] = row.count;
      }
    }

    /* ---------- RESPONSE ---------- */
    return NextResponse.json({
      totalOrders: Number(financialRes.data.total_orders ?? 0),

      revenue: {
        gross: Number(financialRes.data.gross_revenue ?? 0),
        refunded: Number(financialRes.data.refunded_revenue ?? 0),
        net: Number(financialRes.data.net_revenue ?? 0),
        cancelled: Number(financialRes.data.cancelled_revenue ?? 0),
      },

      ordersByStatus,
    });
  } catch (err) {
    console.error("Analytics summary error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
