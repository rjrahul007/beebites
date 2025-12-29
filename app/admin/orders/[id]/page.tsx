import { redirect, notFound } from "next/navigation";
import { Header } from "@/components/header";
import { AdminOrderDetails } from "@/components/admin-order-details";
import { BottomNav } from "@/components/bottom-nav";

import { requireAuth } from "@/lib/auth/require-auth";
import { normalizeOrder } from "@/lib/orders/normalize-order";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: { id: string } | Promise<{ id: string }>;
}) {
  const { supabase } = await requireAuth({
    roles: ["ADMIN", "KITCHEN", "DELIVERY"],
  });

  const { id } = (await params) as { id: string };

  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (!order) {
    notFound();
  }
  // Normalize status server-side for consistency

  const normalizedOrder = normalizeOrder(order);
  /* ---------- PARALLEL FETCH ---------- */
  const [{ data: orderItems }, { data: customer }] = await Promise.all([
    supabase.from("order_items").select("*").eq("order_id", id),
    supabase.from("profiles").select("*").eq("id", order.user_id).single(),
  ]);

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <AdminOrderDetails
          order={order}
          items={orderItems || []}
          customer={customer}
        />
      </main>
      <BottomNav />
    </div>
  );
}
