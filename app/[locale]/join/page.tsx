import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { JoinEventForm } from "@/components/join-event-form";
import { FeedbackBanner } from "@/components/feedback-banner";
import { CheckoutRefresh } from "@/components/checkout-refresh";
import { confirmCheckoutSession } from "@/lib/stripe/confirm";

export const metadata: Metadata = {
  title: "Join an event",
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
          <p className="eyebrow">Members</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-brand-ink sm:text-4xl">
            Join an event
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
            Choose your package and housing type, then submit for approval.
            Checkout unlocks after an admin reviews your choices.
          </p>

          {searchParams.checkout === "success" ? (
            <div className="mt-6">
              <FeedbackBanner variant="success">
                {checkoutMarkedPaid || alreadyPaid
                  ? "Payment confirmed — your registration is marked Paid."
                  : "Payment received. Refreshing your status…"}
              </FeedbackBanner>
            </div>
          ) : null}
          {searchParams.checkout === "cancelled" ? (
            <div className="mt-6">
              <FeedbackBanner variant="info">
                Checkout cancelled. You can pay anytime while your registration
                stays approved.
              </FeedbackBanner>
            </div>
          ) : null}

          <div className="mt-10">
            <JoinEventForm
              locale={locale}
              events={events ?? []}
              options={options ?? []}
              registrations={registrations ?? []}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
