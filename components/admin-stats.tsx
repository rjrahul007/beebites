// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Package, Clock, Truck, DollarSign } from "lucide-react"

// interface AdminStatsProps {
//   totalOrders: number
//   pendingOrders: number
//   activeOrders: number
//   totalRevenue: number
// }

// export function AdminStats({ totalOrders, pendingOrders, activeOrders, totalRevenue }: AdminStatsProps) {
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between pb-2">
//           <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
//           <Package className="h-4 w-4 text-muted-foreground" />
//         </CardHeader>
//         <CardContent>
//           <div className="text-2xl font-bold">{totalOrders}</div>
//           <p className="text-xs text-muted-foreground">All time orders</p>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between pb-2">
//           <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
//           <Clock className="h-4 w-4 text-muted-foreground" />
//         </CardHeader>
//         <CardContent>
//           <div className="text-2xl font-bold text-yellow-500">{pendingOrders}</div>
//           <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between pb-2">
//           <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
//           <Truck className="h-4 w-4 text-muted-foreground" />
//         </CardHeader>
//         <CardContent>
//           <div className="text-2xl font-bold text-orange-500">{activeOrders}</div>
//           <p className="text-xs text-muted-foreground">Being prepared/delivered</p>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between pb-2">
//           <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
//           <DollarSign className="h-4 w-4 text-muted-foreground" />
//         </CardHeader>
//         <CardContent>
//           <div className="text-2xl font-bold text-primary">₹{totalRevenue.toFixed(2)}</div>
//           <p className="text-xs text-muted-foreground">All time revenue</p>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Package,
//   Clock,
//   Truck,
//   IndianRupee,
//   CheckCircle2,
//   XCircle,
//   AlertCircle,
// } from "lucide-react";
// import { cn } from "@/lib/utils";

// interface AdminStatsProps {
//   totalOrders: number;
//   pendingOrders: number;
//   activeOrders: number;
//   completedOrders: number;
//   cancelledOrders: number;
//   paymentFailedOrders: number;
//   totalRevenue: number;
//   cancelledRevenue: number;
//   paymentFailedRevenue: number;
// }

// interface StatCardProps {
//   title: string;
//   value: string | number;
//   subtitle: string;
//   icon: React.ReactNode;
//   valueClassName?: string;
//   subContent?: React.ReactNode;
// }

// function StatCard({
//   title,
//   value,
//   subtitle,
//   icon,
//   valueClassName,
//   subContent,
// }: StatCardProps) {
//   return (
//     <Card>
//       <CardHeader className="flex flex-row items-center justify-between pb-2">
//         <CardTitle className="text-sm font-medium">{title}</CardTitle>
//         {icon}
//       </CardHeader>
//       <CardContent>
//         <div className={cn("text-2xl font-bold", valueClassName)}>{value}</div>
//         <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
//         {subContent}
//       </CardContent>
//     </Card>
//   );
// }

// export function AdminStats({
//   totalOrders,
//   pendingOrders,
//   activeOrders,
//   completedOrders,
//   cancelledOrders,
//   paymentFailedOrders,
//   totalRevenue,
//   cancelledRevenue,
//   paymentFailedRevenue,
// }: AdminStatsProps) {
//   return (
//     <div className="space-y-4">
//       {/* Row 1: Live order pipeline */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         <StatCard
//           title="Total Orders"
//           value={totalOrders}
//           subtitle="All time"
//           icon={<Package className="h-4 w-4 text-muted-foreground" />}
//         />
//         <StatCard
//           title="Pending"
//           value={pendingOrders}
//           subtitle="Placed or confirmed, not yet preparing"
//           icon={<Clock className="h-4 w-4 text-yellow-500" />}
//           valueClassName={pendingOrders > 0 ? "text-yellow-500" : undefined}
//         />
//         <StatCard
//           title="Active"
//           value={activeOrders}
//           subtitle="Preparing or out for delivery"
//           icon={<Truck className="h-4 w-4 text-orange-500" />}
//           valueClassName={activeOrders > 0 ? "text-orange-500" : undefined}
//         />
//         <StatCard
//           title="Completed"
//           value={completedOrders}
//           subtitle="Successfully delivered"
//           icon={<CheckCircle2 className="h-4 w-4 text-green-500" />}
//           valueClassName="text-green-500"
//         />
//       </div>

//       {/* Row 2: Revenue + problem orders */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium">Net Revenue</CardTitle>
//             <IndianRupee className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-primary">
//               ₹{totalRevenue.toFixed(2)}
//             </div>
//             <p className="text-xs text-muted-foreground mt-1">
//               Paid orders only
//             </p>
//           </CardContent>
//         </Card>

//         <StatCard
//           title="Cancelled"
//           value={cancelledOrders}
//           subtitle={`${cancelledOrders} order${cancelledOrders !== 1 ? "s" : ""} cancelled`}
//           icon={<XCircle className="h-4 w-4 text-red-400" />}
//           valueClassName={cancelledOrders > 0 ? "text-red-400" : undefined}
//           subContent={
//             cancelledRevenue > 0 ? (
//               <p className="text-xs text-red-400/70 mt-1 font-medium">
//                 ₹{cancelledRevenue.toFixed(2)} lost
//               </p>
//             ) : null
//           }
//         />

//         <StatCard
//           title="Payment Failed"
//           value={paymentFailedOrders}
//           subtitle={`${paymentFailedOrders} order${paymentFailedOrders !== 1 ? "s" : ""} failed`}
//           icon={<AlertCircle className="h-4 w-4 text-rose-500" />}
//           valueClassName={paymentFailedOrders > 0 ? "text-rose-500" : undefined}
//           subContent={
//             paymentFailedRevenue > 0 ? (
//               <p className="text-xs text-rose-500/70 mt-1 font-medium">
//                 ₹{paymentFailedRevenue.toFixed(2)} lost
//               </p>
//             ) : null
//           }
//         />
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Package,
  Clock,
  Truck,
  IndianRupee,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminStatsProps {
  totalOrders: number;
  pendingOrders: number;
  activeOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  paymentFailedOrders: number;
  totalRevenue: number;
  cancelledRevenue: number;
  paymentFailedRevenue: number;
}

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  valueClassName?: string;
  subContent?: React.ReactNode;
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  valueClassName,
  subContent,
}: StatCardProps) {
  return (
    <Card className="py-0">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-muted-foreground">
            {title}
          </span>
          {icon}
        </div>
        <div className={cn("text-xl font-bold leading-none", valueClassName)}>
          {value}
        </div>
        <p className="text-xs text-muted-foreground mt-1.5">{subtitle}</p>
        {subContent}
      </CardContent>
    </Card>
  );
}

export function AdminStats({
  totalOrders,
  pendingOrders,
  activeOrders,
  completedOrders,
  cancelledOrders,
  paymentFailedOrders,
  totalRevenue,
  cancelledRevenue,
  paymentFailedRevenue,
}: AdminStatsProps) {
  const [open, setOpen] = useState(true);

  return (
    <div>
      {/* Toggle button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-3"
      >
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform duration-200",
            !open && "-rotate-90",
          )}
        />
        <span>{open ? "Hide stats" : "Show stats"}</span>
      </button>

      {/* Collapsible — max-h animates to 0 so it takes no space when hidden */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          open ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="space-y-3 pb-1">
          {/* Row 1: Order pipeline */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard
              title="Total Orders"
              value={totalOrders}
              subtitle="All time"
              icon={<Package className="h-3.5 w-3.5 text-muted-foreground" />}
            />
            <StatCard
              title="Pending"
              value={pendingOrders}
              subtitle="Placed or confirmed"
              icon={<Clock className="h-3.5 w-3.5 text-yellow-500" />}
              valueClassName={pendingOrders > 0 ? "text-yellow-500" : undefined}
            />
            <StatCard
              title="Active"
              value={activeOrders}
              subtitle="Preparing or en route"
              icon={<Truck className="h-3.5 w-3.5 text-orange-500" />}
              valueClassName={activeOrders > 0 ? "text-orange-500" : undefined}
            />
            <StatCard
              title="Completed"
              value={completedOrders}
              subtitle="Successfully delivered"
              icon={<CheckCircle2 className="h-3.5 w-3.5 text-green-500" />}
              valueClassName="text-green-500"
            />
          </div>

          {/* Row 2: Revenue + problem orders */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Card className="py-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground">
                    Net Revenue
                  </span>
                  <IndianRupee className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <div className="text-xl font-bold leading-none text-primary">
                  ₹{totalRevenue.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">
                  Paid orders only
                </p>
              </CardContent>
            </Card>

            <StatCard
              title="Cancelled"
              value={cancelledOrders}
              subtitle={`${cancelledOrders} order${cancelledOrders !== 1 ? "s" : ""} cancelled`}
              icon={<XCircle className="h-3.5 w-3.5 text-red-400" />}
              valueClassName={cancelledOrders > 0 ? "text-red-400" : undefined}
              subContent={
                cancelledRevenue > 0 ? (
                  <p className="text-xs text-red-400/60 mt-1 font-medium">
                    ₹{cancelledRevenue.toFixed(2)} lost
                  </p>
                ) : null
              }
            />

            <StatCard
              title="Payment Failed"
              value={paymentFailedOrders}
              subtitle={`${paymentFailedOrders} order${paymentFailedOrders !== 1 ? "s" : ""} failed`}
              icon={<AlertCircle className="h-3.5 w-3.5 text-rose-500" />}
              valueClassName={
                paymentFailedOrders > 0 ? "text-rose-500" : undefined
              }
              subContent={
                paymentFailedRevenue > 0 ? (
                  <p className="text-xs text-rose-500/60 mt-1 font-medium">
                    ₹{paymentFailedRevenue.toFixed(2)} lost
                  </p>
                ) : null
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
