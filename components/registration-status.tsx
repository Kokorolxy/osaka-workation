"use client";

import type { ReactNode } from "react";
import type { RegistrationStatus } from "@/lib/database.types";
import {
  CheckCircle2,
  Clock3,
  FilePenLine,
  Ban,
  CreditCard,
} from "lucide-react";
import { useI18n } from "@/components/i18n-provider";

const STATUS_ICONS: Record<
  RegistrationStatus,
  typeof Clock3
> = {
  draft: FilePenLine,
  pending_approval: Clock3,
  approved: CheckCircle2,
  paid: CreditCard,
  cancelled: Ban,
};

const STATUS_CLASS: Record<RegistrationStatus, string> = {
  draft: "bg-paper-sand text-brand-ink ring-1 ring-paper-line",
  pending_approval: "bg-[#f3e0c8] text-[#7a4a12] ring-1 ring-[#e2c49a]",
  approved:
    "bg-brand-orange/10 text-brand-orange ring-1 ring-brand-orange/25",
  paid: "bg-[#e7f3ea] text-[#1f6b3a] ring-1 ring-[#b9dbc4]",
  cancelled: "bg-[#f8e8e6] text-[#8b3a32] ring-1 ring-[#e5c4bf]",
};

function useStatusMeta(status: string) {
  const { dict } = useI18n();
  const key = status as RegistrationStatus;
  const entry = dict.pages.join.status[key as keyof typeof dict.pages.join.status];
  if (entry && typeof entry === "object" && "label" in entry) {
    return {
      label: entry.label,
      hint: entry.hint,
      className: STATUS_CLASS[key] ?? STATUS_CLASS.draft,
      Icon: STATUS_ICONS[key] ?? Clock3,
    };
  }
  return {
    label: status.replaceAll("_", " "),
    hint: "",
    className: STATUS_CLASS.draft,
    Icon: Clock3,
  };
}

export function registrationStatusMeta(status: string) {
  // Non-hook fallback for rare server callers — prefer badge components.
  return {
    label: status.replaceAll("_", " "),
    hint: "",
    className: STATUS_CLASS[(status as RegistrationStatus)] ?? STATUS_CLASS.draft,
    Icon: STATUS_ICONS[(status as RegistrationStatus)] ?? Clock3,
  };
}

export function RegistrationStatusBadge({
  status,
  size = "md",
}: {
  status: string;
  size?: "sm" | "md";
}) {
  const meta = useStatusMeta(status);
  const Icon = meta.Icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold capitalize ${meta.className} ${
        size === "sm" ? "px-2.5 py-1 text-[11px]" : "px-3 py-1.5 text-xs"
      }`}
    >
      <Icon className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />
      {meta.label}
    </span>
  );
}

export function RegistrationStatusBanner({
  status,
  housingLabel,
  packageLabel,
  action,
}: {
  status: string;
  housingLabel?: string | null;
  packageLabel?: string | null;
  action?: ReactNode;
}) {
  const { dict } = useI18n();
  const meta = useStatusMeta(status);
  const Icon = meta.Icon;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-paper-line bg-white p-5 shadow-[0_12px_30px_-24px_rgba(15,15,15,0.35)] sm:flex-row sm:items-start sm:justify-between">
      <div className="flex gap-4">
        <span
          className={`mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${meta.className}`}
        >
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-bold text-brand-ink">
              {dict.pages.join.status.yourRegistration}
            </p>
            <RegistrationStatusBadge status={status} size="sm" />
          </div>
          <p className="mt-1 text-sm text-muted">{meta.hint}</p>
          {(packageLabel || housingLabel) && (
            <p className="mt-2 text-xs text-muted">
              {packageLabel ? (
                <span className="font-medium text-brand-ink">{packageLabel}</span>
              ) : null}
              {packageLabel && housingLabel ? " · " : null}
              {housingLabel ? <span>{housingLabel}</span> : null}
            </p>
          )}
        </div>
      </div>
      {action ? <div className="shrink-0 sm:pt-1">{action}</div> : null}
    </div>
  );
}
