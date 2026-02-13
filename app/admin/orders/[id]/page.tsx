import { redirect, notFound } from "next/navigation";
import { AdminOrderDetails } from "@/components/admin-order-details";

import { requireStaff } from "@/lib/auth/require-auth";
import { ADMIN_ROLES } from "@/lib/domain/auth";
import PageLayout from "@/components/page-layout";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: { id: string } | Promise<{ id: string }>;
}) {
  const { supabase, role } = await requireStaff(ADMIN_ROLES);

  const { id } = (await params) as { id: string };

  // const { data: order } = await supabase
  //   .from("orders")
  //   .select("*")
  //   .eq("id", id)
  //   .single();
  const { data: order } = await supabase
    .from("orders")
    .select(
      `
    id,
    status,
    payment_status,
    total_amount,
    created_at,
    user_id,
    delivery_address,
    delivery_city,
    delivery_pincode,
    phone,
    payment_method,
    estimated_delivery_time,
    delivery_failure_reason,
    special_instructions,
    delivery_failure_reason,
    delivery_assignments (
      id,
      delivery_id,
      cancelled,
      delivery_users:delivery_id (
        id,
        full_name
      )
    )
  `,
    )
    .eq("id", id)
    .single();

  if (!order) {
    notFound();
  }
  // Normalize status server-side for consistency

  // const normalizedOrder = normalizeOrder(order);
  /* ---------- PARALLEL FETCH ---------- */
  const [{ data: orderItems }, { data: customer }] = await Promise.all([
    supabase.from("order_items").select("*").eq("order_id", id),
    supabase.from("profiles").select("*").eq("id", order.user_id).single(),
  ]);

  return (
    <PageLayout>
      <AdminOrderDetails
        order={order}
        items={orderItems || []}
        customer={customer}
        role={role}
      />
    </PageLayout>
  );
}
