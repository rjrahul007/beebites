import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { Header } from "@/components/header";
import OrderDetailsPoller from "@/components/order-details-poller";
import { BottomNav } from "@/components/bottom-nav";

export default async function OrderDetailPage({
  params,
}: {
  params: { id: string } | Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { id } = (await params) as { id: string };

  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!order) {
    notFound();
  }
  // Normalize status server-side for consistency
  if (order && order.status) order.status = String(order.status).toLowerCase();

  const { data: orderItems } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", id);

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <OrderDetailsPoller
          orderId={id}
          initialOrder={order}
          initialItems={orderItems || []}
        />
      </main>
      <BottomNav />
    </div>
  );
}
