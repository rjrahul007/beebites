// import { createClient } from "@/lib/supabase/server";
// import { NextResponse } from "next/server";

// const VALID_STATUSES = [
//   "PENDING",
//   "CONFIRMED",
//   "PREPARING",
//   "OUT_FOR_DELIVERY",
//   "DELIVERED",
//   "DELIVERY_FAILED",
//   "CANCELLED",
// ];

// const ADMIN_ROLES = ["ADMIN"];

// export async function POST(request: Request) {
//   try {
//     const supabase = await createClient();
//     const {
//       data: { user },
//     } = await supabase.auth.getUser();

//     if (!user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     // Fetch profile role (use role enum: SUPER_ADMIN, ADMIN, KITCHEN, DELIVERY, CUSTOMER)
//     const { data: profile } = await supabase
//       .from("profiles")
//       .select("role")
//       .eq("id", user.id)
//       .single();

//     const role = profile?.role;
//     if (!role) {
//       return NextResponse.json({ error: "Forbidden" }, { status: 403 });
//     }

//     const body = await request.json();
//     const { orderId, status, deliveryFailureReason } = body;

//     if (!orderId || !status) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     // Normalize to enum format (uppercase)
//     const statusUpper = String(status).toUpperCase();

//     if (!VALID_STATUSES.includes(statusUpper)) {
//       return NextResponse.json({ error: "Invalid status" }, { status: 400 });
//     }

//     // Role-based allowed target statuses (additional server-side enforcement)
//     // const adminRoles = ["ADMIN", "SUPER_ADMIN"];

//     if (!ADMIN_ROLES.includes(role)) {
//       // KITCHEN: allow PREPARING and OUT_FOR_DELIVERY
//       if (
//         role === "KITCHEN" &&
//         !["PREPARING", "OUT_FOR_DELIVERY"].includes(statusUpper)
//       ) {
//         return NextResponse.json(
//           { error: "Forbidden for kitchen role" },
//           { status: 403 }
//         );
//       }

//       // DELIVERY: allow DELIVERED and CANCELLED (cancellation requires reason)
//       if (role === "DELIVERY") {
//         if (!["DELIVERED", "DELIVERY_FAILED"].includes(statusUpper)) {
//           return NextResponse.json(
//             { error: "Forbidden for delivery role" },
//             { status: 403 }
//           );
//         }
//       }

//       // delivery failure reason required
//       if (statusUpper === "DELIVERY_FAILED" && !deliveryFailureReason) {
//         return NextResponse.json(
//           { error: "Delivery failure requires a reason" },
//           { status: 400 }
//         );
//       }

//       if (!["KITCHEN", "DELIVERY"].includes(role)) {
//         return NextResponse.json({ error: "Forbidden" }, { status: 403 });
//       }
//     }

//     // Use server-side RPC to perform the transition (validates state machine and writes audit log)
//     // Fetch current order status for debugging and to ensure casting is correct
//     const { data: currentOrder } = await supabase
//       .from("orders")
//       .select("id,status")
//       .eq("id", orderId)
//       .single();

//     // console.log("[v0] currentOrder before transition:", currentOrder);
//     if (!currentOrder) {
//       return NextResponse.json({ error: "Order not found" }, { status: 404 });
//     }
//     const rpcResult = await supabase.rpc("transition_order", {
//       p_order_id: orderId,
//       p_new_status: statusUpper,
//     });

//     // log full rpc result for debugging
//     console.log("[v0] transition_order rpc result:", rpcResult);

//     const fromStatus = String(currentOrder.status);

//     /* ---------- STATE TRANSITION (RPC) ---------- */
//     const { error: rpcError } = await supabase.rpc("transition_order", {
//       p_order_id: orderId,
//       p_new_status: statusUpper,
//     });

//     if (rpcError) {
//       console.error("transition_order failed:", rpcError);
//       return NextResponse.json(
//         { error: "Invalid order transition" },
//         { status: 400 }
//       );
//     }

//     /* ---------- POST-TRANSITION FETCH ---------- */
//     const { data: updatedOrder } = await supabase
//       .from("orders")
//       .select("id,status")
//       .eq("id", orderId)
//       .single();

//     /* ---------- PAYMENT OVERRIDE ---------- */
//     if (statusUpper === "DELIVERED" && ADMIN_ROLES.includes(role)) {
//       await supabase
//         .from("orders")
//         .update({ payment_status: "paid" })
//         .eq("id", orderId);
//     }

//     /* ---------- DELIVERY FAILURE DETAILS ---------- */
//     if (statusUpper === "DELIVERY_FAILED") {
//       await supabase
//         .from("orders")
//         .update({
//           delivery_failure_reason: deliveryFailureReason,
//         })
//         .eq("id", orderId);
//     }

//     /* ---------- AUDIT LOG ---------- */
//     await supabase.from("audit_logs").insert({
//       actor_id: user.id,
//       action: "ORDER_STATUS_UPDATED",
//       resource_type: "order",
//       resource_id: orderId,
//       details: {
//         from_status: fromStatus,
//         to_status: statusUpper,
//         role,
//         delivery_failure_reason:
//           statusUpper === "DELIVERY_FAILED" ? deliveryFailureReason : null,
//       },
//     });

//     return NextResponse.json({
//       message: "Order status updated successfully",
//       order: {
//         ...updatedOrder,
//         status: String(updatedOrder?.status).toLowerCase(),
//       },
//     });
//   } catch (error) {
//     console.error("Order status update error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
// import { createClient } from "@/lib/supabase/server";
// import { NextResponse } from "next/server";
// import {
//   Role,
//   OrderStatus,
//   isValidStatus,
//   canRoleSetStatus,
// } from "@/lib/orders/order-permissions";

// export async function POST(request: Request) {
//   try {
//     const supabase = await createClient();

//     /* ---------- AUTH ---------- */
//     const {
//       data: { user },
//     } = await supabase.auth.getUser();

//     if (!user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const { data: profile } = await supabase
//       .from("profiles")
//       .select("role")
//       .eq("id", user.id)
//       .single();

//     const role = profile?.role as Role | null;

//     if (!role || !["ADMIN", "KITCHEN", "DELIVERY"].includes(role)) {
//       return NextResponse.json({ error: "Forbidden" }, { status: 403 });
//     }

//     /* ---------- INPUT ---------- */
//     const { orderId, status, deliveryFailureReason } = await request.json();

//     if (!orderId || !status) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     const statusUpper = String(status).toUpperCase();

//     if (!isValidStatus(statusUpper)) {
//       return NextResponse.json({ error: "Invalid status" }, { status: 400 });
//     }

//     /* ---------- ROLE PERMISSION ---------- */
//     if (!canRoleSetStatus(role, statusUpper)) {
//       return NextResponse.json(
//         { error: "Forbidden for this role" },
//         { status: 403 }
//       );
//     }

//     if (statusUpper === "DELIVERY_FAILED" && !deliveryFailureReason) {
//       return NextResponse.json(
//         { error: "Delivery failure requires a reason" },
//         { status: 400 }
//       );
//     }

//     /* ---------- FETCH ORDER ---------- */
//     const { data: currentOrder } = await supabase
//       .from("orders")
//       .select("id, status")
//       .eq("id", orderId)
//       .single();

//     if (!currentOrder) {
//       return NextResponse.json({ error: "Order not found" }, { status: 404 });
//     }

//     const fromStatus = String(currentOrder.status);

//     /* ---------- SINGLE RPC (DB IS SOURCE OF TRUTH) ---------- */
//     const { error: rpcError } = await supabase.rpc("transition_order", {
//       p_order_id: orderId,
//       p_new_status: statusUpper,
//     });

//     if (rpcError) {
//       console.error("transition_order failed:", rpcError);
//       return NextResponse.json(
//         { error: "Invalid order transition" },
//         { status: 400 }
//       );
//     }

//     /* ---------- POST-TRANSITION ---------- */
//     const { data: updatedOrder } = await supabase
//       .from("orders")
//       .select("id, status")
//       .eq("id", orderId)
//       .single();

//     /* ---------- SIDE EFFECTS ---------- */
//     if (statusUpper === "DELIVERED" && role === "ADMIN") {
//       await supabase
//         .from("orders")
//         .update({ payment_status: "paid" })
//         .eq("id", orderId);
//     }

//     if (statusUpper === "DELIVERY_FAILED") {
//       await supabase
//         .from("orders")
//         .update({
//           delivery_failure_reason: deliveryFailureReason,
//         })
//         .eq("id", orderId);
//     }

//     return NextResponse.json({
//       message: "Order status updated successfully",
//       order: {
//         ...updatedOrder,
//         status: String(updatedOrder?.status).toLowerCase(),
//       },
//     });
//   } catch (error) {
//     console.error("Order status update error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// import { NextResponse } from "next/server";
// import { requireAuth, requireStaff } from "@/lib/auth/require-auth";
// import { ADMIN_ROLES } from "@/lib/domain/auth";

// import {
//   isValidStatus,
//   canRoleSetStatus,
// } from "@/lib/orders/order-permissions";

// import { OrderStatus } from "@/lib/domain/order";

// export async function POST(request: Request) {
//   try {
//     /* ---------- AUTH (STAFF ONLY) ---------- */
//     const { supabase, role } = await requireStaff(ADMIN_ROLES);

//     /* ---------- INPUT ---------- */
//     const { orderId, status, deliveryFailureReason } = await request.json();

//     if (!orderId || !status) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 },
//       );
//     }

//     const rawStatus = String(status).toUpperCase();

//     if (!isValidStatus(rawStatus)) {
//       return NextResponse.json({ error: "Invalid status" }, { status: 400 });
//     }

//     const nextStatus: OrderStatus = rawStatus;

//     if (!isValidStatus(nextStatus)) {
//       return NextResponse.json({ error: "Invalid status" }, { status: 400 });
//     }

//     /* ---------- ROLE → STATUS ---------- */
//     if (!canRoleSetStatus(role, nextStatus)) {
//       return NextResponse.json(
//         { error: "Role cannot set this status" },
//         { status: 403 },
//       );
//     }

//     if (nextStatus === "DELIVERY_FAILED" && !deliveryFailureReason) {
//       return NextResponse.json(
//         { error: "Delivery failure requires a reason" },
//         { status: 400 },
//       );
//     }

//     /* ---------- FETCH ORDER ---------- */
//     const { data: currentOrder } = await supabase
//       .from("orders")
//       .select("id, status")
//       .eq("id", orderId)
//       .single();

//     if (!currentOrder) {
//       return NextResponse.json({ error: "Order not found" }, { status: 404 });
//     }

//     const fromStatus = currentOrder.status;

//     /* ---------- TRANSITION (DB AUTHORITY) ---------- */
//     const { error: rpcError } = await supabase.rpc("transition_order", {
//       p_order_id: orderId,
//       p_new_status: nextStatus,
//     });

//     if (rpcError) {
//       console.error("transition_order failed:", rpcError);
//       return NextResponse.json(
//         { error: "Invalid order transition" },
//         { status: 400 },
//       );
//     }

//     /* ---------- SIDE EFFECTS ---------- */
//     if (nextStatus === "DELIVERED") {
//       await supabase
//         .from("orders")
//         .update({ payment_status: "paid" })
//         .eq("id", orderId);
//     }

//     if (nextStatus === "DELIVERY_FAILED") {
//       await supabase
//         .from("orders")
//         .update({ delivery_failure_reason: deliveryFailureReason })
//         .eq("id", orderId);
//     }

//     /* ---------- RESPONSE ---------- */
//     return NextResponse.json({
//       message: "Order status updated successfully",
//       from: fromStatus,
//       to: nextStatus.toLowerCase(),
//     });
//   } catch (error) {
//     console.error("Order status update error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 },
//     );
//   }
// }

import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth/require-auth";
import { ADMIN_ROLES } from "@/lib/domain/auth";

import {
  isValidStatus,
  canRoleSetStatusFromCurrent,
} from "@/lib/orders/order-permissions";

import { OrderStatus } from "@/lib/domain/order";

export async function POST(request: Request) {
  try {
    /* ---------- AUTH (STAFF ONLY) ---------- */
    const { supabase, role } = await requireStaff(ADMIN_ROLES);

    /* ---------- INPUT ---------- */
    const { orderId, status, deliveryFailureReason } = await request.json();

    if (!orderId || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const rawStatus = String(status).toUpperCase();

    if (!isValidStatus(rawStatus)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const nextStatus: OrderStatus = rawStatus;

    /* ---------- FETCH ORDER ---------- */
    const { data: currentOrder, error: currentOrderError } = await supabase
      .from("orders")
      .select("id, status")
      .eq("id", orderId)
      .single();

    if (currentOrderError) {
      console.error("Failed to fetch order:", currentOrderError);
      return NextResponse.json(
        { error: "Failed to fetch order" },
        { status: 500 },
      );
    }

    if (!currentOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const fromStatus = currentOrder.status as OrderStatus;

    /* ---------- ROLE → STATUS (transition-based) ---------- */
    if (!canRoleSetStatusFromCurrent(role, fromStatus, nextStatus)) {
      return NextResponse.json(
        { error: "Role cannot transition to this status" },
        { status: 403 },
      );
    }

    if (nextStatus === "DELIVERY_FAILED" && !deliveryFailureReason) {
      return NextResponse.json(
        { error: "Delivery failure requires a reason" },
        { status: 400 },
      );
    }

    /* ---------- TRANSITION (DB AUTHORITY) ---------- */
    const { error: rpcError } = await supabase.rpc("transition_order", {
      p_order_id: orderId,
      p_new_status: nextStatus,
    });

    if (rpcError) {
      console.error("transition_order failed:", rpcError);
      return NextResponse.json(
        { error: "Invalid order transition" },
        { status: 400 },
      );
    }

    /* ---------- SIDE EFFECTS ---------- */
    if (nextStatus === "DELIVERED") {
      await supabase
        .from("orders")
        .update({ payment_status: "paid" })
        .eq("id", orderId);
    }

    if (nextStatus === "DELIVERY_FAILED") {
      await supabase
        .from("orders")
        .update({ delivery_failure_reason: deliveryFailureReason })
        .eq("id", orderId);
    }

    /* ---------- RESPONSE ---------- */
    const { data: updatedOrder, error: updatedError } = await supabase
      .from("orders")
      .select("id, status, payment_status")
      .eq("id", orderId)
      .single();

    if (updatedError) {
      console.error("Failed to fetch updated order:", updatedError);
    }

    return NextResponse.json({
      message: "Order status updated successfully",
      from: fromStatus,
      to: nextStatus,
      order: updatedOrder ?? { id: orderId, status: nextStatus },
    });
  } catch (error) {
    console.error("Order status update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
