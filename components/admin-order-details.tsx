"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Clock,
  MapPin,
  CreditCard,
  Phone,
  User,
  RefreshCw,
  ArrowLeft,
  Truck,
  Info,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { type AdminRole } from "@/lib/domain/auth";
import {
  ORDER_STATUS_LABEL,
  ORDER_STATUS_BADGE_CLASS,
  type OrderStatus,
  getAllowedOrderStatusTransitions,
  ORDER_STATUS,
  TERMINAL_ORDER_STATUSES,
} from "@/lib/domain/order";
import { useAdminOrderActions } from "@/hooks/use-admin-order-actions";

export interface DeliveryUser {
  id: string;
  full_name: string;
}

export interface DeliveryAssignment {
  id: string;
  delivery_id: string;
  cancelled: boolean;
  delivery_users: DeliveryUser[] | null;
}

interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  total_amount: number;
  delivery_address: string;
  delivery_city: string;
  delivery_pincode: string;
  phone: string;
  payment_method: string;
  payment_status: string;
  special_instructions: string | null;
  created_at: string;
  delivery_assignments: DeliveryAssignment[] | null;
  delivery_failure_reason: string | null;
  estimated_delivery_time: string;
}

interface OrderItem {
  id: string;
  item_name: string;
  quantity: number;
  price: number;
}

interface Customer {
  id: string;
  full_name: string;
  phone: string | null;
}

interface AdminOrderDetailsProps {
  order: Order;
  items: OrderItem[];
  customer: Customer | null;
  role: AdminRole;
}

export function AdminOrderDetails({
  order,
  items,
  customer,
  role,
}: AdminOrderDetailsProps) {
  const [status, setStatus] = useState(order.status);
  const allowedStatuses = getAllowedOrderStatusTransitions(role, status);
  const { updateStatus, assignDelivery, loadingIds, cancelOrder } =
    useAdminOrderActions();
  const isTerminal = TERMINAL_ORDER_STATUSES.includes(status);
  const canUpdate =
    !isTerminal && (role === "ADMIN" || allowedStatuses.length > 0);
  const [deliveryUsers, setDeliveryUsers] = useState<
    Array<{ id: string; full_name: string }>
  >([]);
  const router = useRouter();
  useEffect(() => {
    let mounted = true;
    (async function loadDeliveryUsers() {
      try {
        const res = await fetch("/api/admin/delivery/list");
        if (!res.ok) return;
        const json = await res.json();
        if (mounted) setDeliveryUsers(json.delivery || []);
      } catch (err) {
        console.error("[v0] failed to load delivery users", err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleCancelWithReason = async () => {
    const reason = window.prompt("Enter cancellation reason:");
    if (!reason) return;

    await cancelOrder(order.id, reason);
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const deliveryFee = 49;
  const tax = subtotal * 0.05;
  const assignments = Array.isArray(order.delivery_assignments)
    ? order.delivery_assignments
    : order.delivery_assignments
      ? [order.delivery_assignments]
      : [];

  const activeAssignment = assignments.find((a: any) => !a.cancelled);

  const assignedDeliveryId = activeAssignment?.delivery_id || "";
  const assignedDeliveryName = activeAssignment?.delivery_users?.full_name;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          asChild
          className="bg-transparent"
        >
          <Link href="/admin">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Order #{order.id.slice(0, 8)}</h1>
          <p className="text-muted-foreground">
            Placed on {format(new Date(order.created_at), "PPpp")}
          </p>
        </div>

        <Badge className={ORDER_STATUS_BADGE_CLASS[status]} variant="outline">
          {ORDER_STATUS_LABEL[status]}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Update Order Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Select
              value={status}
              onValueChange={(value) => {
                setStatus(value as OrderStatus);
                updateStatus(order.id, value);
              }}
              disabled={!canUpdate || loadingIds.has(order.id)}
            >
              <SelectTrigger className="w-50">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {(role === "ADMIN"
                  ? allowedStatuses
                  : [status, ...allowedStatuses.filter((s) => s !== status)]
                ).map((s) => (
                  <SelectItem key={s} value={s}>
                    {ORDER_STATUS_LABEL[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {loadingIds.has(order.id) && (
              <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>
        </CardContent>
      </Card>

      {/* assign delivery */}
      {!isTerminal && (
        <Card>
          <CardHeader>
            <CardTitle>Assign Delivery</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Select
                value={assignedDeliveryId}
                onValueChange={(value) => {
                  if (value) assignDelivery(order.id, value);
                }}
                disabled={loadingIds.has(order.id)}
              >
                <SelectTrigger className="w-50">
                  <SelectValue
                    placeholder={
                      deliveryUsers.length
                        ? "Assign to..."
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
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.refresh()}
              >
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* actions */}
      {!isTerminal && (
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <Button
                variant="destructive"
                onClick={handleCancelWithReason}
                disabled={!canUpdate || loadingIds.has(order.id)}
              >
                Cancel Order (require reason)
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">{item.item_name}</p>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Customer Name</p>
                  <p className="text-sm text-muted-foreground">
                    {customer?.full_name || "N/A"}
                  </p>
                </div>
              </div>
              <Separator />
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">{order.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Delivery Address</p>
                  <p className="text-sm text-muted-foreground">
                    {order.delivery_address}
                    <br />
                    {order.delivery_city}, {order.delivery_pincode}
                  </p>
                </div>
              </div>
              <Separator />
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Estimated Delivery</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(order.estimated_delivery_time), "p")}
                  </p>
                </div>
              </div>
              {assignedDeliveryName && (
                <>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <Truck className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Assigned to:
                      </p>
                      <p className="font-medium text-xs">
                        {assignedDeliveryName}
                      </p>
                    </div>
                  </div>
                </>
              )}
              {order.special_instructions && (
                <>
                  <Separator />
                  <div>
                    <p className="font-medium">Special Instructions</p>
                    <p className="text-sm text-muted-foreground">
                      {order.special_instructions}
                    </p>
                  </div>
                </>
              )}
              {order.delivery_failure_reason && (
                <>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-red-400" />
                    <div>
                      <p className="font-medium ">
                        {order.status === ORDER_STATUS.DELIVERY_FAILED
                          ? "Delivery Failure Reason"
                          : "Cancellation Reason"}
                      </p>
                      <p className="text-sm text-red-400">
                        {order.delivery_failure_reason}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span>₹{deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax (5%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary">
                  ₹{Number(order.total_amount).toFixed(2)}
                </span>
              </div>
              <Separator />
              <div className="flex items-center gap-2 text-sm">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="capitalize">{order.payment_method}</span>
                <Badge
                  variant="outline"
                  className={
                    order.payment_status === "paid"
                      ? "bg-green-500/10 text-green-500 border-green-500/20"
                      : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                  }
                >
                  {order.payment_status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
