import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Clock,
  MapPin,
  CreditCard,
  Phone,
  CheckCircle2,
  Package,
  Truck,
  ChefHat,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { OrderTracking } from "@/components/order-tracking";
import { OrderRating } from "@/components/order-rating";

interface Order {
  id: string;
  status: string;
  total_amount: number;
  delivery_address: string;
  delivery_city: string;
  delivery_pincode: string;
  phone: string;
  payment_method: string;
  payment_status: string;
  special_instructions: string | null;
  created_at: string;
  estimated_delivery_time: string;
}

interface OrderItem {
  id: string;
  item_name: string;
  quantity: number;
  price: number;
}

interface OrderDetailsProps {
  order: Order;
  items: OrderItem[];
}

const statusColors = {
  pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  confirmed: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  preparing: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  out_for_delivery: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  delivered: "bg-green-500/10 text-green-500 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
};

const statusLabels = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export function OrderDetails({ order, items }: OrderDetailsProps) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee = 49;
  const tax = subtotal * 0.05;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Order #{order.id.slice(0, 8)}</h1>
          <p className="text-muted-foreground">
            Placed on {format(new Date(order.created_at), "PPpp")}
          </p>
        </div>
        <Badge
          className={statusColors[order.status as keyof typeof statusColors]}
          variant="outline"
        >
          {statusLabels[order.status as keyof typeof statusLabels]}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {(order.status === "out_for_delivery" ||
            order.status === "preparing") && (
            <OrderTracking
              status={order.status}
              deliveryAddress={`${order.delivery_address}, ${order.delivery_city}, ${order.delivery_pincode}`}
            />
          )}

          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div
                  className={`flex items-center gap-4 ${
                    order.status === "pending" ||
                    order.status === "confirmed" ||
                    order.status === "preparing" ||
                    order.status === "out_for_delivery" ||
                    order.status === "delivered"
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      order.status === "pending" ||
                      order.status === "confirmed" ||
                      order.status === "preparing" ||
                      order.status === "out_for_delivery" ||
                      order.status === "delivered"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Order Confirmed</p>
                    <p className="text-sm text-muted-foreground">
                      Your order has been confirmed
                    </p>
                  </div>
                </div>

                <div
                  className={`flex items-center gap-4 ${
                    order.status === "preparing" ||
                    order.status === "out_for_delivery" ||
                    order.status === "delivered"
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      order.status === "preparing" ||
                      order.status === "out_for_delivery" ||
                      order.status === "delivered"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <ChefHat className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Preparing</p>
                    <p className="text-sm text-muted-foreground">
                      Your food is being prepared
                    </p>
                  </div>
                </div>

                <div
                  className={`flex items-center gap-4 ${
                    order.status === "out_for_delivery" ||
                    order.status === "delivered"
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      order.status === "out_for_delivery" ||
                      order.status === "delivered"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <Truck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Out for Delivery</p>
                    <p className="text-sm text-muted-foreground">
                      Your order is on the way
                    </p>
                  </div>
                </div>

                <div
                  className={`flex items-center gap-4 ${
                    order.status === "delivered"
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      order.status === "delivered"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <Package className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Delivered</p>
                    <p className="text-sm text-muted-foreground">
                      Your order has been delivered
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {order.status === "delivered" && <OrderRating orderId={order.id} />}

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
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">{order.phone}</p>
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
                  ₹{order.total_amount.toFixed(2)}
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

          <Button asChild variant="outline" className="w-full bg-transparent">
            <Link href="/orders">Back to Orders</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
