// import { AdminStats } from "@/components/admin-stats";
// import { AdminOrdersList } from "@/components/admin-orders-list";
// import { requireStaff } from "@/lib/auth/require-auth";
// import { ADMIN_ROLES } from "@/lib/domain/auth";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import PageLayout from "@/components/page-layout";

// export default async function AdminPage() {
//   const { supabase, user, role } = await requireStaff(ADMIN_ROLES);

//   /* ---------------- ORDERS (for the list) ---------------- */
//   const { data: orders, error: ordersError } = await supabase
//     .from("orders")
//     .select(
//       `
//       id,
//       status,
//       total_amount,
//       created_at,
//       user_id,
//       delivery_address,
//       payment_method,
//       phone,
//       payment_status,
//       delivery_assignments (
//         id,
//         delivery_id,
//         cancelled,
//         delivery_users:delivery_id (
//           id,
//           full_name
//         )
//       )
//     `,
//     )
//     .order("created_at", { ascending: false });

//   if (ordersError) {
//     console.error("Error fetching orders for admin:", ordersError);
//     throw new Error("Failed to fetch orders");
//   }

//   /* ---------------- STATS (from view) ---------------- */
//   const { data: summary } = await supabase
//     .from("order_financial_summary")
//     .select("*")
//     .single();

//   const totalOrders = Number(summary?.total_orders ?? 0);
//   const pendingOrders = Number(summary?.pending_count ?? 0);
//   const activeOrders = Number(summary?.active_count ?? 0);
//   const completedOrders = Number(summary?.completed_count ?? 0);
//   const cancelledOrders = Number(summary?.cancelled_count ?? 0);
//   const paymentFailedOrders = Number(summary?.payment_failed_count ?? 0);
//   const totalRevenue = Number(summary?.net_revenue ?? 0);
//   const cancelledRevenue = Number(summary?.cancelled_revenue ?? 0);
//   const paymentFailedRevenue = Number(summary?.payment_failed_revenue ?? 0);

//   /* ---------------- CUSTOMERS ---------------- */
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
//         completedOrders={completedOrders}
//         cancelledOrders={cancelledOrders}
//         paymentFailedOrders={paymentFailedOrders}
//         totalRevenue={totalRevenue}
//         cancelledRevenue={cancelledRevenue}
//         paymentFailedRevenue={paymentFailedRevenue}
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
import { AdminFilters } from "@/components/admin-filters";
import { AdminPagination } from "@/components/admin-pagination";
import { AdminExport } from "@/components/admin-export";
import { requireStaff } from "@/lib/auth/require-auth";
import { ADMIN_ROLES } from "@/lib/domain/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/page-layout";
import { Suspense } from "react";

const PAGE_SIZE = 10;

interface PageProps {
  searchParams: Promise<{
    from?: string;
    to?: string;
    page?: string;
    q?: string;
  }>;
}

export default async function AdminPage({ searchParams }: PageProps) {
  const { supabase, role } = await requireStaff(ADMIN_ROLES);
  const params = await searchParams;

  const currentPage = Math.max(1, parseInt(params.page ?? "1", 10));
  const fromDate = params.from ?? null;
  const toDate = params.to ?? null;
  const searchQuery = params.q?.trim() ?? null;

  /* ---------------- BUILD DATE FILTER ---------------- */
  // toDate is inclusive so we extend it to end of day
  const toDateEnd = toDate ? `${toDate}T23:59:59.999Z` : null;

  /* ---------------- RESOLVE SEARCH QUERY ---------------- */
  // If query looks like a UUID / order-id prefix → filter by id.
  // Otherwise treat it as a customer name → look up matching profile ids first.
  let searchUserIds: string[] | null = null; // null = no name filter
  let searchOrderId: string | null = null;

  if (searchQuery) {
    // Strict UUID check: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
    const looksLikeId =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        searchQuery,
      );

    if (looksLikeId) {
      searchOrderId = searchQuery;
    } else {
      // Search profiles by full_name (case-insensitive)
      const { data: matchedProfiles } = await supabase
        .from("profiles")
        .select("id")
        .ilike("full_name", `%${searchQuery}%`);

      searchUserIds = (matchedProfiles ?? []).map((p: any) => p.id);
    }
  }

  /* ---------------- STATS (from view, date-filtered) ---------------- */
  // The view is a global aggregate — for date filtering we query directly
  let statsQuery = supabase
    .from("orders")
    .select("status, payment_status, total_amount", { count: "exact" });
  if (fromDate)
    statsQuery = statsQuery.gte("created_at", `${fromDate}T00:00:00.000Z`);
  if (toDateEnd) statsQuery = statsQuery.lte("created_at", toDateEnd);

  const { data: statsRows } = await statsQuery;
  const rows = statsRows ?? [];

  const totalOrders = rows.length;
  const pendingOrders = rows.filter(
    (o) => o.status === "PENDING" || o.status === "CONFIRMED",
  ).length;
  const activeOrders = rows.filter(
    (o) => o.status === "PREPARING" || o.status === "OUT_FOR_DELIVERY",
  ).length;
  const completedOrders = rows.filter((o) => o.status === "DELIVERED").length;
  const cancelledOrders = rows.filter((o) => o.status === "CANCELLED").length;
  const paymentFailedOrders = rows.filter(
    (o) => o.status === "PAYMENT_FAILED" || o.payment_status === "FAILED",
  ).length;
  const totalRevenue = rows
    .filter((o) => o.payment_status === "PAID")
    .reduce((s, o) => s + Number(o.total_amount), 0);
  const cancelledRevenue = rows
    .filter((o) => o.status === "CANCELLED")
    .reduce((s, o) => s + Number(o.total_amount), 0);
  const paymentFailedRevenue = rows
    .filter((o) => o.status === "PAYMENT_FAILED")
    .reduce((s, o) => s + Number(o.total_amount), 0);

  /* ---------------- ORDERS (paginated + date-filtered) ---------------- */
  const rangeFrom = (currentPage - 1) * PAGE_SIZE;
  const rangeTo = rangeFrom + PAGE_SIZE - 1;

  let ordersQuery = supabase
    .from("orders")
    .select(
      `
      id, status, total_amount, created_at, user_id,
      delivery_address, payment_method, phone, payment_status,
      delivery_assignments (
        id, delivery_id, cancelled,
        delivery_users:delivery_id ( id, full_name )
      )
      `,
      { count: "exact" },
    )
    .order("created_at", { ascending: false })
    .range(rangeFrom, rangeTo);

  if (fromDate)
    ordersQuery = ordersQuery.gte("created_at", `${fromDate}T00:00:00.000Z`);
  if (toDateEnd) ordersQuery = ordersQuery.lte("created_at", toDateEnd);

  // Apply search filters
  if (searchOrderId) {
    ordersQuery = ordersQuery.eq("id", searchOrderId);
  } else if (searchUserIds !== null) {
    if (searchUserIds.length === 0) {
      // Name search returned no matches — force empty result
      ordersQuery = ordersQuery.in("user_id", ["00000000-no-match"]);
    } else {
      ordersQuery = ordersQuery.in("user_id", searchUserIds);
    }
  }

  const {
    data: orders,
    error: ordersError,
    count: totalCount,
  } = await ordersQuery;

  if (ordersError) {
    console.error("Error fetching orders for admin:", ordersError);
    throw new Error("Failed to fetch orders");
  }

  const totalPages = Math.ceil((totalCount ?? 0) / PAGE_SIZE);

  /* ---------------- CUSTOMERS ---------------- */
  const userIds = Array.from(
    new Set((orders ?? []).map((o) => o.user_id).filter(Boolean)),
  );
  let profilesMap: Record<string, any> = {};
  if (userIds.length) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id,full_name")
      .in("id", userIds);
    (profiles ?? []).forEach((p: any) => (profilesMap[p.id] = p));
  }

  const ordersWithCustomer = (orders ?? []).map((o: any) => ({
    ...o,
    customer_full_name: profilesMap[o.user_id]?.full_name ?? undefined,
  }));

  /* ---------------- ALL ORDERS FOR EXPORT (no pagination) ------------ */
  // Only fetch all when a filter is active to keep exports scoped
  let exportQuery = supabase
    .from("orders")
    .select(
      "id, status, payment_status, total_amount, created_at, user_id, phone, payment_method, delivery_address",
    )
    .order("created_at", { ascending: false });
  if (fromDate)
    exportQuery = exportQuery.gte("created_at", `${fromDate}T00:00:00.000Z`);
  if (toDateEnd) exportQuery = exportQuery.lte("created_at", toDateEnd);
  if (searchOrderId) {
    exportQuery = exportQuery.eq("id", searchOrderId);
  } else if (searchUserIds !== null) {
    exportQuery =
      searchUserIds.length === 0
        ? exportQuery.in("user_id", ["00000000-no-match"])
        : exportQuery.in("user_id", searchUserIds);
  }
  const { data: exportOrders } = await exportQuery;

  const exportOrdersWithCustomer = (exportOrders ?? []).map((o: any) => ({
    ...o,
    customer_full_name: profilesMap[o.user_id]?.full_name ?? undefined,
  }));

  const stats = {
    totalOrders,
    pendingOrders,
    activeOrders,
    completedOrders,
    cancelledOrders,
    paymentFailedOrders,
    totalRevenue,
    cancelledRevenue,
    paymentFailedRevenue,
  };

  return (
    <PageLayout>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button asChild>
          <Link href="/admin/menu">Edit Menu</Link>
        </Button>
      </div>

      {/* Stats */}
      <AdminStats {...stats} />

      {/* Filters */}
      <div className="mt-8">
        <div className=" mb-4">
          <h2 className="text-xl font-semibold">Filters</h2>
          <div className="flex items-end gap-3 flex-wrap">
            <Suspense>
              <AdminFilters />
            </Suspense>
          </div>
          <div className="mt-2">
            <AdminExport
              orders={exportOrdersWithCustomer}
              stats={stats}
              dateRange={{
                from: fromDate ?? undefined,
                to: toDate ?? undefined,
              }}
            />
          </div>
        </div>
        {/* Orders section */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="text-2xl font-bold">Recent Orders</h2>
        </div>

        <AdminOrdersList orders={ordersWithCustomer} role={role} />

        <Suspense>
          <AdminPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={totalCount ?? 0}
            pageSize={PAGE_SIZE}
          />
        </Suspense>
      </div>
    </PageLayout>
  );
}
