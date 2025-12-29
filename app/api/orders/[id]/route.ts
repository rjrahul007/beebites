// import { createClient } from "@/lib/supabase/server";
// import { NextResponse } from "next/server";

// export async function GET(
//   _request: Request,
//   context: { params: { id: string } | Promise<{ id: string }> }
// ) {
//   try {
//     const supabase = await createClient();
//     const params = (await context.params) as { id: string };
//     const id = params.id;

//     const { data: order, error: orderErr } = await supabase
//       .from("orders")
//       .select("*")
//       .eq("id", id)
//       .single();
//     if (orderErr) {
//       console.error("[v0] fetch order error:", orderErr);
//       return NextResponse.json({ error: "Order not found" }, { status: 404 });
//     }

//     const { data: items } = await supabase
//       .from("order_items")
//       .select("*")
//       .eq("order_id", id);

//     // Normalize status to lowercase for client
//     if (order && order.status)
//       order.status = String(order.status).toLowerCase();

//     return NextResponse.json({ order, items: items ?? [] });
//   } catch (err) {
//     console.error("[v0] order GET error:", err);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { normalizeOrder } from "@/lib/orders/normalize-order";

export async function GET(
  _request: Request,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = (await context.params) as { id: string };

    /* ---------- PARALLEL FETCH ---------- */
    const [{ data: order, error: orderErr }, { data: items, error: itemsErr }] =
      await Promise.all([
        supabase
          .from("orders")
          .select(
            `
            id,
            user_id,
            customer_name,
            status,
            total_amount,
            delivery_address,
            delivery_city,
            delivery_pincode,
            phone,
            payment_method,
            payment_status,
            special_instructions,
            estimated_delivery_time,
            created_at,
            updated_at,
            delivery_failure_reason
          `
          )
          .eq("id", id)
          .single(),

        supabase
          .from("order_items")
          .select(
            `
            id,
            menu_item_id,
            item_name,
            quantity,
            price
          `
          )
          .eq("order_id", id),
      ]);

    if (orderErr || !order) {
      console.error("[order GET] order error:", orderErr);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (itemsErr) {
      console.error("[order GET] items error:", itemsErr);
      return NextResponse.json(
        { error: "Failed to fetch order items" },
        { status: 500 }
      );
    }

    /* ---------- NORMALIZE ---------- */
    const normalizedOrder = normalizeOrder(order);

    return NextResponse.json({
      order: normalizedOrder,
      items: items ?? [],
    });
  } catch (err) {
    console.error("[order GET] error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
