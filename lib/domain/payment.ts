export const PAYMENT_STATUS = {
  PENDING: "PENDING",
  PAID: "PAID",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
} as const;

export type PaymentStatus =
  (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

export function sanitizePayuPayload(data: FormData) {
  const allowedKeys = [
    "mode",
    "bankcode",
    "bank_ref_num",
    "unmappedstatus",
    "mihpayid",
    "status",
    "error",
    "error_Message",
    "PG_TYPE",
    "payment_source",
    "net_amount_debit",
    "txnid",
    "amount",
    "productinfo",
  ];

  const sanitized: Record<string, any> = {};

  allowedKeys.forEach((key) => {
    const val = data.get(key);
    if (val !== null) sanitized[key] = val;
  });

  return sanitized;
}
