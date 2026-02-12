import { USER_ROLE, type AdminRole, type UserRole } from "./auth";

export const ORDER_STATUS = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  PREPARING: "PREPARING",
  OUT_FOR_DELIVERY: "OUT_FOR_DELIVERY",
  DELIVERED: "DELIVERED",
  DELIVERY_FAILED: "DELIVERY_FAILED",
  CANCELLED: "CANCELLED",
  PAYMENT_FAILED: "PAYMENT_FAILED",
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PREPARING: "Preparing",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  DELIVERY_FAILED: "Delivery Failed",
  CANCELLED: "Cancelled",
  PAYMENT_FAILED: "Payment Failed",
};

// export const ORDER_STATUS_BADGE_CLASS: Record<OrderStatus, string> = {
//   PENDING: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
//   CONFIRMED: "bg-blue-500/10 text-blue-500 border-blue-500/20",
//   PREPARING: "bg-purple-500/10 text-purple-500 border-purple-500/20",
//   OUT_FOR_DELIVERY: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
//   DELIVERED: "bg-green-500/10 text-green-500 border-green-500/20",
//   DELIVERY_FAILED: "bg-red-500/10 text-red-600 border-red-500/20",
//   CANCELLED: "bg-red-500/10 text-red-500 border-red-500/20",
//   PAYMENT_FAILED: "bg-red-500/10 text-red-500 border-red-500/20",
// };
export const ORDER_STATUS_BADGE_CLASS: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",

  CONFIRMED: "bg-blue-500/10 text-blue-600 border-blue-500/20",

  PREPARING: "bg-purple-500/10 text-purple-600 border-purple-500/20",

  OUT_FOR_DELIVERY: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",

  DELIVERED: "bg-green-500/10 text-green-600 border-green-500/20",

  DELIVERY_FAILED: "bg-red-500/10 text-red-600 border-red-500/20",

  CANCELLED: "bg-gray-500/10 text-gray-600 border-gray-500/20",

  PAYMENT_FAILED: "bg-rose-500/10 text-rose-600 border-rose-500/20",
};

// ✅ ordered list for dropdown rendering
export const ORDER_STATUS_LIST: OrderStatus[] = [
  ORDER_STATUS.PENDING,
  ORDER_STATUS.CONFIRMED,
  ORDER_STATUS.PREPARING,
  ORDER_STATUS.OUT_FOR_DELIVERY,
  ORDER_STATUS.DELIVERED,
  ORDER_STATUS.DELIVERY_FAILED,
  ORDER_STATUS.CANCELLED,
  ORDER_STATUS.PAYMENT_FAILED,
];

export const TERMINAL_ORDER_STATUSES: OrderStatus[] = [
  ORDER_STATUS.DELIVERED,
  ORDER_STATUS.DELIVERY_FAILED,
  ORDER_STATUS.CANCELLED,
  ORDER_STATUS.PAYMENT_FAILED,
];
/**
 * Role-based transitions
 * - ADMIN can set anything
 * - KITCHEN moves order forward
 * - DELIVERY finalizes delivery
 */
export function getAllowedOrderStatusTransitions(
  role: UserRole,
  current: OrderStatus,
): OrderStatus[] {
  if (role === USER_ROLE.ADMIN) return ORDER_STATUS_LIST;

  if (role === USER_ROLE.KITCHEN) {
    if (current === ORDER_STATUS.CONFIRMED) return [ORDER_STATUS.PREPARING];
    if (current === ORDER_STATUS.PREPARING)
      return [ORDER_STATUS.OUT_FOR_DELIVERY];
    return [];
  }

  if (role === USER_ROLE.DELIVERY) {
    if (current === ORDER_STATUS.OUT_FOR_DELIVERY)
      return [ORDER_STATUS.DELIVERED, ORDER_STATUS.DELIVERY_FAILED];
    return [];
  }

  // CUSTOMER or unknown roles
  return [];
}
