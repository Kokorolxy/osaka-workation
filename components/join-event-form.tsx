"use client";

import { useEffect, useMemo, useState, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  CalendarDays,
  Loader2,
  Save,
  Send,
  X,
  Ticket,
  Clock3,
  CreditCard,
  PartyPopper,
  Pencil,
  MessageCircle,
  Ban,
  ArrowRight,
} from "lucide-react";
import {
  saveEventRegistration,
  type SaveRegistrationResult,
  checkReferralUsage,
} from "@/lib/events/actions";
import type {
  EventOption,
  EventRegistration,
  EventRow,
  RegistrationStatus,
} from "@/lib/database.types";
import {
  DISCOUNT_PERCENT,
  EARLY_BIRD_LIMIT,
  WORKATION_DURATIONS,
  formatPackagePrice,
  getWorkationPackage,
  resolvePackageKey,
  type PricingTier,
  type TicketDuration,
} from "@/lib/workation-packages";
import {
  journeyStepFromStatus,
  type JourneyStepId,
} from "@/lib/join-journey";
import { JoinJourneyStepper } from "@/components/join-journey-stepper";
import { JoinTicketSummary } from "@/components/join-ticket-summary";
import { FeedbackBanner } from "@/components/feedback-banner";
import { PayCheckoutButton } from "@/components/pay-checkout-button";
import { WorkationSchedule } from "@/components/workation-schedule";
import { friendlyAppError } from "@/lib/errors/user-message";
import { SITE } from "@/lib/site";
import { L } from "@/components/locale-link";
import { useI18n } from "@/components/i18n-provider";
import { t } from "@/lib/i18n/t";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import type { Locale } from "@/lib/i18n/config";

type JoinDict = Dictionary["pages"]["join"];

type JoinEventFormProps = {
  locale: string;
  events: EventRow[];
  options: EventOption[];
  registrations: EventRegistration[];
  earlyBirdRemainingByEvent: Record<string, number>;
  myReferralCode?: string | null;
};

function formatRange(
  locale: Locale,
  startsOn: string | null,
  endsOn: string | null,
) {
  if (!startsOn && !endsOn) return null;
  const fmt = (d: string) =>
    new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
      new Date(d),
    );
  if (startsOn && endsOn) return `${fmt(startsOn)} – ${fmt(endsOn)}`;
  return fmt(startsOn ?? endsOn!);
}

function parseExisting(packageKey: string | undefined): {
  duration: TicketDuration;
  tier: PricingTier;
} {
  if (packageKey?.startsWith("week1_")) {
    const tier = packageKey.replace("week1_", "") as PricingTier;
    return { duration: "week1", tier };
  }
  if (packageKey?.startsWith("week2_")) {
    const tier = packageKey.replace("week2_", "") as PricingTier;
    return { duration: "week2", tier };
  }
  return { duration: "week2", tier: "general" };
}

function tierTitle(j: JoinDict, tier: PricingTier): string {
  switch (tier) {
    case "early_bird":
      return j.tiers.earlyBird.title;
    case "referral":
      return j.tiers.referral.title;
    default:
      return j.tiers.general.title;
  }
}

function packageLabel(j: JoinDict, packageKey: string): string {
  const { duration, tier } = parseExisting(packageKey);
  return `${j.durations[duration]} · ${tierTitle(j, tier)}`;
}

function SectionHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h2 className="text-lg font-bold text-brand-ink">{title}</h2>
      <p className="mt-1 text-sm text-muted">{description}</p>
    </div>
  );
}

function PanelShell({
  children,
  panelKey,
}: {
  children: ReactNode;
  panelKey: string;
}) {
  return (
    <div key={panelKey} className="animate-join-panel space-y-6">
      {children}
    </div>
  );
}

function priceForPackage(
  options: EventOption[],
  packageKey: string,
): number | null {
  const match = options.find((o) => o.key === packageKey);
  if (match?.price_jpy != null) return match.price_jpy;
  const catalog = getWorkationPackage(packageKey);
  return catalog?.priceJpy ?? null;
}

export function JoinEventForm({
  locale,
  events,
  options,
  registrations,
  earlyBirdRemainingByEvent,
  myReferralCode = null,
}: JoinEventFormProps) {
  const { locale: i18nLocale, dict } = useI18n();
  const j = dict.pages.join;
  const errors = dict.ui.errors;

  const [eventId, setEventId] = useState(events[0]?.id ?? "");
  const existing = useMemo(
    () => registrations.find((r) => r.event_id === eventId) ?? null,
    [registrations, eventId],
  );

  const status = (existing?.status ?? null) as RegistrationStatus | null;
  const derivedStep = journeyStepFromStatus(status);

  const [viewStep, setViewStep] = useState<JourneyStepId>(derivedStep);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const initial = parseExisting(existing?.package_key);
  const [duration, setDuration] = useState<TicketDuration>(initial.duration);
  const [pricingTier, setPricingTier] = useState<PricingTier>(initial.tier);
  const [referralCode, setReferralCode] = useState(
    existing?.referral_code_used ?? "",
  );
  const [phone, setPhone] = useState(existing?.phone ?? "");
  const [notes, setNotes] = useState(existing?.notes ?? "");
  const [referralValidation, setReferralValidation] = useState<{
    usedCount: number;
    valid: boolean;
    exists: boolean;
  } | null>(null);

  // Validate referral code when it changes
  useEffect(() => {
    if (pricingTier !== "referral" || !referralCode.trim()) {
      setReferralValidation(null);
      return;
    }

    const validateReferral = async () => {
      const result = await checkReferralUsage(referralCode);
      setReferralValidation({
        usedCount: result.usedCount,
        valid: result.valid,
        exists: result.exists,
      });
    };

    const debounceTimer = setTimeout(validateReferral, 300);
    return () => clearTimeout(debounceTimer);
  }, [referralCode, pricingTier]);

  // Keep panel in sync when status changes (submit → pending, approve → pay, etc.)
  useEffect(() => {
    setViewStep(derivedStep);
  }, [derivedStep, existing?.id, existing?.updated_at]);

  const selectedEvent = events.find((e) => e.id === eventId);
  const packageKey = resolvePackageKey(duration, pricingTier);
  const selectedOption = options.find(
    (o) => o.event_id === eventId && o.key === packageKey,
  );
  const catalog = getWorkationPackage(packageKey);
  const earlyLeft = earlyBirdRemainingByEvent[eventId] ?? 0;
  const isLocked = status === "approved" || status === "paid";
  const durationMeta = WORKATION_DURATIONS.find((d) => d.key === duration);

  const summaryPackageKey = existing?.package_key ?? packageKey;
  const summaryPrice = priceForPackage(options, summaryPackageKey);
  const selectedTicketLabel = packageLabel(j, packageKey);

  function onEventChange(nextId: string) {
    setEventId(nextId);
    const reg = registrations.find((r) => r.event_id === nextId);
    const parsed = parseExisting(reg?.package_key);
    setDuration(parsed.duration);
    setPricingTier(parsed.tier);
    setReferralCode(reg?.referral_code_used ?? "");
    setPhone(reg?.phone ?? "");
    setNotes(reg?.notes ?? "");
    setMessage(null);
    setError(null);
    setViewStep(journeyStepFromStatus(reg?.status ?? null));
  }

  function submit(nextStatus: "draft" | "pending_approval") {
    setMessage(null);
    setError(null);

    if (pricingTier === "early_bird" && earlyLeft <= 0) {
      const alreadyEarly = existing?.package_key?.includes("early_bird");
      if (!alreadyEarly) {
        setError(j.messages.earlyBirdSoldOut);
        return;
      }
    }
    if (pricingTier === "referral" && !referralCode.trim()) {
      setError(j.messages.referralRequired);
      return;
    }
    if (pricingTier === "referral" && referralValidation && !referralValidation.exists) {
      setError("This referral code is invalid.");
      return;
    }
    if (
      pricingTier === "referral" &&
      myReferralCode &&
      referralCode.trim().toUpperCase() === myReferralCode.toUpperCase()
    ) {
      setError(j.messages.referralOwn);
      return;
    }
    if (!phone.trim()) {
      setError("Phone number is required.");
      return;
    }

    const fd = new FormData();
    fd.set("locale", locale);
    fd.set("event_id", eventId);
    fd.set("duration", duration);
    fd.set("pricing_tier", pricingTier);
    fd.set("referral_code", referralCode);
    fd.set("phone", phone);
    fd.set("notes", notes);
    fd.set("status", nextStatus);

    startTransition(async () => {
      const result: SaveRegistrationResult = await saveEventRegistration(fd);
      if (!result.ok) {
        const byCode: Record<string, string> = {
          referral_required: j.messages.referralRequired,
          referral_invalid: j.messages.referralInvalid,
          referral_own: j.messages.referralOwn,
          referral_lookup_failed: j.messages.referralLookupFailed,
          early_bird_sold_out: j.messages.earlyBirdSoldOut,
        };
        setError(
          (result.code && byCode[result.code]) ||
            friendlyAppError(result.error, errors.fallback, errors),
        );
        return;
      }
      setMessage(
        nextStatus === "pending_approval"
          ? j.messages.submitted
          : j.messages.draftSaved,
      );
      if (nextStatus === "pending_approval") {
        setViewStep("review");
      }
      router.refresh();
    });
  }

  if (events.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-paper-line bg-white/70 px-6 py-14 text-center">
        <p className="text-base font-semibold text-brand-ink">
          {j.emptyEvents}
        </p>
      </div>
    );
  }

  const priceLabel = selectedOption?.price_jpy
    ? formatPackagePrice(selectedOption.price_jpy, i18nLocale)
    : catalog
      ? formatPackagePrice(catalog.priceJpy, i18nLocale)
      : null;

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-paper-line bg-white px-4 py-5 sm:px-8 sm:py-6">
        <JoinJourneyStepper
          active={viewStep}
          status={status}
          allowRegisterOverride={
            status === "pending_approval" || status === "cancelled"
          }
          onSelect={(step) => {
            if (step === "register" && isLocked) return;
            setViewStep(step);
            setMessage(null);
            setError(null);
          }}
        />
      </div>

      {error ? <FeedbackBanner variant="error">{error}</FeedbackBanner> : null}
      {message ? (
        <FeedbackBanner variant="success">{message}</FeedbackBanner>
      ) : null}

      {viewStep === "register" ? (
        <PanelShell panelKey="register">
          {status === "cancelled" ? (
            <div className="flex gap-3 rounded-2xl border border-[#e5c4bf] bg-[#f8e8e6] px-4 py-4 text-sm text-[#8b3a32]">
              <Ban className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="font-semibold">{j.messages.cancelledTitle}</p>
                <p className="mt-1 opacity-90">{j.messages.cancelledBody}</p>
              </div>
            </div>
          ) : null}

          {status === "pending_approval" ? (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#e2c49a] bg-[#f3e0c8]/50 px-4 py-3 text-sm text-[#7a4a12]">
              <p className="font-medium">{j.messages.editingPending}</p>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide"
                onClick={() => setViewStep("review")}
              >
                {j.actions.backToReview}
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : null}

          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              if (!isLocked) submit("pending_approval");
            }}
          >
            <section className="rounded-3xl border border-paper-line bg-white p-6 sm:p-8">
              <SectionHeading
                title={j.sections.event.title}
                description={j.sections.event.description}
              />
              <div className="mt-6 grid gap-3">
                {events.map((event) => {
                  const active = event.id === eventId;
                  const range = formatRange(
                    i18nLocale,
                    event.starts_on,
                    event.ends_on,
                  );
                  return (
                    <button
                      key={event.id}
                      type="button"
                      onClick={() => onEventChange(event.id)}
                      className={`rounded-2xl border p-4 text-left transition-all sm:p-5 ${
                        active
                          ? "border-brand-orange bg-brand-orange/[0.04] ring-1 ring-brand-orange"
                          : "border-paper-line hover:border-brand-orange/35"
                      }`}
                    >
                      <span className="block text-base font-semibold text-brand-ink">
                        {event.title}
                      </span>
                      {range ? (
                        <span className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {range}
                        </span>
                      ) : null}
                      {event.description ? (
                        <span className="mt-2 block text-sm text-muted">
                          {event.description}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </section>

            {selectedEvent ? (
              <section className="rounded-3xl border border-paper-line bg-white p-6 sm:p-8">
                <SectionHeading
                  title={j.sections.schedule.title}
                  description={j.sections.schedule.description}
                />
                <div className="mt-6">
                  <WorkationSchedule />
                </div>
              </section>
            ) : null}

            <section
              className={`rounded-3xl border border-paper-line bg-white p-6 sm:p-8 ${isLocked ? "opacity-75" : ""}`}
            >
              <SectionHeading
                title={j.sections.duration.title}
                description={j.sections.duration.description}
              />
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {WORKATION_DURATIONS.map((d) => {
                  const active = duration === d.key;
                  return (
                    <button
                      key={d.key}
                      type="button"
                      disabled={isLocked}
                      onClick={() => {
                        if (isLocked) return;
                        setDuration(d.key);
                        setMessage(null);
                        setError(null);
                      }}
                      className={`rounded-2xl border p-5 text-left transition-all disabled:cursor-not-allowed ${
                        active
                          ? "border-brand-orange ring-1 ring-brand-orange"
                          : "border-paper-line hover:border-brand-orange/40"
                      }`}
                    >
                      <span className="text-base font-bold text-brand-ink">
                        {j.durations[d.key]}
                      </span>
                      <p className="mt-2 text-2xl font-extrabold text-brand-orange">
                        {formatPackagePrice(d.generalPriceJpy, i18nLocale)}
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        {t(j.durations.discountHint, {
                          price: formatPackagePrice(d.discountedPriceJpy, i18nLocale),
                          pct: DISCOUNT_PERCENT,
                        })}
                      </p>
                    </button>
                  );
                })}
              </div>
            </section>

            <section
              className={`rounded-3xl border border-paper-line bg-white p-6 sm:p-8 ${isLocked ? "opacity-75" : ""}`}
            >
              <SectionHeading
                title={j.sections.ticket.title}
                description={j.sections.ticket.description}
              />
              <div className="mt-6 grid gap-3">
                {(
                  [
                    {
                      key: "general" as const,
                      title: j.tiers.general.title,
                      body: j.tiers.general.body,
                      price: durationMeta?.generalPriceJpy,
                      disabled: false,
                    },
                    ...(earlyLeft > 0 || existing?.package_key?.includes("early_bird")
                      ? [
                          {
                            key: "early_bird" as const,
                            title: j.tiers.earlyBird.title,
                            body:
                              earlyLeft > 0
                                ? t(j.tiers.earlyBird.bodyAvailable, {
                                    pct: DISCOUNT_PERCENT,
                                    left: earlyLeft,
                                    limit: EARLY_BIRD_LIMIT,
                                  })
                                : t(j.tiers.earlyBird.bodySoldOut, {
                                    limit: EARLY_BIRD_LIMIT,
                                  }),
                            price: durationMeta?.discountedPriceJpy,
                            disabled: false,
                          },
                        ]
                      : []),
                    {
                      key: "referral" as const,
                      title: j.tiers.referral.title,
                      body: t(j.tiers.referral.body, {
                        pct: DISCOUNT_PERCENT,
                      }),
                      price: durationMeta?.discountedPriceJpy,
                      disabled: false,
                    },
                  ] as const
                ).map((tier) => {
                  const active = pricingTier === tier.key;
                  return (
                    <button
                      key={tier.key}
                      type="button"
                      disabled={isLocked || tier.disabled}
                      onClick={() => {
                        if (isLocked || tier.disabled) return;
                        setPricingTier(tier.key);
                        setMessage(null);
                        setError(null);
                      }}
                      className={`rounded-2xl border p-4 text-left transition-all disabled:cursor-not-allowed disabled:opacity-50 sm:p-5 ${
                        active
                          ? "border-brand-orange ring-1 ring-brand-orange"
                          : "border-paper-line hover:border-brand-orange/40"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-ink">
                            <Ticket className="h-3.5 w-3.5 text-brand-orange" />
                            {tier.title}
                          </span>
                          <p className="mt-1 text-xs text-muted">{tier.body}</p>
                        </div>
                        {tier.price != null ? (
                          <span className="shrink-0 text-lg font-extrabold text-brand-orange">
                            {formatPackagePrice(tier.price, i18nLocale)}
                          </span>
                        ) : null}
                      </div>
                    </button>
                  );
                })}
              </div>

              {pricingTier === "referral" ? (
                <label className="mt-4 block text-sm font-medium text-brand-ink">
                  {j.fields.referralCode}
                  <input
                    type="text"
                    value={referralCode}
                    disabled={isLocked}
                    onChange={(e) =>
                      setReferralCode(e.target.value.toUpperCase())
                    }
                    placeholder={j.fields.referralPlaceholder}
                    autoComplete="off"
                    spellCheck={false}
                    className={`mt-1.5 w-full rounded-xl border bg-paper-cream/50 px-4 py-3 font-mono text-sm uppercase tracking-wider text-brand-ink outline-none ring-brand-orange focus:ring-2 disabled:opacity-60 ${
                      referralValidation !== null && referralCode.trim()
                        ? referralValidation.exists
                          ? referralValidation.valid
                            ? "border-green-400"
                            : "border-paper-line"
                          : "border-red-400"
                        : "border-paper-line"
                    }`}
                  />
                  <span className="mt-1.5 block text-xs font-normal text-muted">
                    {j.fields.referralHint}
                  </span>
                  {referralValidation !== null && referralCode.trim() ? (
                    <div className="mt-2">
                      {!referralValidation.exists ? (
                        <p className="text-xs text-red-600">
                          This referral code is invalid.
                        </p>
                      ) : referralValidation.valid ? (
                        <span className="inline-flex text-xs font-medium text-green-700">
                          Code verified.
                        </span>
                      ) : null}
                    </div>
                  ) : null}
                </label>
              ) : null}

              <div className="mt-6 rounded-2xl bg-paper-cream/60 px-4 py-4">
                <p className="text-xs font-bold uppercase tracking-wide text-muted">
                  {j.includesHeading}
                </p>
                <ul className="mt-3 space-y-1.5">
                  {j.includes.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-1.5 text-xs text-brand-ink/80"
                    >
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-orange" />
                      {f}
                    </li>
                  ))}
                  {j.excludes.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-1.5 text-xs text-muted"
                    >
                      <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#8b3a32]" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section
              className={`rounded-3xl border border-paper-line bg-white p-6 sm:p-8 ${isLocked ? "opacity-75" : ""}`}
            >
              <SectionHeading
                title={j.sections.contact.title}
                description={j.sections.contact.description}
              />
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium text-brand-ink">
                  {j.fields.phone}
                  <span className="text-red-600">*</span>
                  <input
                    type="tel"
                    value={phone}
                    disabled={isLocked}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="mt-1.5 w-full rounded-xl border border-paper-line bg-paper-cream/50 px-4 py-3 text-brand-ink outline-none ring-brand-orange focus:ring-2 disabled:opacity-60"
                  />
                </label>
                <label className="block text-sm font-medium text-brand-ink sm:col-span-2">
                  {j.fields.notes}
                  <textarea
                    value={notes}
                    disabled={isLocked}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="mt-1.5 w-full rounded-xl border border-paper-line bg-paper-cream/50 px-4 py-3 text-brand-ink outline-none ring-brand-orange focus:ring-2 disabled:opacity-60"
                  />
                </label>
              </div>
            </section>

            {!isLocked ? (
              <div className="sticky bottom-4 z-10 rounded-2xl border border-paper-line bg-white/95 p-4 shadow-[0_18px_40px_-20px_rgba(15,15,15,0.35)] backdrop-blur sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 text-sm">
                    <p className="font-semibold text-brand-ink">
                      {selectedEvent?.title ?? j.actions.eventFallback}
                    </p>
                    <p className="mt-0.5 truncate text-muted">
                      {selectedTicketLabel || j.actions.chooseTicket}
                      {priceLabel ? ` · ${priceLabel}` : ""}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                      type="button"
                      disabled={pending || !!error}
                      onClick={() => submit("draft")}
                      className="btn-ghost !py-2.5 disabled:opacity-60"
                    >
                      {pending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      {j.actions.saveDraft}
                    </button>
                    <button
                      type="submit"
                      disabled={pending || !!error}
                      className="btn-primary !py-2.5 disabled:opacity-60"
                    >
                      {pending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                      {j.actions.submit}
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </form>
        </PanelShell>
      ) : null}

      {viewStep === "review" ? (
        <PanelShell panelKey="review">
          <section className="overflow-hidden rounded-3xl border border-paper-line bg-white">
            <div className="border-b border-paper-line bg-gradient-to-br from-[#f3e0c8]/80 to-white px-6 py-8 sm:px-8">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f3e0c8] text-[#7a4a12]">
                <Clock3 className="h-6 w-6" />
              </span>
              <h2 className="mt-4 text-2xl font-bold tracking-tight text-brand-ink">
                {status === "pending_approval"
                  ? j.panels.reviewPending.title
                  : j.panels.reviewDone.title}
              </h2>
              <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted">
                {status === "pending_approval"
                  ? j.panels.reviewPending.body
                  : j.panels.reviewDone.body}
              </p>
            </div>
            <div className="space-y-5 p-6 sm:p-8">
              <JoinTicketSummary
                event={selectedEvent}
                packageKey={summaryPackageKey}
                priceJpy={summaryPrice}
                phone={existing?.phone ?? phone}
                notes={existing?.notes ?? notes}
                referralCode={existing?.referral_code_used}
              />
              <div className="flex flex-col gap-3 sm:flex-row">
                {status === "pending_approval" ? (
                  <button
                    type="button"
                    onClick={() => setViewStep("register")}
                    className="btn-ghost !py-2.5"
                  >
                    <Pencil className="h-4 w-4" />
                    {j.actions.edit}
                  </button>
                ) : null}
                {status === "approved" ? (
                  <button
                    type="button"
                    onClick={() => setViewStep("pay")}
                    className="btn-primary !py-2.5"
                  >
                    {j.actions.continuePay}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : null}
                <a
                  href={SITE.discord}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-ghost !py-2.5"
                >
                  <MessageCircle className="h-4 w-4" />
                  {j.actions.discord}
                </a>
              </div>
            </div>
          </section>
        </PanelShell>
      ) : null}

      {viewStep === "pay" ? (
        <PanelShell panelKey="pay">
          <section className="overflow-hidden rounded-3xl border border-paper-line bg-white">
            <div className="border-b border-paper-line bg-gradient-to-br from-brand-orange/10 to-white px-6 py-8 sm:px-8">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-orange/15 text-brand-orange">
                <CreditCard className="h-6 w-6" />
              </span>
              <h2 className="mt-4 text-2xl font-bold tracking-tight text-brand-ink">
                {j.panels.pay.title}
              </h2>
              <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted">
                {j.panels.pay.body}
              </p>
            </div>
            <div className="space-y-5 p-6 sm:p-8">
              <JoinTicketSummary
                event={selectedEvent}
                packageKey={summaryPackageKey}
                priceJpy={summaryPrice}
                phone={existing?.phone}
                notes={existing?.notes}
                referralCode={existing?.referral_code_used}
              />
              {existing ? (
                <PayCheckoutButton
                  locale={locale}
                  registrationId={existing.id}
                  priceLabel={
                    summaryPrice != null
                      ? formatPackagePrice(summaryPrice, i18nLocale)
                      : null
                  }
                />
              ) : null}
            </div>
          </section>
        </PanelShell>
      ) : null}

      {viewStep === "confirmed" ? (
        <PanelShell panelKey="confirmed">
          <section className="overflow-hidden rounded-3xl border border-paper-line bg-white">
            <div className="border-b border-paper-line bg-gradient-to-br from-[#e7f3ea] to-white px-6 py-8 sm:px-8">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e7f3ea] text-[#1f6b3a]">
                <PartyPopper className="h-6 w-6" />
              </span>
              <h2 className="mt-4 text-2xl font-bold tracking-tight text-brand-ink">
                {j.panels.confirmed.title}
              </h2>
              <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted">
                {j.panels.confirmed.body}
              </p>
            </div>
            <div className="space-y-5 p-6 sm:p-8">
              <JoinTicketSummary
                event={selectedEvent}
                packageKey={summaryPackageKey}
                priceJpy={summaryPrice}
                compact
              />
              <div className="flex flex-col gap-3 sm:flex-row">
                <L href="/account" className="btn-primary !py-2.5">
                  {j.actions.viewAccount}
                  <ArrowRight className="h-4 w-4" />
                </L>
                <a
                  href={SITE.discord}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-ghost !py-2.5"
                >
                  <MessageCircle className="h-4 w-4" />
                  {j.actions.joinDiscord}
                </a>
              </div>
            </div>
          </section>
        </PanelShell>
      ) : null}
    </div>
  );
}
