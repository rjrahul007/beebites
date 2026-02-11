// import { NextResponse } from "next/server";
// import { createClient } from "@/lib/supabase/server";
// import { createHash } from "crypto";
// import { PAYMENT_STATUS } from "@/lib/domain/payment";
// import { ORDER_STATUS } from "@/lib/domain/order";
// import { supabaseAdmin } from "@/lib/supabase/admin";

// export async function POST(req: Request) {
//   try {
//     const supabase = await createClient();
//     const {
//       data: { user },
//     } = await supabase.auth.getUser();

//     if (!user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const body = await req.json();
//     const {
//       items,
//       total_amount,
//       delivery_address,
//       delivery_city,
//       delivery_pincode,
//       phone,
//     } = body;

//     if (
//       !items ||
//       !total_amount ||
//       !delivery_address ||
//       !delivery_city ||
//       !delivery_pincode ||
//       !phone
//     ) {
//       return NextResponse.json({ error: "Missing fields" }, { status: 400 });
//     }

//     // 1️⃣ Create order
//     const { data: order, error } = await supabase
//       .from("orders")
//       .insert({
//         user_id: user.id,
//         status: ORDER_STATUS.PENDING,
//         payment_status: PAYMENT_STATUS.PENDING,
//         payment_method: "upi",
//         total_amount,
//         delivery_address,
//         delivery_city,
//         delivery_pincode,
//         phone,
//         customer_name: user.email?.split("@")[0] || "Customer",
//       })
//       .select()
//       .single();

//     if (error) throw error;

//     // 2️⃣ Insert order items
//     const orderItems = items.map((item: any) => ({
//       order_id: order.id,
//       menu_item_id: item.id,
//       item_name: item.name,
//       price: item.price,
//       quantity: item.quantity,
//     }));

//     await supabase.from("order_items").insert(orderItems);

//     // 3️⃣ Insert payment record
//     const { error: payErr } = await supabaseAdmin.from("payments").insert({
//       order_id: order.id,
//       user_id: user.id,
//       provider: "payu",
//       txnid: order.id,
//       amount: total_amount,
//       status: PAYMENT_STATUS.PENDING,
//     });

//     if (payErr) console.error("PAYMENT INSERT ERROR:", payErr);

//     // 4️⃣ PayU params
//     const key = process.env.MERCHANT_KEY!;
//     const salt = process.env.MERCHANT_SALT!;
//     const baseUrl = process.env.PAYU_BASE_URL!;
//     const callback = process.env.CALLBACK_URL!;

//     const payuParams: any = {
//       key,
//       txnid: order.id,
//       amount: total_amount.toString(),
//       productinfo: "Beebites Food Order",
//       firstname: user.email || "Customer",
//       email: user.email || "",
//       phone,
//       surl: `${callback}/success`,
//       furl: `${callback}/failure`,
//     };

//     const hashString =
//       `${key}|${payuParams.txnid}|${payuParams.amount}|${payuParams.productinfo}|` +
//       `${payuParams.firstname}|${payuParams.email}|||||||||||${salt}`;

//     payuParams.hash = createHash("sha512").update(hashString).digest("hex");

//     // console.log("SURL SENT TO PAYU:", `${callback}/success`);

//     return NextResponse.json({
//       url: `${baseUrl}/_payment`,
//       params: payuParams,
//     });
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ error: "Payment init failed" }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createHash } from "crypto";
import { PAYMENT_STATUS } from "@/lib/domain/payment";
import { ORDER_STATUS } from "@/lib/domain/order";

/* -------------------------------------------------------
   PayU payload builder (single source of truth)
------------------------------------------------------- */
function buildPayuPayload({
  orderId,
  amount,
  phone,
  email,
  firstname,
}: {
  orderId: string;
  amount: number;
  phone: string;
  email?: string | null;
  firstname?: string | null;
}) {
  const key = process.env.MERCHANT_KEY!;
  const salt = process.env.MERCHANT_SALT!;
  const baseUrl = process.env.PAYU_BASE_URL!;
  const callback = process.env.CALLBACK_URL!;

  const params: any = {
    key,
    txnid: orderId,
    amount: amount.toString(),
    productinfo: "Beebites Food Order",
    firstname: firstname || "Customer",
    email: email || "",
    phone,
    surl: `${callback}/success`,
    furl: `${callback}/failure`,
  };

  const hashString =
    `${key}|${params.txnid}|${params.amount}|${params.productinfo}|` +
    `${params.firstname}|${params.email}|||||||||||${salt}`;

  params.hash = createHash("sha512").update(hashString).digest("hex");

  return {
    url: `${baseUrl}/_payment`,
    params,
  };
}

/* -------------------------------------------------------
   POST handler
------------------------------------------------------- */
export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    /* =========================
       🔁 RETRY PAYMENT FLOW
    ========================= */
    if (body.orderId) {
      const { orderId } = body;

      const { data: order } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .eq("user_id", user.id)
        .single();

      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      if (order.status !== ORDER_STATUS.PAYMENT_FAILED) {
        return NextResponse.json(
          { error: "Order is not eligible for retry" },
          { status: 400 },
        );
      }

      const payload = buildPayuPayload({
        orderId: order.id,
        amount: order.total_amount,
        phone: order.phone,
        email: user.email,
        firstname: order.customer_name,
      });

      return NextResponse.json(payload);
    }

    /* =========================
       🆕 NEW ORDER FLOW
    ========================= */
    const {
      items,
      total_amount,
      delivery_address,
      delivery_city,
      delivery_pincode,
      phone,
    } = body;

    if (
      !items ||
      !total_amount ||
      !delivery_address ||
      !delivery_city ||
      !delivery_pincode ||
      !phone
    ) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const estimatedTime = new Date(
      Date.now() + 45 * 60 * 1000, // 45 minutes
    );
    // 1️⃣ Create order
    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        status: ORDER_STATUS.PENDING,
        payment_status: PAYMENT_STATUS.PENDING,
        payment_method: "upi", // ✅ must match DB check constraint
        total_amount,
        delivery_address,
        delivery_city,
        delivery_pincode,
        phone,
        customer_name: user.email?.split("@")[0] || "Customer",
        estimated_delivery_time: estimatedTime,
      })
      .select()
      .single();

    if (error) throw error;

    // 2️⃣ Insert order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      menu_item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));

    await supabase.from("order_items").insert(orderItems);

    // 3️⃣ Insert payment record (admin client → bypass RLS)
    const { error: paymentError } = await supabaseAdmin
      .from("payments")
      .insert({
        order_id: order.id,
        user_id: user.id,
        provider: "payu",
        txnid: order.id,
        amount: total_amount,
        status: PAYMENT_STATUS.PENDING,
      });

    if (paymentError) {
      console.error("PAYMENT INSERT ERROR:", paymentError);
    }

    // 4️⃣ Build PayU payload
    const payload = buildPayuPayload({
      orderId: order.id,
      amount: total_amount,
      phone,
      email: user.email,
      firstname: order.customer_name,
    });

    return NextResponse.json(payload);
  } catch (err) {
    console.error("PAYU INIT ERROR:", err);
    return NextResponse.json({ error: "Payment init failed" }, { status: 500 });
  }
}
