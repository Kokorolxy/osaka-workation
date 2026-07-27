import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getEarlyBirdRemaining } from "@/lib/events/actions";
import { JoinEventForm } from "@/components/join-event-form";
import { FeedbackBanner } from "@/components/feedback-banner";
import { CheckoutRefresh } from "@/components/checkout-refresh";
import { confirmCheckoutSession } from "@/lib/stripe/confirm";

export const metadata: Metadata = {
  title: "Join the Workation",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function JoinPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: { checkout?: string; session_id?: string };
}) {
  const locale: Locale = isLocale(params.locale)
    ? params.locale
    : defaultLocale;

  const session = await getCurrentProfile();
  if (!session) {
    redirect(`/${locale}/login?next=/${locale}/join`);
  }

  let checkoutMarkedPaid = false;
  if (
    searchParams.checkout === "success" &&
    searchParams.session_id &&
    process.env.STRIPE_SECRET_KEY
  ) {
    const result = await confirmCheckoutSession(
      searchParams.session_id,
      session.user.id,
    );
    checkoutMarkedPaid = result.markedPaid;
  }

  const supabase = createClient();
  const dict = getDictionary(locale);
  const j = dict.pages.join;

  const [{ data: events }, { data: options }, { data: registrations }] =
    await Promise.all([
      supabase
        .from("events")
        .select("*")
        .eq("is_active", true)
        .order("starts_on", { ascending: true }),
      supabase
        .from("event_options")
        .select("*")
        .order("sort_order", { ascending: true }),
      supabase
        .from("event_registrations")
        .select("*")
        .eq("user_id", session.user.id),
    ]);

  const alreadyPaid = (registrations ?? []).some((r) => r.status === "paid");

  const earlyBirdRemainingByEvent: Record<string, number> = {};
  await Promise.all(
    (events ?? []).map(async (event) => {
      earlyBirdRemainingByEvent[event.id] = await getEarlyBirdRemaining(
        event.id,
      );
    }),
  );

  return (
    <main className="relative overflow-hidden">
      <CheckoutRefresh
        enabled={
          searchParams.checkout === "success" &&
          !checkoutMarkedPaid &&
          !alreadyPaid
        }
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_top,_rgba(234,85,4,0.12),_transparent_60%)]"
      />
      <div className="container-page relative py-24">
        <div className="mx-auto max-w-3xl">
          <p className="eyebrow">{j.eyebrow}</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-brand-ink sm:text-4xl">
            {j.title}
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
            {j.subtitle}
          </p>

          {searchParams.checkout === "success" ? (
            <div className="mt-6">
              <FeedbackBanner variant="success">
                {checkoutMarkedPaid || alreadyPaid
                  ? j.checkout.successPaid
                  : j.checkout.successPending}
              </FeedbackBanner>
            </div>
          ) : null}
          {searchParams.checkout === "cancelled" ? (
            <div className="mt-6">
              <FeedbackBanner variant="info">
                {j.checkout.cancelled}
              </FeedbackBanner>
            </div>
          ) : null}

          <div className="mt-10">
            <JoinEventForm
              locale={locale}
              events={events ?? []}
              options={options ?? []}
              registrations={registrations ?? []}
              earlyBirdRemainingByEvent={earlyBirdRemainingByEvent}
              myReferralCode={session.profile.referral_code}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
