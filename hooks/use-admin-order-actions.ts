// "use client";

// import { useRouter } from "next/navigation";
// import { toast } from "sonner";
// import { useState } from "react";

// export function useAdminOrderActions() {
//   const router = useRouter();
//   const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());

//   const markLoading = (id: string) => setLoadingIds((p) => new Set(p).add(id));

//   const unmarkLoading = (id: string) =>
//     setLoadingIds((p) => {
//       const n = new Set(p);
//       n.delete(id);
//       return n;
//     });

//   async function updateStatus(orderId: string, status: string) {
//     markLoading(orderId);

//     try {
//       const res = await fetch("/api/admin/orders/update", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ orderId, status }),
//       });

//       const json = await res.json();

//       if (!res.ok) throw new Error(json?.error || "Update failed");

//       toast.success("Order updated");
//       router.refresh();
//       return json;
//     } catch (e: any) {
//       console.error("Status update error:", e);
//       toast.error(e instanceof Error ? e.message : "Update failed");
//       throw e;
//     } finally {
//       unmarkLoading(orderId);
//     }
//   }

//   async function assignDelivery(orderId: string, deliveryId: string) {
//     markLoading(orderId);

//     try {
//       const res = await fetch("/api/admin/orders/assign", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ orderId, deliveryId }),
//       });

//       const json = await res.json();

//       if (!res.ok) throw new Error(json?.error || "Assignment failed");

//       toast.success("Delivery assigned");
//       router.refresh();
//     } catch (e: any) {
//       toast.error(e.message || "Assignment failed");
//       throw e;
//     } finally {
//       unmarkLoading(orderId);
//     }
//   }

//   return {
//     updateStatus,
//     assignDelivery,
//     loadingIds,
//   };
// }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ORDER_STATUS } from "@/lib/domain/order";

export function useAdminOrderActions() {
  const router = useRouter();
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());

  const setLoading = (orderId: string, loading: boolean) => {
    setLoadingIds((prev) => {
      const next = new Set(prev);
      if (loading) next.add(orderId);
      else next.delete(orderId);
      return next;
    });
  };

  /* -------------------- UPDATE STATUS -------------------- */
  const updateStatus = async (orderId: string, status: string) => {
    setLoading(orderId, true);
    // if (status === ORDER_STATUS.CANCELLED) {
    //   toast.error("Use cancel optiont with reason for better tracking");
    //   setLoading(orderId, false);
    //   return;
    // }
    try {
      const res = await fetch("/api/admin/orders/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.error || "Failed to update order");
      }

      toast.success("Order status updated ✅");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setLoading(orderId, false);
    }
  };

  /* -------------------- ASSIGN DELIVERY -------------------- */
  const assignDelivery = async (orderId: string, deliveryId: string) => {
    setLoading(orderId, true);

    try {
      const res = await fetch("/api/admin/orders/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, deliveryId }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.error || "Assignment failed");
      }

      toast.success("Delivery assigned ✅");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Assignment failed");
    } finally {
      setLoading(orderId, false);
    }
  };

  /* -------------------- CANCEL ORDER -------------------- */
  const cancelOrder = async (orderId: string, reason: string) => {
    setLoading(orderId, true);

    try {
      const res = await fetch("/api/admin/orders/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          status: ORDER_STATUS.CANCELLED,
          cancelReason: reason,
        }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.error || "Cancel failed");
      }

      toast.success("Order cancelled ✅");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Cancel failed");
    } finally {
      setLoading(orderId, false);
    }
  };

  return {
    updateStatus,
    assignDelivery,
    cancelOrder,
    loadingIds,
  };
}
