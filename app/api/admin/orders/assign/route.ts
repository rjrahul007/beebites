import { NextResponse } from "next/server";
import { requireAuth, requireStaff } from "@/lib/auth/require-auth";
import { ADMIN_ROLES, USER_ROLE } from "@/lib/domain/auth";

export async function POST(request: Request) {
  try {
    /* ---------- AUTH (ADMIN ONLY) ---------- */
    const { supabase, user, role } = await requireStaff([USER_ROLE.ADMIN]);

    if (role !== USER_ROLE.ADMIN) {
      return NextResponse.json(
        { error: "Only admin can assign delivery" },
        { status: 403 },
      );
    }

    /* ---------- INPUT ---------- */
    const { orderId, deliveryId } = await request.json();

    if (!orderId || !deliveryId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    /* ---------- VALIDATE DELIVERY USER ---------- */
    const { data: deliveryProfile } = await supabase
      .from("profiles")
      .select("id, role")
      .eq("id", deliveryId)
      .single();

    if (!deliveryProfile || deliveryProfile.role !== USER_ROLE.DELIVERY) {
      return NextResponse.json(
        { error: "Invalid delivery user" },
        { status: 400 },
      );
    }

    /* ---------- UPSERT ASSIGNMENT ---------- */
    const { error: upsertError } = await supabase
      .from("delivery_assignments")
      .upsert(
        {
          order_id: orderId,
          delivery_id: deliveryId,
          assigned_by: user.id,
          assigned_at: new Date().toISOString(),
          cancelled: false,
          cancel_reason: null,
        },
        {
          onConflict: "order_id",
        },
      );

    if (upsertError) {
      console.error("Delivery assignment failed:", upsertError);
      return NextResponse.json(
        { error: "Failed to assign delivery" },
        { status: 500 },
      );
    }

    /* ---------- AUDIT ---------- */
    await supabase.from("audit_logs").insert({
      actor_id: user.id,
      action: "DELIVERY_ASSIGNED",
      resource_type: "order",
      resource_id: orderId,
      details: {
        delivery_id: deliveryId,
      },
    });

    return NextResponse.json({
      message: "Delivery assigned successfully",
    });
  } catch (err) {
    console.error("Assign delivery error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
