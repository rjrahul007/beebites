"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle } from "lucide-react";
import { useCart } from "@/hooks/use-cart";

export default function PaymentPage() {
  const router = useRouter();
  const params = useSearchParams();
  const { clearCart } = useCart();

  const status = params.get("status"); // success | failed
  const orderId = params.get("orderId");

  const [countdown, setCountdown] = useState(3);

  // ✅ Always clear cart (order already exists)
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  // ✅ Timer only
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((c) => Math.max(c - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // ✅ Redirect watcher
  useEffect(() => {
    if (countdown !== 0) return;

    if (status === "success" && orderId) {
      router.replace(`/orders/${orderId}`);
    } else if (orderId) {
      router.replace(`/orders/${orderId}`);
    } else {
      router.replace("/cart");
    }
  }, [countdown, status, orderId, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        {status === "success" ? (
          <>
            <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto animate-bounce" />
            <h1 className="text-2xl font-bold">Payment Successful</h1>
            <p className="text-muted-foreground">
              Your order has been placed successfully
            </p>
          </>
        ) : (
          <>
            <XCircle className="h-20 w-20 text-red-500 mx-auto animate-pulse" />
            <h1 className="text-2xl font-bold">Payment Failed</h1>
            <p className="text-muted-foreground">
              You can retry payment on the order page
            </p>
          </>
        )}

        <p className="text-sm text-muted-foreground">
          Redirecting in {countdown}s...
        </p>
      </div>
    </div>
  );
}
