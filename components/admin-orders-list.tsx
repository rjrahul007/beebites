// "use client";

// import { useEffect, useState } from "react";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Eye, RefreshCw } from "lucide-react";
// import Link from "next/link";
// import { formatDistanceToNow } from "date-fns";
// import { useRouter } from "next/navigation";
// import { type AdminRole } from "@/lib/domain/auth";
// import {
//   ORDER_STATUS_LABEL,
//   ORDER_STATUS_BADGE_CLASS,
//   type OrderStatus,
//   getAllowedOrderStatusTransitions,
//   ORDER_STATUS,
// } from "@/lib/domain/order";
// import { toast } from "sonner";

// interface Order {
//   id: string;
//   user_id: string;
//   customer_full_name?: string;
//   status: OrderStatus;
//   total_amount: number;
//   delivery_address: string;
//   delivery_city: string;
//   phone: string;
//   payment_method: string;
//   created_at: string;
// }

// interface AdminOrdersListProps {
//   orders: Order[];
//   role: AdminRole;
// }

// export function AdminOrdersList({ orders, role }: AdminOrdersListProps) {
//   const [updatingOrders, setUpdatingOrders] = useState<Set<string>>(new Set());
//   const [assigningOrders, setAssigningOrders] = useState<Set<string>>(
//     new Set(),
//   );
//   const [deliveryUsers, setDeliveryUsers] = useState<
//     Array<{ id: string; full_name: string }>
//   >([]);

//   const router = useRouter();

//   useEffect(() => {
//     let mounted = true;

//     (async () => {
//       try {
//         const res = await fetch("/api/admin/delivery/list");
//         if (!res.ok) return;
//         const json = await res.json();
//         if (mounted) setDeliveryUsers(json.delivery || []);
//       } catch (err) {
//         console.error("failed to load delivery users", err);
//       }
//     })();

//     return () => {
//       mounted = false;
//     };
//   }, []);

//   const handleStatusUpdate = async (orderId: string, newStatus: string) => {
//     setUpdatingOrders((prev) => new Set(prev).add(orderId));

//     try {
//       const response = await fetch("/api/admin/orders/update", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ orderId, status: newStatus }),
//       });

//       if (!response.ok) {
//         const json = await response.json().catch(() => null);
//         throw new Error(json?.error || "Failed to update order status");
//       }

//       toast.success("Order status updated ✅");
//       router.refresh();
//     } catch (error) {
//       console.error("Status update error:", error);
//       toast.error(error instanceof Error ? error.message : "Update failed");
//     } finally {
//       setUpdatingOrders((prev) => {
//         const next = new Set(prev);
//         next.delete(orderId);
//         return next;
//       });
//     }
//   };

//   const handleAssign = async (orderId: string, deliveryId: string) => {
//     setAssigningOrders((prev) => new Set(prev).add(orderId));

//     try {
//       const res = await fetch("/api/admin/orders/assign", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ orderId, deliveryId }),
//       });

//       if (!res.ok) {
//         const json = await res.json().catch(() => null);
//         throw new Error(json?.error || "Assignment failed");
//       }

//       toast.success("Delivery assigned ✅");
//       router.refresh();
//     } catch (err) {
//       console.error("assign error", err);
//       toast.error(err instanceof Error ? err.message : "Failed to assign");
//     } finally {
//       setAssigningOrders((prev) => {
//         const next = new Set(prev);
//         next.delete(orderId);
//         return next;
//       });
//     }
//   };

//   if (orders.length === 0) {
//     return (
//       <div className="text-center py-8 text-muted-foreground">
//         <p>No orders yet</p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4">
//       {orders.map((order) => {
//         const status = String(order.status).toUpperCase() as OrderStatus;

//         const allowedStatuses = getAllowedOrderStatusTransitions(role, status);
//         const canUpdate = role === "ADMIN" || allowedStatuses.length > 0;

//         const statusOptions =
//           role === "ADMIN"
//             ? allowedStatuses
//             : [status, ...allowedStatuses.filter((s) => s !== status)];

//         const assignments = Array.isArray(order.delivery_assignments)
//           ? order.delivery_assignments
//           : order.delivery_assignments
//             ? [order.delivery_assignments]
//             : [];

//         const activeAssignment = assignments.find((a: any) => !a.cancelled);

//         const assignedDeliveryId = activeAssignment?.delivery_id || "";
//         const assignedDeliveryName =
//           activeAssignment?.delivery_users?.full_name;

//         return (
//           <Card key={order.id}>
//             <CardHeader className="pb-3">
//               <div className="flex items-start justify-between">
//                 <div className="space-y-1">
//                   <div className="flex items-center gap-2">
//                     <h3 className="font-semibold">
//                       Order #{order.id.slice(0, 8)}
//                     </h3>

//                     <Badge
//                       className={
//                         ORDER_STATUS_BADGE_CLASS[status] ??
//                         "bg-muted text-muted-foreground border-border"
//                       }
//                       variant="outline"
//                     >
//                       {ORDER_STATUS_LABEL[status] ?? status}
//                     </Badge>
//                   </div>

//                   <p className="text-sm text-muted-foreground">
//                     {formatDistanceToNow(new Date(order.created_at), {
//                       addSuffix: true,
//                     })}
//                   </p>
//                 </div>

//                 <p className="text-xl font-bold text-primary">
//                   ₹{Number(order.total_amount).toFixed(2)}
//                 </p>
//               </div>
//             </CardHeader>

//             <CardContent>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
//                 <div>
//                   <p className="text-sm text-muted-foreground">Delivery to</p>
//                   <p className="font-medium">{order.delivery_address}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-muted-foreground">Phone</p>
//                   <p className="font-medium">{order.phone}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-muted-foreground">Payment</p>
//                   <p className="font-medium capitalize">
//                     {order.payment_method}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-muted-foreground">Customer Name</p>
//                   <p className="font-medium text-xs">
//                     {order.customer_full_name || "—"}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-muted-foreground">User ID</p>
//                   <p className="font-medium text-xs">
//                     {order.user_id.slice(0, 8)}
//                   </p>
//                 </div>
//                 {assignedDeliveryName && (
//                   <div>
//                     <p className="text-sm text-muted-foreground mt-1">
//                       Assigned to:
//                     </p>
//                     <p className="font-medium text-xs">
//                       {assignedDeliveryName}
//                     </p>
//                   </div>
//                 )}
//               </div>

//               <div className="flex flex-wrap items-center gap-2 pt-4 border-t">
//                 {/* Status Update */}
//                 <Select
//                   value={status}
//                   onValueChange={(value) => handleStatusUpdate(order.id, value)}
//                   disabled={updatingOrders.has(order.id) || !canUpdate}
//                 >
//                   <SelectTrigger className="w-[200px]">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {statusOptions.map((s) => (
//                       <SelectItem key={s} value={s}>
//                         {ORDER_STATUS_LABEL[s] ?? s}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>

//                 {updatingOrders.has(order.id) && (
//                   <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
//                 )}

//                 {/* Assign Delivery (only useful when OUT_FOR_DELIVERY etc) */}
//                 {status === ORDER_STATUS.OUT_FOR_DELIVERY && (
//                   <Select
//                     value={assignedDeliveryId}
//                     onValueChange={(deliveryId) => {
//                       if (deliveryId) handleAssign(order.id, deliveryId);
//                     }}
//                     disabled={assigningOrders.has(order.id)}
//                   >
//                     <SelectTrigger className="w-[200px]">
//                       <SelectValue
//                         placeholder={
//                           deliveryUsers.length
//                             ? "Assign delivery..."
//                             : "No delivery users"
//                         }
//                       />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {deliveryUsers.map((d) => (
//                         <SelectItem key={d.id} value={d.id}>
//                           {d.full_name}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 )}

//                 <Button
//                   variant="outline"
//                   size="sm"
//                   asChild
//                   className="ml-auto bg-transparent"
//                 >
//                   <Link href={`/admin/orders/${order.id}`}>
//                     <Eye className="h-4 w-4 mr-2" />
//                     View Details
//                   </Link>
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         );
//       })}
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, RefreshCw } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { type AdminRole } from "@/lib/domain/auth";
import {
  ORDER_STATUS_LABEL,
  ORDER_STATUS_BADGE_CLASS,
  type OrderStatus,
  getAllowedOrderStatusTransitions,
  ORDER_STATUS,
} from "@/lib/domain/order";

import { useAdminOrderActions } from "@/hooks/use-admin-order-actions";
import { TERMINAL_ORDER_STATUSES } from "@/lib/domain/order";

interface Order {
  id: string;
  user_id: string;
  customer_full_name?: string;
  status: OrderStatus;
  total_amount: number;
  delivery_address: string;
  delivery_city: string;
  phone: string;
  payment_method: string;
  created_at: string;
}

interface AdminOrdersListProps {
  orders: Order[];
  role: AdminRole;
}

export function AdminOrdersList({ orders, role }: AdminOrdersListProps) {
  const { updateStatus, assignDelivery, loadingIds } = useAdminOrderActions();

  const [deliveryUsers, setDeliveryUsers] = useState<
    Array<{ id: string; full_name: string }>
  >([]);

  /* ---------------- Load delivery users ---------------- */
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const res = await fetch("/api/admin/delivery/list");
        if (!res.ok) return;
        const json = await res.json();
        if (mounted) setDeliveryUsers(json.delivery || []);
      } catch (err) {
        console.error("failed to load delivery users", err);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  if (orders.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No orders yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const status = order.status;

        const isTerminal = TERMINAL_ORDER_STATUSES.includes(status);

        const allowedStatuses = getAllowedOrderStatusTransitions(role, status);
        const canUpdate = role === "ADMIN" || allowedStatuses.length > 0;

        const statusOptions =
          role === "ADMIN"
            ? allowedStatuses
            : [status, ...allowedStatuses.filter((s) => s !== status)];

        const assignments = Array.isArray(order.delivery_assignments)
          ? order.delivery_assignments
          : order.delivery_assignments
            ? [order.delivery_assignments]
            : [];

        const activeAssignment = assignments.find((a: any) => !a.cancelled);
        const assignedDeliveryName =
          activeAssignment?.delivery_users?.full_name;

        return (
          <Card key={order.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">
                      Order #{order.id.slice(0, 8)}
                    </h3>

                    <Badge
                      className={
                        ORDER_STATUS_BADGE_CLASS[status] ??
                        "bg-muted text-muted-foreground border-border"
                      }
                      variant="outline"
                    >
                      {ORDER_STATUS_LABEL[status] ?? status}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(order.created_at), {
                      addSuffix: true,
                    })}
                  </p>
                </div>

                <p className="text-xl font-bold text-primary">
                  ₹{Number(order.total_amount).toFixed(2)}
                </p>
              </div>
            </CardHeader>

            <CardContent>
              {/* ---------------- Meta ---------------- */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Delivery to</p>
                  <p className="font-medium">{order.delivery_address}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{order.phone}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Payment</p>
                  <p className="font-medium capitalize">
                    {order.payment_method}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Customer Name</p>
                  <p className="font-medium text-xs">
                    {order.customer_full_name || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">User ID</p>
                  <p className="font-medium text-xs">
                    {order.user_id.slice(0, 8)}
                  </p>
                </div>
                {assignedDeliveryName && (
                  <div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Assigned to:
                    </p>
                    <p className="font-medium text-xs">
                      {assignedDeliveryName}
                    </p>
                  </div>
                )}
              </div>

              {/* ---------------- Actions Row ---------------- */}
              <div className="flex flex-wrap items-center gap-2 pt-4 border-t">
                {/* Status Update */}
                <Select
                  value={status}
                  onValueChange={(value) => updateStatus(order.id, value)}
                  disabled={
                    isTerminal || loadingIds.has(order.id) || !canUpdate
                  }
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    {statusOptions.map((s) => (
                      <SelectItem key={s} value={s}>
                        {ORDER_STATUS_LABEL[s] ?? s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {loadingIds.has(order.id) && (
                  <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
                )}

                {/* Assign Delivery */}
                {!isTerminal && status === ORDER_STATUS.OUT_FOR_DELIVERY && (
                  <Select
                    value={order.delivery_assignments?.delivery_id || ""}
                    onValueChange={(deliveryId) => {
                      if (deliveryId) assignDelivery(order.id, deliveryId);
                    }}
                    disabled={loadingIds.has(order.id)}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue
                        placeholder={
                          deliveryUsers.length
                            ? "Assign delivery..."
                            : "No delivery users"
                        }
                      />
                    </SelectTrigger>

                    <SelectContent>
                      {deliveryUsers.map((d) => (
                        <SelectItem key={d.id} value={d.id}>
                          {d.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {/* View */}
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="ml-auto bg-transparent"
                >
                  <Link href={`/admin/orders/${order.id}`}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
