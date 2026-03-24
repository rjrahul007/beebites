"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/page-layout";
import { DeliveryOrdersList } from "@/components/delivery-orders-list";
import { RefreshCw, Package, CheckCircle2, AlertCircle } from "lucide-react";
import {
  isActionableStatus,
  ORDER_STATUS,
  type OrderStatus,
} from "@/lib/domain/order";
import { toast } from "sonner";

interface Order {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
  delivery_address: string;
  phone: string;
  customer_full_name?: string;
  delivery_failure_reason: string | null;
}

export default function DeliveryDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pending: 0,
    delivered: 0,
    failed: 0,
  });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/delivery/orders");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch orders");
      }

      const allOrders = data.orders || [];
      setOrders(allOrders);

      // Calculate stats
      const pending = allOrders.filter((o: Order) =>
        isActionableStatus(o.status as OrderStatus),
      ).length;
      const delivered = allOrders.filter(
        (o: Order) => o.status === ORDER_STATUS.DELIVERED,
      ).length;
      const failed = allOrders.filter(
        (o: Order) => o.status === ORDER_STATUS.DELIVERY_FAILED,
      ).length;

      setStats({ pending, delivered, failed });
    } catch (err) {
      console.error("Failed to fetch delivery orders:", err);
      toast.error(err instanceof Error ? err.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Delivery Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage your assigned deliveries
            </p>
          </div>
          <Button
            onClick={fetchOrders}
            disabled={loading}
            className="gap-2"
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Pending */}
          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Package className="h-4 w-4 text-yellow-500" />
                Pending Delivery
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.pending}</p>
            </CardContent>
          </Card>

          {/* Delivered */}
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Delivered
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">
                {stats.delivered}
              </p>
            </CardContent>
          </Card>

          {/* Failed */}
          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <AlertCircle className="h-4 w-4 text-red-500" />
                Failed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-600">{stats.failed}</p>
            </CardContent>
          </Card>
        </div>

        {/* Orders List */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Your Assigned Orders</h2>
          {loading ? (
            <Card>
              <CardContent className="pt-8 pb-8">
                <div className="text-center">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground">Loading orders...</p>
                </div>
              </CardContent>
            </Card>
          ) : orders.length === 0 ? (
            <Card>
              <CardContent className="pt-8 pb-8">
                <div className="text-center">
                  <Package className="h-12 w-12 mx-auto mb-2 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">
                    No assigned deliveries at the moment
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <DeliveryOrdersList orders={orders} onOrderUpdated={fetchOrders} />
          )}
        </div>
      </div>
    </PageLayout>
  );
}
