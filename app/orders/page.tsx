import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { OrdersList } from "@/components/orders-list";
import PageLayout from "@/components/page-layout";
import { ORDER_STATUS } from "@/lib/domain/order";

export default async function OrdersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .neq("status", ORDER_STATUS.PAYMENT_FAILED)
    .order("created_at", { ascending: false });

  // Normalize `status` to lowercase server-side before passing to UI
  // const normalizedOrders = (orders || []).map((o: any) => ({
  //   ...o,
  //   status: String(o.status || "").toLowerCase(),
  // }));

  return (
    <PageLayout>
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      <OrdersList orders={orders || []} />
    </PageLayout>
  );
}
