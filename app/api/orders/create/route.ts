import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { ORDER_STATUS } from "@/lib/domain/order";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    /* ---------- FETCH CUSTOMER SNAPSHOT ---------- */
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();

    if (profileError || !profile?.full_name) {
      return NextResponse.json(
        { error: "Failed to fetch customer profile" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      items,
      total_amount,
      delivery_address,
      delivery_city,
      delivery_pincode,
      phone,
      payment_method,
      special_instructions,
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Create order
    const estimatedDeliveryTime = new Date();
    estimatedDeliveryTime.setMinutes(estimatedDeliveryTime.getMinutes() + 40);

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        customer_name: profile.full_name,
        total_amount,
        delivery_address,
        delivery_city,
        delivery_pincode,
        phone,
        payment_method,
        special_instructions: special_instructions || null,
        status: ORDER_STATUS.PENDING,
        payment_status: payment_method === "cash" ? "pending" : "pending",
        estimated_delivery_time: estimatedDeliveryTime.toISOString(),
      })
      .select()
      .single();

    if (orderError) {
      console.error("Order creation error:", orderError);
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 }
      );
    }

    // Create order items
    const orderItems = items.map(
      (item: {
        id: string;
        name: string;
        price: number;
        quantity: number;
      }) => ({
        order_id: order.id,
        menu_item_id: item.id,
        quantity: item.quantity,
        price: item.price,
        item_name: item.name,
      })
    );

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("[v0] Order items creation error:", itemsError);
      // Rollback order if items fail
      await supabase.from("orders").delete().eq("id", order.id);
      return NextResponse.json(
        { error: "Failed to create order items" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      orderId: order.id,
      message: "Order created successfully",
    });
  } catch (error) {
    console.error("[v0] Order creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
