"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Soft-refresh Join after checkout so the status badge can pick up webhook updates. */
export function CheckoutRefresh({ enabled }: { enabled: boolean }) {
  const router = useRouter();

  useEffect(() => {
    if (!enabled) return;
    const t1 = setTimeout(() => router.refresh(), 1500);
    const t2 = setTimeout(() => router.refresh(), 4000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [enabled, router]);

  return null;
}
