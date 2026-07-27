"use client";

import { useState, useTransition } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import { startRegistrationCheckout } from "@/lib/stripe/actions";
import { FeedbackBanner } from "@/components/feedback-banner";

type Props = {
  locale: string;
  registrationId: string;
  priceLabel?: string | null;
};

export function PayCheckoutButton({
  locale,
  registrationId,
  priceLabel,
}: Props) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onPay() {
    setError(null);
    const fd = new FormData();
    fd.set("locale", locale);
    fd.set("registration_id", registrationId);
    startTransition(async () => {
      const result = await startRegistrationCheckout(fd);
      // redirect() succeeds by throwing; only failures return here
      if (result && !result.ok) {
        setError(result.error);
      }
    });
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        disabled={pending}
        onClick={onPay}
        className="btn-primary !px-5 !py-2.5 disabled:opacity-60"
      >
        {pending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <CreditCard className="h-4 w-4" />
        )}
        {priceLabel ? `Pay ${priceLabel}` : "Pay now"}
      </button>
      {error ? <FeedbackBanner variant="error">{error}</FeedbackBanner> : null}
    </div>
  );
}
