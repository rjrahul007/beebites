"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";

export function useAdminOrderActions() {
  const router = useRouter();
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());

  const markLoading = (id: string) => setLoadingIds((p) => new Set(p).add(id));

  const unmarkLoading = (id: string) =>
    setLoadingIds((p) => {
      const n = new Set(p);
      n.delete(id);
      return n;
    });

  async function updateStatus(orderId: string, status: string) {
    markLoading(orderId);

    try {
      const res = await fetch("/api/admin/orders/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status }),
      });

      const json = await res.json();

      if (!res.ok) throw new Error(json?.error || "Update failed");

      toast.success("Order updated");
      router.refresh();
      return json;
    } catch (e: any) {
      console.error("Status update error:", e);
      toast.error(e instanceof Error ? e.message : "Update failed");
      throw e;
    } finally {
      unmarkLoading(orderId);
    }
  }

  async function assignDelivery(orderId: string, deliveryId: string) {
    markLoading(orderId);

    try {
      const res = await fetch("/api/admin/orders/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, deliveryId }),
      });

      const json = await res.json();

      if (!res.ok) throw new Error(json?.error || "Assignment failed");

      toast.success("Delivery assigned");
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || "Assignment failed");
      throw e;
    } finally {
      unmarkLoading(orderId);
    }
  }

  return {
    updateStatus,
    assignDelivery,
    loadingIds,
  };
}
