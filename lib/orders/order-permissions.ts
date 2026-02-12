// import { ORDER_STATUS, OrderStatus } from "@/lib/domain/order";
// import { AdminRole } from "@/lib/domain/auth";

// /**
//  * Which roles are allowed to set which NEXT statuses.
//  * DB still validates state transitions.
//  */
// export const ROLE_ALLOWED_STATUSES: Record<AdminRole, readonly OrderStatus[]> =
//   {
//     ADMIN: Object.values(ORDER_STATUS),

//     KITCHEN: [ORDER_STATUS.PREPARING, ORDER_STATUS.OUT_FOR_DELIVERY],

//     DELIVERY: [ORDER_STATUS.DELIVERED, ORDER_STATUS.DELIVERY_FAILED],
//   };

// export function isValidStatus(value: string): value is OrderStatus {
//   return Object.values(ORDER_STATUS).includes(value as OrderStatus);
// }

// export function canRoleSetStatus(
//   role: AdminRole,
//   status: OrderStatus
// ): boolean {
//   return ROLE_ALLOWED_STATUSES[role]?.includes(status) ?? false;
// }
import { type AdminRole } from "@/lib/domain/auth";
import {
  type OrderStatus,
  ORDER_STATUS,
  getAllowedOrderStatusTransitions,
} from "@/lib/domain/order";

export function isValidStatus(value: string): value is OrderStatus {
  return Object.values(ORDER_STATUS).includes(value as OrderStatus);
}

/**
 * Permission = "can this role set this status from the order's CURRENT status?"
 * This matches UI transitions and avoids mismatches.
 */
export function canRoleSetStatusFromCurrent(
  role: AdminRole,
  current: OrderStatus,
  next: OrderStatus,
): boolean {
  if (role === "ADMIN") return true;
  if (
    next === ORDER_STATUS.CANCELLED &&
    (current === ORDER_STATUS.PENDING || current === ORDER_STATUS.CONFIRMED)
  ) {
    return true;
  }
  return getAllowedOrderStatusTransitions(role, current).includes(next);
}
