import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth/require-auth";
import { USER_ROLE } from "@/lib/domain/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  try {
    /* ---------- AUTH (DELIVERY ONLY) ---------- */
    const { supabase, user, role } = await requireStaff([USER_ROLE.DELIVERY]);

    if (role !== USER_ROLE.DELIVERY) {
      return NextResponse.json(
        { error: "Forbidden - delivery role required" },
        { status: 403 },
      );
    }

    /* ---------- FETCH ASSIGNED ORDERS ---------- */
    // Get orders where this delivery person is assigned and not cancelled
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select(
        `
        id,
        status,
        total_amount,
        created_at,
        delivery_address,
        delivery_city,
        phone,
        payment_method,
        payment_status,
        delivery_failure_reason,
        user_id,
        delivery_assignments!inner (
          id,
          delivery_id,
          cancelled,
          delivery_users:delivery_id (
            id,
            full_name
          )
        )
      `,
      )
      .eq("delivery_assignments.delivery_id", user.id)
      .eq("delivery_assignments.cancelled", false)
      .order("created_at", { ascending: false });

    if (ordersError) {
      console.error("Failed to fetch delivery orders:", ordersError);
      return NextResponse.json(
        { error: "Failed to fetch orders" },
        { status: 500 },
      );
    }

    /* ---------- GET CUSTOMER DETAILS ---------- */
    const safeOrders = orders ?? [];

    const userIds = Array.from(
      new Set(safeOrders.map((o) => o.user_id).filter(Boolean)),
    );

    let profilesMap: Record<string, any> = {};
    if (userIds.length) {
      const { data: profiles, error } = await supabaseAdmin
        .from("profiles")
        .select("id, full_name, phone")
        .in("id", userIds);
      if (error) {
        console.error("Failed to fetch delivery customer profiles:", error);
        return NextResponse.json(
          { error: "Failed to fetch customer details" },
          { status: 500 },
        );
      }
      (profiles || []).forEach((p: any) => (profilesMap[p.id] = p));
    }

    const ordersWithCustomer = orders.map((o: any) => ({
      ...o,
      customer_full_name: profilesMap[o.user_id]?.full_name || undefined,
      customer_phone: profilesMap[o.user_id]?.phone || undefined,
    }));

    return NextResponse.json({
      orders: ordersWithCustomer ?? [],
      count: ordersWithCustomer?.length ?? 0,
    });
  } catch (err) {
    console.error("Delivery orders route error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
