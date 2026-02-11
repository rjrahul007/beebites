// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Clock, Package, MapPin } from "lucide-react";
// import Link from "next/link";
// import { formatDistanceToNow } from "date-fns";

// interface Order {
//   id: string;
//   status: string;
//   total_amount: number;
//   delivery_address: string;
//   delivery_city: string;
//   payment_method: string;
//   payment_status: string;
//   created_at: string;
//   estimated_delivery_time: string;
// }

// interface OrdersListProps {
//   orders: Order[];
// }

// const statusColors = {
//   pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
//   confirmed: "bg-blue-500/10 text-blue-500 border-blue-500/20",
//   preparing: "bg-purple-500/10 text-purple-500 border-purple-500/20",
//   out_for_delivery: "bg-orange-500/10 text-orange-500 border-orange-500/20",
//   delivered: "bg-green-500/10 text-green-500 border-green-500/20",
//   cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
// };

// const statusLabels = {
//   pending: "Pending",
//   confirmed: "Confirmed",
//   preparing: "Preparing",
//   out_for_delivery: "Out for Delivery",
//   delivered: "Delivered",
//   cancelled: "Cancelled",
// };

// export function OrdersList({ orders }: OrdersListProps) {
//   // console.log(orders);

//   if (orders.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center py-16 space-y-4">
//         <Package className="h-24 w-24 text-muted-foreground" />
//         <h2 className="text-2xl font-semibold text-muted-foreground">
//           No orders yet
//         </h2>
//         <p className="text-muted-foreground">
//           Start ordering to see your order history here
//         </p>
//         <Button asChild className="bg-primary hover:bg-primary/90 mt-4">
//           <Link href="/">Browse Menu</Link>
//         </Button>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4">
//       {orders.map((order) => (
//         <Card
//           key={order.id}
//           className="overflow-hidden hover:shadow-lg transition-shadow"
//         >
//           <CardHeader className="pb-3">
//             <div className="flex items-start justify-between">
//               <div className="space-y-1">
//                 <CardTitle className="text-lg">
//                   Order #{order.id.slice(0, 8)}
//                 </CardTitle>
//                 <p className="text-sm text-muted-foreground">
//                   {formatDistanceToNow(new Date(order.created_at), {
//                     addSuffix: true,
//                   })}
//                 </p>
//               </div>
//               <Badge
//                 className={
//                   statusColors[order.status as keyof typeof statusColors]
//                 }
//                 variant="outline"
//               >
//                 {statusLabels[order.status as keyof typeof statusLabels]}
//               </Badge>
//             </div>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="flex items-start gap-6 text-sm">
//               <div className="flex items-center gap-2">
//                 <MapPin className="h-4 w-4 text-muted-foreground" />
//                 <div>
//                   <p className="font-medium">Delivery to</p>
//                   <p className="text-muted-foreground">{order.delivery_city}</p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Clock className="h-4 w-4 text-muted-foreground" />
//                 <div>
//                   <p className="font-medium">Estimated</p>
//                   <p className="text-muted-foreground">
//                     {new Date(order.estimated_delivery_time).toLocaleTimeString(
//                       [],
//                       {
//                         hour: "2-digit",
//                         minute: "2-digit",
//                       },
//                     )}
//                   </p>
//                 </div>
//               </div>
//             </div>
//             <div className="flex items-center justify-between pt-4 border-t">
//               <div>
//                 <p className="text-sm text-muted-foreground">Total Amount</p>
//                 <p className="text-xl font-bold text-primary">
//                   ₹{order.total_amount.toFixed(2)}
//                 </p>
//               </div>
//               <Button
//                 asChild
//                 variant="outline"
//                 className="border-primary text-primary hover:bg-primary/10 bg-transparent"
//               >
//                 <Link href={`/orders/${order.id}`}>View Details</Link>
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   );
// }
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Package, MapPin } from "lucide-react";
import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";

import {
  ORDER_STATUS,
  ORDER_STATUS_LABEL,
  ORDER_STATUS_BADGE_CLASS,
} from "@/lib/domain/order";

interface Order {
  id: string;
  status: keyof typeof ORDER_STATUS;
  total_amount: number;
  delivery_address: string;
  delivery_city: string;
  payment_method: string;
  payment_status: string;
  created_at: string;
  estimated_delivery_time: string | null;
}

interface OrdersListProps {
  orders: Order[];
}

export function OrdersList({ orders }: OrdersListProps) {
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <Package className="h-24 w-24 text-muted-foreground" />
        <h2 className="text-2xl font-semibold text-muted-foreground">
          No orders yet
        </h2>
        <p className="text-muted-foreground">
          Start ordering to see your order history here
        </p>
        <Button asChild className="bg-primary hover:bg-primary/90 mt-4">
          <Link href="/">Browse Menu</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card
          key={order.id}
          className="overflow-hidden hover:shadow-lg transition-shadow"
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg">
                  Order #{order.id.slice(0, 8)}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(order.created_at), {
                    addSuffix: true,
                  })}
                </p>
              </div>

              <Badge
                variant="outline"
                className={ORDER_STATUS_BADGE_CLASS[order.status]}
              >
                {ORDER_STATUS_LABEL[order.status]}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-start gap-6 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Delivery to</p>
                  <p className="text-muted-foreground">{order.delivery_city}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Estimated</p>
                  <p className="text-sm text-muted-foreground">
                    {order.estimated_delivery_time
                      ? format(new Date(order.estimated_delivery_time), "p")
                      : "Will be updated soon"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-xl font-bold text-primary">
                  ₹{order.total_amount.toFixed(2)}
                </p>
              </div>

              <Button
                asChild
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10 bg-transparent"
              >
                <Link href={`/orders/${order.id}`}>View Details</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
