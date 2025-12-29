"use client";

import { useState } from "react";
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
import { useRouter } from "next/navigation";

interface Order {
  id: string;
  user_id: string;
  customer_full_name?: string;
  status: string;
  total_amount: number;
  delivery_address: string;
  delivery_city: string;
  phone: string;
  payment_method: string;
  created_at: string;
}
type Role = "ADMIN" | "KITCHEN" | "DELIVERY";

interface AdminOrdersListProps {
  orders: Order[];
  role: Role;
}

const statusColors = {
  pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  confirmed: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  preparing: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  out_for_delivery: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  delivered: "bg-green-500/10 text-green-500 border-green-500/20",
  delivery_failed: "bg-red-500/10 text-red-600 border-red-500/20",
  cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
};

const statusLabels = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  delivery_failed: "Delivery Failed",
  cancelled: "Cancelled",
};

function getAllowedStatuses(role: Role, current: string) {
  if (role === "ADMIN") {
    return Object.keys(statusLabels);
  }

  if (role === "KITCHEN") {
    if (current === "confirmed") return ["preparing"];
    if (current === "preparing") return ["out_for_delivery"];
  }

  if (role === "DELIVERY") {
    if (current === "out_for_delivery") {
      return ["delivered", "delivery_failed"];
    }
  }

  return [];
}

export function AdminOrdersList({ orders, role }: AdminOrdersListProps) {
  const [updatingOrders, setUpdatingOrders] = useState<Set<string>>(new Set());
  const router = useRouter();

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setUpdatingOrders((prev) => new Set(prev).add(orderId));

    try {
      const response = await fetch("/api/admin/orders/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          status: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      router.refresh();
    } catch (error) {
      console.error("[v0] Status update error:", error);
    } finally {
      setUpdatingOrders((prev) => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
  };

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
        const allowedStatuses = getAllowedStatuses(role, order.status);
        const canUpdate = role === "ADMIN" || allowedStatuses.length > 0;

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
                        statusColors[order.status as keyof typeof statusColors]
                      }
                      variant="outline"
                    >
                      {statusLabels[order.status as keyof typeof statusLabels]}
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
              </div>
              <div className="flex items-center gap-2 pt-4 border-t">
                <Select
                  value={order.status}
                  onValueChange={(value) => handleStatusUpdate(order.id, value)}
                  disabled={
                    role !== "ADMIN" &&
                    (!canUpdate || updatingOrders.has(order.id))
                  }
                >
                  <SelectTrigger className="w-45">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {allowedStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {statusLabels[status as keyof typeof statusLabels] ??
                          status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {updatingOrders.has(order.id) && (
                  <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
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
