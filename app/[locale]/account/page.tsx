import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/auth/actions";
import { getReferralUsageCount } from "@/lib/events/actions";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { t } from "@/lib/i18n/t";
import { L } from "@/components/locale-link";
import { RegistrationStatusBadge } from "@/components/registration-status";
import { PayCheckoutButton } from "@/components/pay-checkout-button";
import {
  journeyStepFromStatus,
  journeyStepIndex,
} from "@/lib/join-journey";
import { ArrowRight, LogOut, Shield } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";

function localizedTicketName(
  packageKey: string,
  join: Dictionary["pages"]["join"],
): string {
  const duration = packageKey.startsWith("week1_") ? "week1" : "week2";
  const tierKey = packageKey.replace(/^week[12]_/, "");
  const tier =
    tierKey === "early_bird"
      ? join.tiers.earlyBird.title
      : tierKey === "referral"
        ? join.tiers.referral.title
        : join.tiers.general.title;
  return `${join.durations[duration]} · ${tier}`;
}

export const metadata: Metadata = {
  title: "Account",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AccountPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale: Locale = isLocale(params.locale)
    ? params.locale
    : defaultLocale;

  const session = await getCurrentProfile();
  if (!session) {
    redirect(`/${locale}/login?next=/${locale}/account`);
  }

  const { user, profile } = session;
  const supabase = createClient();
  const { data: registrations } = await supabase
    .from("event_registrations")
    .select("id, status, package_key, stay_key, event_id, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  const referralUsageCount = await getReferralUsageCount(user.id);

  const { data: events } = await supabase.from("events").select("id, title");
  const eventById = new Map((events ?? []).map((e) => [e.id, e]));
  const dict = getDictionary(locale);
  const a = dict.pages.account;
  const join = dict.pages.join;

  return (
    <main className="container-page py-24">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="rounded-3xl border border-paper-line bg-white p-8">
          <p className="eyebrow">{a.eyebrow}</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-brand-ink">
            {a.title}
          </h1>

          <dl className="mt-8 grid gap-5 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
                {a.displayName}
              </dt>
              <dd className="mt-1.5 font-semibold text-brand-ink">
                {profile.display_name ?? "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
                {a.email}
              </dt>
              <dd className="mt-1.5 font-semibold text-brand-ink">
                {profile.email ?? user.email}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
                {a.role}
              </dt>
              <dd className="mt-1.5">
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                    profile.role === "admin"
                      ? "bg-brand-orange/10 text-brand-orange"
                      : "bg-paper-sand text-brand-ink"
                  }`}
                >
                  {profile.role}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
                {a.referralCode}
              </dt>
              <dd className="mt-1.5 flex items-center gap-3">
                <span className="font-semibold tracking-wider text-brand-ink">
                  {profile.referral_code}
                </span>
                <span className="inline-flex rounded-full bg-brand-orange/10 px-2.5 py-1 text-xs font-semibold text-brand-orange">
                  {referralUsageCount} of 10 used
                </span>
              </dd>
              <p className="mt-1 text-xs text-muted">{a.referralHint}</p>
            </div>
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            <L href="/join" className="btn-primary !px-5 !py-2.5">
              {a.joinEvent}
              <ArrowRight className="h-4 w-4" />
            </L>
            {profile.role === "admin" ? (
              <L href="/admin" className="btn-ghost !px-5 !py-2.5">
                <Shield className="h-4 w-4" />
                {a.admin}
              </L>
            ) : null}
            <form action={signOut}>
              <input type="hidden" name="locale" value={locale} />
              <button type="submit" className="btn-ghost !px-5 !py-2.5">
                <LogOut className="h-4 w-4" />
                {a.signOut}
              </button>
            </form>
          </div>
        </div>

        <div className="rounded-3xl border border-paper-line bg-white p-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-brand-ink">
                {a.registrationsTitle}
              </h2>
              <p className="mt-1 text-sm text-muted">{a.registrationsBody}</p>
            </div>
          </div>

          {(registrations ?? []).length === 0 ? (
            <p className="mt-6 rounded-2xl border border-dashed border-paper-line bg-paper-cream/40 px-4 py-8 text-center text-sm text-muted">
              {a.empty}{" "}
              <L
                href="/join"
                className="font-semibold text-brand-orange hover:underline"
              >
                {a.emptyCta}
              </L>
            </p>
          ) : (
            <ul className="mt-6 space-y-3">
              {(registrations ?? []).map((reg) => {
                const stepId = journeyStepFromStatus(reg.status);
                return (
                  <li
                    key={reg.id}
                    className="flex flex-col gap-3 rounded-2xl border border-paper-line bg-paper-cream/30 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-semibold text-brand-ink">
                        {eventById.get(reg.event_id)?.title ??
                          join.actions.eventFallback}
                      </p>
                      <p className="mt-0.5 text-xs text-muted">
                        {localizedTicketName(reg.package_key, join)}
                        {" · "}
                        {t(a.stepLabel, {
                          n: journeyStepIndex(stepId) + 1,
                          label: join.steps[stepId],
                        })}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <RegistrationStatusBadge status={reg.status} size="sm" />
                      {reg.status === "approved" ? (
                        <PayCheckoutButton
                          locale={locale}
                          registrationId={reg.id}
                        />
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
