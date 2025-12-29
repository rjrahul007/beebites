export function normalizeOrder(order: any) {
  if (!order) return order;

  return {
    ...order,
    status: String(order.status || "").toLowerCase(),
  };
}
