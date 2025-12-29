import { Header } from "@/components/header";
import { AdminStats } from "@/components/admin-stats";
import { AdminOrdersList } from "@/components/admin-orders-list";
import { BottomNav } from "@/components/bottom-nav";

import { requireAuth, requireStaff } from "@/lib/auth/require-auth";
import { normalizeOrder } from "@/lib/orders/normalize-order";
import { ADMIN_ROLES } from "@/lib/domain/auth";

export default async function AdminPage() {
  const { supabase, user, role } = await requireStaff(ADMIN_ROLES);

  /* ---------- ORDERS ---------- */
  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select(
      "id, status, total_amount, created_at, user_id, delivery_address, payment_method, phone, payment_status"
    )
    .order("created_at", { ascending: false });

  if (ordersError) {
    console.error("Error fetching orders for admin:", ordersError);
    throw new Error("Failed to fetch orders");
  }

  /* ---------------- NORMALIZE ---------------- */
  const normalizedOrders = (orders ?? []).map(normalizeOrder);

  // Calculate stats (server-normalized `status` is lowercase)
  const totalOrders = normalizedOrders.length || 0;
  const pendingOrders =
    normalizedOrders.filter(
      (o) => o.status === "pending" || o.status === "confirmed"
    ).length || 0;
  const activeOrders =
    normalizedOrders.filter(
      (o) => o.status === "preparing" || o.status === "out_for_delivery"
    ).length || 0;
  const totalRevenue =
    normalizedOrders.reduce(
      (sum, order) => sum + Number(order.total_amount),
      0
    ) || 0;

  // Fetch Customers
  const userIds = Array.from(
    new Set(normalizedOrders.map((o) => o.user_id).filter(Boolean))
  );
  let profilesMap: Record<string, any> = {};
  if (userIds.length) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id,full_name")
      .in("id", userIds);
    (profiles || []).forEach((p: any) => (profilesMap[p.id] = p));
  }

  const ordersWithCustomer = normalizedOrders.map((o: any) => ({
    ...o,
    customer_full_name: profilesMap[o.user_id]?.full_name || undefined,
  }));

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        <AdminStats
          totalOrders={totalOrders}
          pendingOrders={pendingOrders}
          activeOrders={activeOrders}
          totalRevenue={totalRevenue}
        />
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
          <AdminOrdersList orders={ordersWithCustomer} role={role} />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
