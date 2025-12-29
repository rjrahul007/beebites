export const USER_ROLE = {
  ADMIN: "ADMIN",
  KITCHEN: "KITCHEN",
  DELIVERY: "DELIVERY",
  CUSTOMER: "CUSTOMER",
} as const;

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

/** Staff-only roles */
export const ADMIN_ROLES = [
  USER_ROLE.ADMIN,
  USER_ROLE.KITCHEN,
  USER_ROLE.DELIVERY,
] as const;

export type AdminRole = (typeof ADMIN_ROLES)[number];
