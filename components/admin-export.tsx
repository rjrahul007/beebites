"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";

interface ExportOrder {
  id: string;
  status: string;
  payment_status: string;
  total_amount: number;
  created_at: string;
  customer_full_name?: string;
  phone?: string;
  payment_method?: string;
  delivery_address?: string;
}

interface AdminExportProps {
  orders: ExportOrder[];
  stats: {
    totalOrders: number;
    pendingOrders: number;
    activeOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    paymentFailedOrders: number;
    totalRevenue: number;
    cancelledRevenue: number;
    paymentFailedRevenue: number;
  };
  dateRange?: { from?: string; to?: string };
}

export function AdminExport({ orders, stats, dateRange }: AdminExportProps) {
  function handleExport() {
    const wb = XLSX.utils.book_new();

    // ── Sheet 1: Summary stats ──────────────────────────────────────────
    const rangeLabel =
      dateRange?.from || dateRange?.to
        ? `${dateRange.from ?? "start"} → ${dateRange.to ?? "today"}`
        : "All time";

    const summaryData = [
      ["Admin Dashboard Export"],
      ["Date Range", rangeLabel],
      ["Generated At", new Date().toLocaleString()],
      [],
      ["Metric", "Value"],
      ["Total Orders", stats.totalOrders],
      ["Pending Orders", stats.pendingOrders],
      ["Active Orders", stats.activeOrders],
      ["Completed Orders", stats.completedOrders],
      ["Cancelled Orders", stats.cancelledOrders],
      ["Payment Failed Orders", stats.paymentFailedOrders],
      [],
      ["Net Revenue (₹)", stats.totalRevenue],
      ["Cancelled Revenue Lost (₹)", stats.cancelledRevenue],
      ["Payment Failed Revenue Lost (₹)", stats.paymentFailedRevenue],
    ];

    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    summarySheet["!cols"] = [{ wch: 32 }, { wch: 20 }];
    // Bold the title
    if (summarySheet["A1"])
      summarySheet["A1"].s = { font: { bold: true, sz: 14 } };
    XLSX.utils.book_append_sheet(wb, summarySheet, "Summary");

    // ── Sheet 2: Orders detail ──────────────────────────────────────────
    const ordersData = orders.map((o) => ({
      "Order ID": o.id,
      Customer: o.customer_full_name ?? "—",
      Phone: o.phone ?? "—",
      Status: o.status,
      "Payment Status": o.payment_status,
      "Payment Method": o.payment_method ?? "—",
      "Total Amount (₹)": Number(o.total_amount),
      "Delivery Address": o.delivery_address ?? "—",
      "Created At": new Date(o.created_at).toLocaleString(),
    }));

    const ordersSheet = XLSX.utils.json_to_sheet(ordersData);
    ordersSheet["!cols"] = [
      { wch: 38 }, // Order ID
      { wch: 20 }, // Customer
      { wch: 14 }, // Phone
      { wch: 16 }, // Status
      { wch: 16 }, // Payment Status
      { wch: 16 }, // Payment Method
      { wch: 18 }, // Total Amount
      { wch: 36 }, // Address
      { wch: 22 }, // Created At
    ];
    XLSX.utils.book_append_sheet(wb, ordersSheet, "Orders");

    const filename = `admin-orders${dateRange?.from ? `-${dateRange.from}` : ""}${dateRange?.to ? `-to-${dateRange.to}` : ""}.xlsx`;
    XLSX.writeFile(wb, filename);
  }

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleExport}
      className="gap-1.5 h-8"
    >
      <Download className="h-3.5 w-3.5" />
      Export Excel
    </Button>
  );
}
