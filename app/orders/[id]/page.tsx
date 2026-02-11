import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import OrderDetailsPoller from "@/components/order-details-poller";
import PageLayout from "@/components/page-layout";

export default async function OrderDetailPage({
  params,
}: {
  params: { id: string } | Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { id } = (await params) as { id: string };

  // if (!user) {
  //   redirect("/auth/login?next=/orders/" + id);
  // }
  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .eq("user_id", user?.id)
    .single();

  if (!order) {
    notFound();
  }
  // Normalize status server-side for consistency
  // if (order && order.status) order.status = String(order.status).toLowerCase();

  const { data: orderItems } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", id);

  return (
    <PageLayout>
      <OrderDetailsPoller
        orderId={id}
        initialOrder={order}
        initialItems={orderItems || []}
      />
    </PageLayout>
  );
}
