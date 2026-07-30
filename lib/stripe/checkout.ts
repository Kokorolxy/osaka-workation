import { getStripe, isStripeConfigured, siteOrigin } from "@/lib/stripe/client";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { defaultLocale, isLocale } from "@/lib/i18n/config";
import { friendlyAppError } from "@/lib/errors/user-message";

export type CheckoutResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

function localeFrom(raw: string): string {
  return isLocale(raw) ? raw : defaultLocale;
}

/**
 * Create a Stripe Checkout Session for an approved registration (test or live keys).
 * Amount comes from event_options.price_jpy (JPY has no decimal places in Stripe).
 */
export async function createRegistrationCheckout(
  registrationId: string,
  localeRaw: string,
): Promise<CheckoutResult> {
  if (!isStripeConfigured()) {
    return {
      ok: false,
      error:
        "Checkout isn’t set up yet. Add STRIPE_SECRET_KEY to .env.local (Stripe test mode).",
    };
  }

  const locale = localeFrom(localeRaw);
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "You must be signed in." };
  }

  const { data: registration, error: regError } = await supabase
    .from("event_registrations")
    .select("id, user_id, event_id, package_key, status")
    .eq("id", registrationId)
    .maybeSingle();

  if (regError || !registration) {
    return { ok: false, error: "Registration not found." };
  }

  if (registration.user_id !== user.id) {
    return { ok: false, error: "You don’t have permission to pay for this." };
  }

  if (registration.status !== "approved") {
    return {
      ok: false,
      error:
        registration.status === "paid"
          ? "This registration is already paid."
          : "Checkout unlocks after an admin approves your registration.",
    };
  }

  const [{ data: event }, { data: option }] = await Promise.all([
    supabase
      .from("events")
      .select("id, title")
      .eq("id", registration.event_id)
      .maybeSingle(),
    supabase
      .from("event_options")
      .select("name, price_jpy")
      .eq("event_id", registration.event_id)
      .eq("key", registration.package_key)
      .eq("kind", "package")
      .maybeSingle(),
  ]);

  if (!event || !option) {
    return { ok: false, error: "Could not load package details for checkout." };
  }

  if (option.price_jpy == null || option.price_jpy <= 0) {
    return {
      ok: false,
      error: "This package has no price yet. Contact us to complete payment.",
    };
  }

  const origin = siteOrigin();
  const email = user.email ?? undefined;

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      client_reference_id: registration.id,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "jpy",
            unit_amount: option.price_jpy,
            product_data: {
              name: `${event.title} — ${option.name}`,
              description: "OSAKA Workation registration",
            },
          },
        },
      ],
      metadata: {
        registration_id: registration.id,
        user_id: registration.user_id,
        event_id: registration.event_id,
        package_key: registration.package_key,
      },
      success_url: `${origin}/${locale}/join?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/${locale}/join?checkout=cancelled`,
    });

    if (!session.url) {
      return { ok: false, error: "Stripe did not return a checkout URL." };
    }

    // Persist session id with service role (member updates are locked once approved).
    try {
      const admin = createAdminClient();
      await admin
        .from("event_registrations")
        .update({ stripe_checkout_session_id: session.id })
        .eq("id", registration.id)
        .eq("status", "approved");
    } catch {
      // Non-fatal: webhook can still match via metadata / client_reference_id
    }

    return { ok: true, url: session.url };
  } catch (err) {
    console.error("[stripe] create checkout failed", err);
    return {
      ok: false,
      error: friendlyAppError(
        err,
        "We couldn’t start checkout. Please try again.",
      ),
    };
  }
}

/**
 * Admin-only Stripe connectivity test.
 * Creates a standalone 1 EUR session that is not linked to any registration.
 */
export async function createAdminStripeTestCheckout(
  localeRaw: string,
): Promise<CheckoutResult> {
  if (!isStripeConfigured()) {
    return {
      ok: false,
      error:
        "Checkout isn’t set up yet. Add STRIPE_SECRET_KEY to .env.local (Stripe test mode).",
    };
  }

  const locale = localeFrom(localeRaw);
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "You must be signed in." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    return { ok: false, error: "Only admins can run this Stripe test." };
  }

  const origin = siteOrigin();
  const email = user.email ?? undefined;

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: 100,
            product_data: {
              name: "Admin Stripe test payment",
              description: "Connectivity test only.",
            },
          },
        },
      ],
      metadata: {
        checkout_type: "admin_test",
        admin_user_id: user.id,
      },
      success_url: `${origin}/${locale}/admin?stripe_test=success`,
      cancel_url: `${origin}/${locale}/admin?stripe_test=cancelled`,
    });

    if (!session.url) {
      return { ok: false, error: "Stripe did not return a checkout URL." };
    }

    return { ok: true, url: session.url };
  } catch (err) {
    console.error("[stripe] create admin test checkout failed", err);
    return {
      ok: false,
      error: friendlyAppError(
        err,
        "We couldn’t start Stripe test checkout. Please try again.",
      ),
    };
  }
}
