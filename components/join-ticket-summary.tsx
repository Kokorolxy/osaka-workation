"use client";

import { Check, X } from "lucide-react";
import { formatPackagePrice, getWorkationPackage } from "@/lib/workation-packages";
import type { EventRow } from "@/lib/database.types";
import { useI18n } from "@/components/i18n-provider";
import { t } from "@/lib/i18n/t";

type Props = {
  event: EventRow | undefined;
  packageKey: string;
  ticketLabel?: string | null;
  priceJpy?: number | null;
  phone?: string | null;
  notes?: string | null;
  referralCode?: string | null;
  compact?: boolean;
};

function localizedPackageLabel(
  packageKey: string,
  durations: { week1: string; week2: string },
  tiers: { general: string; earlyBird: string; referral: string },
): string {
  const duration = packageKey.startsWith("week1_") ? "week1" : "week2";
  const tierKey = packageKey.replace(/^week[12]_/, "");
  const tier =
    tierKey === "early_bird"
      ? tiers.earlyBird
      : tierKey === "referral"
        ? tiers.referral
        : tiers.general;
  return `${durations[duration]} · ${tier}`;
}

export function JoinTicketSummary({
  event,
  packageKey,
  ticketLabel,
  priceJpy,
  phone,
  notes,
  referralCode,
  compact = false,
}: Props) {
  const { dict, locale } = useI18n();
  const j = dict.pages.join;
  const catalog = getWorkationPackage(packageKey);
  const price =
    priceJpy != null
      ? formatPackagePrice(priceJpy, locale)
      : catalog
        ? formatPackagePrice(catalog.priceJpy, locale)
        : null;
  const label =
    ticketLabel ??
    localizedPackageLabel(packageKey, j.durations, {
      general: j.tiers.general.title,
      earlyBird: j.tiers.earlyBird.title,
      referral: j.tiers.referral.title,
    });

  return (
    <div className="rounded-2xl border border-paper-line bg-paper-cream/50 p-5">
      <p className="text-[11px] font-bold uppercase tracking-wide text-muted">
        {j.summary.yourTicket}
      </p>
      <p className="mt-2 text-lg font-bold text-brand-ink">
        {event?.title ?? j.actions.eventFallback}
      </p>
      <p className="mt-1 text-sm text-muted">
        {label}
        {price ? (
          <span className="font-semibold text-brand-orange"> · {price}</span>
        ) : null}
      </p>
      {referralCode ? (
        <p className="mt-2 font-mono text-xs tracking-wider text-muted">
          {t(j.summary.referral, { code: referralCode })}
        </p>
      ) : null}
      {(phone || notes) && !compact ? (
        <dl className="mt-4 grid gap-2 border-t border-paper-line/80 pt-4 text-sm">
          {phone ? (
            <div className="flex justify-between gap-4">
              <dt className="text-muted">{j.summary.phone}</dt>
              <dd className="font-medium text-brand-ink">{phone}</dd>
            </div>
          ) : null}
          {notes ? (
            <div>
              <dt className="text-muted">{j.summary.notes}</dt>
              <dd className="mt-1 text-brand-ink">{notes}</dd>
            </div>
          ) : null}
        </dl>
      ) : null}

      {!compact ? (
        <ul className="mt-4 space-y-1.5 border-t border-paper-line/80 pt-4">
          {j.includes.slice(0, 4).map((f) => (
            <li
              key={f}
              className="flex items-start gap-1.5 text-xs text-brand-ink/80"
            >
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-orange" />
              {f}
            </li>
          ))}
          {j.excludes.slice(0, 2).map((f) => (
            <li key={f} className="flex items-start gap-1.5 text-xs text-muted">
              <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#8b3a32]" />
              {f}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
