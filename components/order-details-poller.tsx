"use client";

import React, { useEffect, useState } from "react";
import { OrderDetails } from "./order-details";

export default function OrderDetailsPoller({
  initialOrder,
  initialItems,
  orderId,
}: {
  initialOrder: any;
  initialItems: any[];
  orderId: string;
}) {
  const [order, setOrder] = useState(initialOrder || {});
  const [items, setItems] = useState(initialItems || []);

  useEffect(() => {
    let mounted = true;
    let timer: number | undefined;

    async function fetchOnce() {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (!res.ok) return;
        const json = await res.json();
        if (!mounted) return;

        if (json.order) setOrder(json.order);
        if (json.items) setItems(json.items);
      } catch {
        // ignore
      }
    }

    fetchOnce();
    timer = window.setInterval(fetchOnce, 5000);

    return () => {
      mounted = false;
      if (timer) clearInterval(timer);
    };
  }, [orderId]);

  return <OrderDetails order={order} items={items} />;
}
