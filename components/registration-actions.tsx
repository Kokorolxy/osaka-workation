"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, RotateCcw, X, Loader2, Banknote } from "lucide-react";
import { setRegistrationStatus } from "@/lib/events/actions";
import { markRegistrationPaid } from "@/lib/stripe/actions";
import { friendlyAppError } from "@/lib/errors/user-message";
import { FeedbackBanner } from "@/components/feedback-banner";

type Props = {
  locale: string;
  registrationId: string;
  status: string;
};

export function RegistrationActions({ locale, registrationId, status }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function runStatus(next: "approved" | "cancelled" | "pending_approval") {
    setError(null);
    const fd = new FormData();
    fd.set("locale", locale);
    fd.set("registration_id", registrationId);
    fd.set("status", next);
    startTransition(async () => {
      const result = await setRegistrationStatus(fd);
      if (!result.ok) {
        setError(friendlyAppError(result.error));
        return;
      }
      router.refresh();
    });
  }

  function runMarkPaid() {
    setError(null);
    const fd = new FormData();
    fd.set("locale", locale);
    fd.set("registration_id", registrationId);
    startTransition(async () => {
      const result = await markRegistrationPaid(fd);
      if (!result.ok) {
        setError(friendlyAppError(result.error));
        return;
      }
      router.refresh();
    });
  }

  const actions =
    status === "pending_approval" ? (
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={pending}
          onClick={() => runStatus("approved")}
          className="inline-flex items-center gap-1.5 rounded-full bg-brand-orange px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-orangeHover disabled:opacity-60"
        >
          {pending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Check className="h-3.5 w-3.5" />
          )}
          Approve
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => runStatus("cancelled")}
          className="inline-flex items-center gap-1.5 rounded-full border border-brand-ink/15 bg-white px-3.5 py-2 text-xs font-semibold text-brand-ink transition-colors hover:border-red-300 hover:text-red-700 disabled:opacity-60"
        >
          <X className="h-3.5 w-3.5" />
          Reject
        </button>
      </div>
    ) : status === "approved" ? (
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={pending}
          onClick={runMarkPaid}
          className="inline-flex items-center gap-1.5 rounded-full bg-brand-orange px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-orangeHover disabled:opacity-60"
          title="Use when Stripe webhook isn’t running locally"
        >
          {pending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Banknote className="h-3.5 w-3.5" />
          )}
          Mark paid
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => runStatus("pending_approval")}
          className="inline-flex items-center gap-1.5 rounded-full border border-brand-ink/15 bg-white px-3.5 py-2 text-xs font-semibold text-muted transition-colors hover:text-brand-ink disabled:opacity-60"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Revert
        </button>
      </div>
    ) : status === "cancelled" ? (
      <button
        type="button"
        disabled={pending}
        onClick={() => runStatus("pending_approval")}
        className="inline-flex items-center gap-1.5 rounded-full border border-brand-ink/15 bg-white px-3.5 py-2 text-xs font-semibold text-muted transition-colors hover:text-brand-ink disabled:opacity-60"
      >
        {pending ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <RotateCcw className="h-3.5 w-3.5" />
        )}
        Reopen
      </button>
    ) : (
      <span className="text-xs text-muted">No action</span>
    );

  return (
    <div className="space-y-2">
      {actions}
      {error ? <FeedbackBanner variant="error">{error}</FeedbackBanner> : null}
    </div>
  );
}
