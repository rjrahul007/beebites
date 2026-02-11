import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { PAYMENT_STATUS } from "@/lib/domain/payment";
import { ORDER_STATUS } from "@/lib/domain/order";
import { sanitizePayuPayload } from "@/lib/domain/payment";

export async function POST(req: Request) {
  try {
    const data = await req.formData();

    const txnid = data.get("txnid") as string | null;
    const mode = data.get("mode") as string | null;
    const bankcode = data.get("bankcode") as string | null;
    const unmappedstatus = data.get("unmappedstatus") as string | null;

    const errorMessage =
      (data.get("error_Message") as string) ||
      (data.get("error") as string) ||
      "Payment failed";

    if (!txnid) {
      return NextResponse.redirect(
        `${process.env.FRONTEND_URL}/cart?payment=failed`,
      );
    }

    // 🔍 Fetch existing payment
    const { data: payment } = await supabaseAdmin
      .from("payments")
      .select("status")
      .eq("txnid", txnid)
      .single();

    // 🛑 Only update if not already failed
    if (payment?.status !== PAYMENT_STATUS.FAILED) {
      await supabaseAdmin
        .from("payments")
        .update({
          status: PAYMENT_STATUS.FAILED,
          payment_mode: mode,
          bank_code: bankcode,
          error_message: errorMessage,
          unmapped_status: unmappedstatus,
          raw_payload: sanitizePayuPayload(data),
          updated_at: new Date(),
        })
        .eq("txnid", txnid);

      await supabaseAdmin
        .from("orders")
        .update({
          payment_status: PAYMENT_STATUS.FAILED,
          status: ORDER_STATUS.PAYMENT_FAILED,
          updated_at: new Date(),
        })
        .eq("id", txnid);
    }

    return NextResponse.redirect(
      `${process.env.FRONTEND_URL}/payment?status=failed&orderId=${txnid}`,
    );
  } catch (error) {
    console.error("PayU failure callback error:", error);

    return NextResponse.redirect(
      `${process.env.FRONTEND_URL}/cart?payment=failed`,
    );
  }
}
