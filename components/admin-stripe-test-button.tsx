"use client";

import { useState, useTransition } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import { startAdminStripeTestCheckout } from "@/lib/stripe/actions";
import { FeedbackBanner } from "@/components/feedback-banner";

type Props = {
  locale: string;
};

export function AdminStripeTestButton({ locale }: Props) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onStart() {
    setError(null);
    const fd = new FormData();
    fd.set("locale", locale);

    startTransition(async () => {
      const result = await startAdminStripeTestCheckout(fd);
      if (result && !result.ok) {
        setError(result.error);
      }
    });
  }

  return (
    <div className="rounded-3xl border border-paper-line bg-white p-5 sm:p-6">
      <h3 className="text-base font-semibold text-brand-ink">
        Stripe test payment
      </h3>
      <p className="mt-1 text-sm text-muted">
        Create a 1 EUR test checkout session to confirm Stripe is working.
      </p>
      <p className="mt-1 text-xs text-muted">
        Admin-only. This test is not linked to a registration and does not mark anyone paid.
      </p>

      <div className="mt-4">
        <button
          type="button"
          disabled={pending}
          onClick={onStart}
          className="btn-primary !py-2.5 disabled:opacity-60"
        >
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CreditCard className="h-4 w-4" />
          )}
          Start 1 EUR test checkout
        </button>
      </div>

      {error ? (
        <div className="mt-3">
          <FeedbackBanner variant="error">{error}</FeedbackBanner>
        </div>
      ) : null}
    </div>
  );
}
