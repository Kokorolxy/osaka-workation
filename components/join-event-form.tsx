"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  CalendarDays,
  Loader2,
  Save,
  Send,
  Bus,
  Home,
  Building2,
  X,
} from "lucide-react";
import {
  saveEventRegistration,
  type SaveRegistrationResult,
} from "@/lib/events/actions";
import type {
  EventOption,
  EventRegistration,
  EventRow,
} from "@/lib/database.types";
import {
  getWorkationPackage,
  stayKeyForPackage,
} from "@/lib/workation-packages";
import { RegistrationStatusBanner } from "@/components/registration-status";
import { FeedbackBanner } from "@/components/feedback-banner";
import { PayCheckoutButton } from "@/components/pay-checkout-button";
import { friendlyAppError } from "@/lib/errors/user-message";

type JoinEventFormProps = {
  locale: string;
  events: EventRow[];
  options: EventOption[];
  registrations: EventRegistration[];
};

function formatPrice(priceJpy: number | null) {
  if (priceJpy == null) return "TBD";
  return `¥${priceJpy.toLocaleString("en-US")}`;
}

function formatRange(startsOn: string | null, endsOn: string | null) {
  if (!startsOn && !endsOn) return null;
  const fmt = (d: string) =>
    new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(d));
  if (startsOn && endsOn) return `${fmt(startsOn)} – ${fmt(endsOn)}`;
  return fmt(startsOn ?? endsOn!);
}

function housingLabel(stayKey: string | null | undefined) {
  if (stayKey === "singular") return "Private housing";
  if (stayKey === "shared") return "Shared housing";
  if (!stayKey) return "No housing";
  return stayKey;
}

function StepHeading({
  step,
  title,
  description,
}: {
  step: number;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-ink text-sm font-bold text-white">
        {step}
      </span>
      <div>
        <h2 className="text-lg font-bold text-brand-ink">{title}</h2>
        <p className="mt-1 text-sm text-muted">{description}</p>
      </div>
    </div>
  );
}

export function JoinEventForm({
  locale,
  events,
  options,
  registrations,
}: JoinEventFormProps) {
  const [eventId, setEventId] = useState(events[0]?.id ?? "");
  const existing = useMemo(
    () => registrations.find((r) => r.event_id === eventId) ?? null,
    [registrations, eventId],
  );

  const initialPackage =
    existing?.package_key ??
    options.find(
      (o) => o.event_id === (events[0]?.id ?? "") && o.kind === "package",
    )?.key ??
    "";

  const [packageKey, setPackageKey] = useState(initialPackage);
  const [phone, setPhone] = useState(existing?.phone ?? "");
  const [notes, setNotes] = useState(existing?.notes ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const packages = options
    .filter((o) => o.event_id === eventId && o.kind === "package")
    .sort((a, b) => a.sort_order - b.sort_order);
  const selectedEvent = events.find((e) => e.id === eventId);
  const selectedPackage = packages.find((p) => p.key === packageKey);
  const catalog = getWorkationPackage(packageKey);
  const isLocked =
    existing?.status === "approved" || existing?.status === "paid";

  function onEventChange(nextId: string) {
    setEventId(nextId);
    const reg = registrations.find((r) => r.event_id === nextId);
    const pkgs = options
      .filter((o) => o.event_id === nextId && o.kind === "package")
      .sort((a, b) => a.sort_order - b.sort_order);
    const nextPackage = reg?.package_key ?? pkgs[0]?.key ?? "";
    setPackageKey(nextPackage);
    setPhone(reg?.phone ?? "");
    setNotes(reg?.notes ?? "");
    setMessage(null);
    setError(null);
  }

  function onPackageChange(nextKey: string) {
    if (isLocked) return;
    setPackageKey(nextKey);
    setMessage(null);
    setError(null);
  }

  function submit(status: "draft" | "pending_approval") {
    setMessage(null);
    setError(null);

    const fd = new FormData();
    fd.set("locale", locale);
    fd.set("event_id", eventId);
    fd.set("package_key", packageKey);
    fd.set("stay_key", stayKeyForPackage(packageKey) ?? "");
    fd.set("phone", phone);
    fd.set("notes", notes);
    fd.set("status", status);

    startTransition(async () => {
      const result: SaveRegistrationResult = await saveEventRegistration(fd);
      if (!result.ok) {
        setError(friendlyAppError(result.error));
        return;
      }
      setMessage(
        status === "pending_approval"
          ? "Submitted for approval. We’ll update your status here once reviewed."
          : "Draft saved. You can come back and change it anytime.",
      );
      router.refresh();
    });
  }

  if (events.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-paper-line bg-white/70 px-6 py-14 text-center">
        <p className="text-base font-semibold text-brand-ink">
          No events open yet
        </p>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
          Registration will appear here when an event is published.
        </p>
      </div>
    );
  }

  const canSave = Boolean(packageKey);
  const canEdit = !isLocked;

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        if (canEdit) submit("pending_approval");
      }}
    >
      {existing ? (
        <RegistrationStatusBanner
          status={existing.status}
          packageLabel={
            packages.find((p) => p.key === existing.package_key)?.name ??
            existing.package_key
          }
          housingLabel={housingLabel(existing.stay_key)}
          action={
            existing.status === "approved" ? (
              <PayCheckoutButton
                locale={locale}
                registrationId={existing.id}
                priceLabel={
                  packages.find((p) => p.key === existing.package_key)
                    ?.price_jpy != null
                    ? formatPrice(
                        packages.find((p) => p.key === existing.package_key)!
                          .price_jpy,
                      )
                    : null
                }
              />
            ) : null
          }
        />
      ) : null}

      <section className="rounded-3xl border border-paper-line bg-white p-6 sm:p-8">
        <StepHeading
          step={1}
          title="Choose event"
          description="Pick which workation you’re joining."
        />

        <div className="mt-6 grid gap-3">
          {events.map((event) => {
            const active = event.id === eventId;
            const range = formatRange(event.starts_on, event.ends_on);
            const hasReg = registrations.some((r) => r.event_id === event.id);
            return (
              <button
                key={event.id}
                type="button"
                onClick={() => onEventChange(event.id)}
                className={`rounded-2xl border p-4 text-left transition-all sm:p-5 ${
                  active
                    ? "border-brand-orange bg-brand-orange/[0.04] shadow-[0_16px_36px_-28px_rgba(234,85,4,0.55)] ring-1 ring-brand-orange"
                    : "border-paper-line hover:border-brand-orange/35"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="block text-base font-semibold text-brand-ink">
                    {event.title}
                  </span>
                  {hasReg ? (
                    <span className="shrink-0 rounded-full bg-paper-sand px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-muted">
                      Saved
                    </span>
                  ) : null}
                </div>
                {range ? (
                  <span className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {range}
                  </span>
                ) : null}
                {event.description ? (
                  <span className="mt-2 block text-sm leading-relaxed text-muted">
                    {event.description}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </section>

      <section
        className={`rounded-3xl border border-paper-line bg-white p-6 sm:p-8 ${
          !canEdit ? "opacity-75" : ""
        }`}
      >
        <StepHeading
          step={2}
          title="Choose package"
          description={`Coworking, weekend activities, optional housing, optional transport — for ${selectedEvent?.title ?? "this event"}.`}
        />

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {packages.map((pkg) => {
            const active = pkg.key === packageKey;
            const meta = getWorkationPackage(pkg.key);
            return (
              <button
                key={pkg.id}
                type="button"
                disabled={!canEdit}
                onClick={() => onPackageChange(pkg.key)}
                className={`flex flex-col rounded-2xl border p-5 text-left transition-all disabled:cursor-not-allowed ${
                  active
                    ? "border-brand-orange bg-white shadow-[0_18px_40px_-28px_rgba(234,85,4,0.55)] ring-1 ring-brand-orange"
                    : "border-paper-line hover:border-brand-orange/40"
                }`}
              >
                <div className="flex flex-wrap gap-1.5">
                  {meta?.housing === "singular" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-paper-sand px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-ink">
                      <Home className="h-3 w-3" /> Private
                    </span>
                  ) : null}
                  {meta?.housing === "shared" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-paper-sand px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-ink">
                      <Building2 className="h-3 w-3" /> Shared
                    </span>
                  ) : null}
                  {meta?.includesTransport ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-brand-orange/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-orange">
                      <Bus className="h-3 w-3" /> Transport
                    </span>
                  ) : null}
                </div>
                <span className="mt-2 text-sm font-semibold text-brand-ink">
                  {pkg.name}
                </span>
                <span className="mt-2 text-2xl font-extrabold tracking-tight text-brand-orange">
                  {formatPrice(pkg.price_jpy)}
                </span>
                {pkg.description ? (
                  <span className="mt-2 text-xs leading-relaxed text-muted">
                    {pkg.description}
                  </span>
                ) : null}
                {meta?.features?.length ? (
                  <ul className="mt-3 space-y-1.5">
                    {meta.features.slice(0, 5).map((f) => {
                      const excluded =
                        /not included|含みません/i.test(f);
                      return (
                        <li
                          key={f}
                          className={`flex items-start gap-1.5 text-[11px] ${
                            excluded ? "text-muted/80" : "text-muted"
                          }`}
                        >
                          {excluded ? (
                            <X className="mt-0.5 h-3 w-3 shrink-0 text-[#8b3a32]" />
                          ) : (
                            <Check className="mt-0.5 h-3 w-3 shrink-0 text-brand-orange" />
                          )}
                          {f}
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
                <span
                  className={`mt-5 inline-flex items-center gap-2 text-xs font-bold ${
                    active ? "text-brand-orange" : "text-muted"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                      active
                        ? "border-brand-orange bg-brand-orange"
                        : "border-paper-line"
                    }`}
                  >
                    {active ? <Check className="h-3 w-3 text-white" /> : null}
                  </span>
                  {active ? "Selected" : "Select"}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section
        className={`rounded-3xl border border-paper-line bg-white p-6 sm:p-8 ${
          !canEdit ? "opacity-75" : ""
        }`}
      >
        <StepHeading
          step={3}
          title="Contact details"
          description="Optional — helps us reach you about arrival and matching."
        />
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-brand-ink">
            Phone
            <input
              type="tel"
              name="phone"
              value={phone}
              disabled={!canEdit}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
              placeholder="+81 …"
              className="mt-1.5 w-full rounded-xl border border-paper-line bg-paper-cream/50 px-4 py-3 text-brand-ink outline-none ring-brand-orange transition focus:ring-2 disabled:opacity-60"
            />
          </label>
          <label className="block text-sm font-medium text-brand-ink sm:col-span-2">
            Notes
            <textarea
              name="notes"
              value={notes}
              disabled={!canEdit}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Dietary needs, arrival city, questions…"
              className="mt-1.5 w-full rounded-xl border border-paper-line bg-paper-cream/50 px-4 py-3 text-brand-ink outline-none ring-brand-orange transition focus:ring-2 disabled:opacity-60"
            />
          </label>
        </div>
      </section>

      {canEdit ? (
        <div className="sticky bottom-4 z-10 rounded-2xl border border-paper-line bg-white/95 p-4 shadow-[0_18px_40px_-20px_rgba(15,15,15,0.35)] backdrop-blur sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 text-sm">
              <p className="font-semibold text-brand-ink">
                {selectedEvent?.title ?? "Event"}
              </p>
              <p className="mt-0.5 truncate text-muted">
                {selectedPackage?.name ?? "Choose a package"}
                {catalog
                  ? ` · ${housingLabel(stayKeyForPackage(packageKey))}${catalog.includesTransport ? " · Transport" : ""}`
                  : ""}
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                disabled={pending || !canSave}
                onClick={() => submit("draft")}
                className="btn-ghost !py-2.5 disabled:opacity-60"
              >
                {pending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save draft
              </button>
              <button
                type="submit"
                disabled={pending || !canSave}
                className="btn-primary !py-2.5 disabled:opacity-60"
              >
                {pending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                Submit for approval
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="rounded-2xl border border-paper-line bg-paper-sand/60 px-5 py-4 text-sm text-muted">
          This registration is locked after approval. Contact us if you need to
          change something.
        </p>
      )}

      {error ? (
        <FeedbackBanner variant="error">{error}</FeedbackBanner>
      ) : null}
      {message ? (
        <FeedbackBanner variant="success">{message}</FeedbackBanner>
      ) : null}
    </form>
  );
}
