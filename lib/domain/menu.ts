export const MENU_VISIBILITY = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
} as const;

export type MenuVisibility =
  (typeof MENU_VISIBILITY)[keyof typeof MENU_VISIBILITY];
