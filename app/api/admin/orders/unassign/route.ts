import { NextResponse } from "next/server";
import { requireAuth, requireStaff } from "@/lib/auth/require-auth";
import { ADMIN_ROLES } from "@/lib/domain/auth";

export async function DELETE(request: Request) {
  try {
    /* ---------- AUTH (ADMIN ONLY) ---------- */
    const { supabase, user, role } = await requireStaff(ADMIN_ROLES);

    // Explicit guard: ADMIN only
    if (role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admin can unassign delivery" },
        { status: 403 }
      );
    }

    /* ---------- INPUT ---------- */
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    /* ---------- UNASSIGN DELIVERY ---------- */
    const { error } = await supabase
      .from("delivery_assignments")
      .delete()
      .eq("order_id", orderId);

    if (error) {
      console.error("Unassign failed:", error);
      return NextResponse.json(
        { error: "Failed to unassign delivery" },
        { status: 500 }
      );
    }

    /* ---------- AUDIT ---------- */
    await supabase.from("audit_logs").insert({
      actor_id: user.id,
      action: "DELIVERY_UNASSIGNED",
      resource_type: "order",
      resource_id: orderId,
      details: {
        role: "ADMIN",
      },
    });

    return NextResponse.json({
      message: "Delivery unassigned successfully",
    });
  } catch (err) {
    console.error("Unassign route error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
