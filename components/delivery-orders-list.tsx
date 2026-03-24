"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  Phone,
  Loader2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  ORDER_STATUS_LABEL,
  ORDER_STATUS_BADGE_CLASS,
  ORDER_STATUS,
  type OrderStatus,
  isActionableStatus,
} from "@/lib/domain/order";
import { toast } from "sonner";

interface Order {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
  delivery_address: string;
  delivery_city?: string;
  phone: string;
  customer_full_name?: string;
  delivery_failure_reason: string | null;
}

interface DeliveryOrdersListProps {
  orders: Order[];
  onOrderUpdated: () => void;
}

export function DeliveryOrdersList({
  orders,
  onOrderUpdated,
}: DeliveryOrdersListProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [action, setAction] = useState<"delivered" | "failed" | null>(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleStatusUpdate = async (
    orderId: string,
    newStatus: OrderStatus,
    failureReason?: string,
  ) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          status: newStatus,
          ...(newStatus === ORDER_STATUS.DELIVERY_FAILED && {
            deliveryFailureReason: failureReason,
          }),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update order");
      }

      toast.success(
        newStatus === ORDER_STATUS.DELIVERED
          ? "Order marked as delivered ✅"
          : "Delivery marked as failed ❌",
      );

      setSelectedOrder(null);
      setAction(null);
      setReason("");
      setShowConfirm(false);
      onOrderUpdated();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const processAction = () => {
    if (!selectedOrder) return;

    if (action === "delivered") {
      handleStatusUpdate(selectedOrder.id, ORDER_STATUS.DELIVERED);
    } else if (action === "failed") {
      if (!reason.trim()) {
        toast.error("Please provide a reason for the failed delivery");
        return;
      }
      confirmFailedDelivery();
      setShowConfirm(true);
    }
  };

  const confirmFailedDelivery = () => {
    if (!selectedOrder) return;
    handleStatusUpdate(selectedOrder.id, ORDER_STATUS.DELIVERY_FAILED, reason);
  };

  const isPending = (status: string) => {
    return isActionableStatus(status as OrderStatus);
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No assigned orders yet</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {orders.map((order) => {
          const status = order.status as OrderStatus;
          const isActive = isPending(status);

          return (
            <Card
              key={order.id}
              className={`transition-all ${isActive ? "border-blue-200 bg-blue-50/30" : ""}`}
            >
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
                      <Clock className="h-3.5 w-3.5 inline mr-1" />
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
                {/* Meta Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Delivery Address
                    </p>
                    <p className="font-medium text-sm mt-1">
                      {order.delivery_address}
                      {order.delivery_city && `, ${order.delivery_city}`}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Contact
                    </p>
                    <p className="font-medium text-sm mt-1">{order.phone}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Customer</p>
                    <p className="font-medium text-sm">
                      {order.customer_full_name || "—"}
                    </p>
                  </div>

                  {order.delivery_failure_reason && (
                    <div>
                      <p className="text-sm text-red-600 font-medium">
                        Failure Reason
                      </p>
                      <p className="font-medium text-sm text-red-600">
                        {order.delivery_failure_reason}
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-4 border-t">
                  {isActive && (
                    <>
                      <Button
                        size="sm"
                        className="gap-2 bg-green-600 hover:bg-green-700"
                        onClick={() => {
                          setSelectedOrder(order);
                          setAction("delivered");
                          setShowConfirm(true);
                        }}
                        disabled={loading}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Mark Delivered
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        className="gap-2"
                        onClick={() => {
                          setSelectedOrder(order);
                          setAction("failed");
                          setReason("");
                        }}
                        disabled={loading}
                      >
                        <AlertCircle className="h-4 w-4" />
                        Failed Delivery
                      </Button>
                    </>
                  )}

                  {loading && (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Failed Delivery Dialog */}
      <Dialog
        open={action === "failed"}
        onOpenChange={(open) => {
          if (!open) {
            setAction(null);
            setSelectedOrder(null);
            setReason("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Failed Delivery</DialogTitle>
            <DialogDescription>
              Please provide a reason for the failed delivery
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <p className="text-sm font-medium mb-2">
                Order: {selectedOrder?.id.slice(0, 8)}
              </p>
              <p className="text-sm text-muted-foreground">
                Address: {selectedOrder?.delivery_address}
              </p>
            </div>

            <Textarea
              placeholder="Reason for failed delivery (e.g., customer not available, wrong address, etc.)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-25"
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setAction(null);
                setSelectedOrder(null);
                setReason("");
              }}
              disabled={loading}
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={processAction}
              disabled={loading || !reason.trim()}
              className="gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Submit Failed Delivery
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Delivered Dialog */}
      <AlertDialog
        open={showConfirm && action === "delivered"}
        onOpenChange={setShowConfirm}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delivery</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to mark this order as delivered?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end pt-4">
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (selectedOrder) {
                  handleStatusUpdate(selectedOrder.id, ORDER_STATUS.DELIVERED);
                }
              }}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Confirm Delivery
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
