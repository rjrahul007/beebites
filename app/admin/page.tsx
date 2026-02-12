// import { Header } from "@/components/header";
// import { AdminStats } from "@/components/admin-stats";
// import { AdminOrdersList } from "@/components/admin-orders-list";
// import { BottomNav } from "@/components/bottom-nav";

// import { requireAuth, requireStaff } from "@/lib/auth/require-auth";
// import { ADMIN_ROLES } from "@/lib/domain/auth";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import PageLayout from "@/components/page-layout";

// export default async function AdminPage() {
//   const { supabase, user, role } = await requireStaff(ADMIN_ROLES);
//   const { data: orders, error: ordersError } = await supabase
//     .from("orders")
//     .select(
//       `
//     id,
//     status,
//     total_amount,
//     created_at,
//     user_id,
//     delivery_address,
//     payment_method,
//     phone,
//     payment_status,
//     delivery_assignments (
//       id,
//       delivery_id,
//       cancelled,
//       delivery_users:delivery_id (
//         id,
//         full_name
//       )
//     )
//   `,
//     )
//     .order("created_at", { ascending: false });

//   if (ordersError) {
//     console.error("Error fetching orders for admin:", ordersError);
//     throw new Error("Failed to fetch orders");
//   }

//   /* ---------------- NORMALIZE ---------------- */

//   // Calculate stats (server-normalized `status` is lowercase)
//   const totalOrders = orders.length || 0;
//   const pendingOrders =
//     orders.filter((o) => o.status === "pending" || o.status === "confirmed")
//       .length || 0;
//   const activeOrders =
//     orders.filter(
//       (o) => o.status === "preparing" || o.status === "out_for_delivery",
//     ).length || 0;
//   const totalRevenue =
//     orders.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;

//   // Fetch Customers
//   const userIds = Array.from(
//     new Set(orders.map((o) => o.user_id).filter(Boolean)),
//   );
//   let profilesMap: Record<string, any> = {};
//   if (userIds.length) {
//     const { data: profiles } = await supabase
//       .from("profiles")
//       .select("id,full_name")
//       .in("id", userIds);
//     (profiles || []).forEach((p: any) => (profilesMap[p.id] = p));
//   }

//   const ordersWithCustomer = orders.map((o: any) => ({
//     ...o,
//     customer_full_name: profilesMap[o.user_id]?.full_name || undefined,
//   }));

//   return (
//     <PageLayout>
//       <div className="flex justify-between items-center">
//         <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
//         <Button asChild>
//           <Link href="/admin/menu" className="block mb-6">
//             Edit Menu
//           </Link>
//         </Button>
//       </div>
//       <AdminStats
//         totalOrders={totalOrders}
//         pendingOrders={pendingOrders}
//         activeOrders={activeOrders}
//         totalRevenue={totalRevenue}
//       />
//       <div className="mt-8">
//         <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
//         <AdminOrdersList orders={ordersWithCustomer} role={role} />
//       </div>
//     </PageLayout>
//   );
// }

import { AdminStats } from "@/components/admin-stats";
import { AdminOrdersList } from "@/components/admin-orders-list";
import { requireStaff } from "@/lib/auth/require-auth";
import { ADMIN_ROLES } from "@/lib/domain/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/page-layout";

export default async function AdminPage() {
  const { supabase, user, role } = await requireStaff(ADMIN_ROLES);

  /* ---------------- ORDERS (for the list) ---------------- */
  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select(
      `
      id,
      status,
      total_amount,
      created_at,
      user_id,
      delivery_address,
      payment_method,
      phone,
      payment_status,
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
    .order("created_at", { ascending: false });

  if (ordersError) {
    console.error("Error fetching orders for admin:", ordersError);
    throw new Error("Failed to fetch orders");
  }

  /* ---------------- STATS (from view) ---------------- */
  const { data: summary } = await supabase
    .from("order_financial_summary")
    .select("*")
    .single();

  const totalOrders = Number(summary?.total_orders ?? 0);
  const pendingOrders = Number(summary?.pending_count ?? 0);
  const activeOrders = Number(summary?.active_count ?? 0);
  const completedOrders = Number(summary?.completed_count ?? 0);
  const cancelledOrders = Number(summary?.cancelled_count ?? 0);
  const paymentFailedOrders = Number(summary?.payment_failed_count ?? 0);
  const totalRevenue = Number(summary?.net_revenue ?? 0);
  const cancelledRevenue = Number(summary?.cancelled_revenue ?? 0);
  const paymentFailedRevenue = Number(summary?.payment_failed_revenue ?? 0);

  /* ---------------- CUSTOMERS ---------------- */
  const userIds = Array.from(
    new Set(orders.map((o) => o.user_id).filter(Boolean)),
  );
  let profilesMap: Record<string, any> = {};
  if (userIds.length) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id,full_name")
      .in("id", userIds);
    (profiles || []).forEach((p: any) => (profilesMap[p.id] = p));
  }

  const ordersWithCustomer = orders.map((o: any) => ({
    ...o,
    customer_full_name: profilesMap[o.user_id]?.full_name || undefined,
  }));

  return (
    <PageLayout>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        <Button asChild>
          <Link href="/admin/menu" className="block mb-6">
            Edit Menu
          </Link>
        </Button>
      </div>
      <AdminStats
        totalOrders={totalOrders}
        pendingOrders={pendingOrders}
        activeOrders={activeOrders}
        completedOrders={completedOrders}
        cancelledOrders={cancelledOrders}
        paymentFailedOrders={paymentFailedOrders}
        totalRevenue={totalRevenue}
        cancelledRevenue={cancelledRevenue}
        paymentFailedRevenue={paymentFailedRevenue}
      />
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
        <AdminOrdersList orders={ordersWithCustomer} role={role} />
      </div>
    </PageLayout>
  );
}
