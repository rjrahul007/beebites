import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { PAYMENT_STATUS } from "@/lib/domain/payment";
import { sanitizePayuPayload } from "@/lib/domain/payment";
import { ORDER_STATUS } from "@/lib/domain/order";
export async function POST(req: Request) {
  const supabase = supabaseAdmin;

  try {
    const data = await req.formData();

    const txnid = data.get("txnid") as string;
    const mihpayid = data.get("mihpayid") as string;
    const status = (data.get("status") as string)?.toLowerCase();
    const mode = data.get("mode") as string;
    const bankcode = data.get("bankcode") as string;
    const bankRef = data.get("bank_ref_num") as string;
    const cardnum = data.get("cardnum") as string;
    const cardtype = data.get("cardtype") as string;
    const unmappedstatus = data.get("unmappedstatus") as string;
    if (!txnid) {
      return NextResponse.redirect(`${process.env.FRONTEND_URL}/cart`);
    }

    // Only mark success if PayU says success
    if (status !== "success") {
      return NextResponse.redirect(
        `${process.env.FRONTEND_URL}/cart?payment=failed`,
      );
    }

    // Check existing payment status
    const { data: payment } = await supabase
      .from("payments")
      .select("status")
      .eq("txnid", txnid)
      .single();

    if (payment?.status !== "SUCCESS") {
      // Update payments table
      await supabase
        .from("payments")
        .update({
          status: "SUCCESS",
          gateway_payment_id: mihpayid,
          payment_mode: mode,
          bank_code: bankcode,
          bank_ref_num: bankRef,
          card_last4: cardnum?.slice(-4),
          card_type: cardtype,
          unmapped_status: unmappedstatus,
          raw_payload: sanitizePayuPayload(data),
          updated_at: new Date(),
        })
        .eq("txnid", txnid);

      // Update order
      await supabase
        .from("orders")
        .update({
          payment_status: PAYMENT_STATUS.PAID,
          status: ORDER_STATUS.CONFIRMED,
        })
        .eq("id", txnid);
    }

    return NextResponse.redirect(
      `${process.env.FRONTEND_URL}/payment?status=success&orderId=${txnid}`,
    );

    // return NextResponse.redirect("http://localhost:3000/orders/test");
  } catch (error) {
    console.error("PayU success callback error:", error);

    return NextResponse.redirect(
      `${process.env.FRONTEND_URL}/cart?payment=failed`,
    );
  }
}
