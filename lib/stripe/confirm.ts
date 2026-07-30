import { getStripe } from "@/lib/stripe/client";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

/**
 * After Stripe redirects back with session_id, confirm payment and mark paid.
 * Covers webhook race / local schema-cache issues so the Join UI updates immediately.
 */
export async function confirmCheckoutSession(
  sessionId: string,
  userId: string,
): Promise<{ markedPaid: boolean }> {
  if (!sessionId.startsWith("cs_")) {
    return { markedPaid: false };
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid" && session.status !== "complete") {
      return { markedPaid: false };
    }

    const registrationId =
      session.metadata?.registration_id ?? session.client_reference_id ?? null;
    const metaUserId = session.metadata?.user_id;

    if (!registrationId) {
      return { markedPaid: false };
    }

    // Ensure this checkout belongs to the signed-in user
    if (metaUserId && metaUserId !== userId) {
      return { markedPaid: false };
    }

    const supabase = createClient();
    const { data: owned } = await supabase
      .from("event_registrations")
      .select("id, status, user_id")
      .eq("id", registrationId)
      .maybeSingle();

    if (!owned || owned.user_id !== userId) {
      return { markedPaid: false };
    }

    if (owned.status === "paid") {
      return { markedPaid: true };
    }

    if (owned.status !== "approved") {
      return { markedPaid: false };
    }

    const paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id ?? null;

    const admin = createAdminClient();
    const { data, error } = await admin
      .from("event_registrations")
      .update({
        status: "paid",
        stripe_checkout_session_id: session.id,
        stripe_payment_intent_id: paymentIntentId,
        paid_at: new Date().toISOString(),
      })
      .eq("id", registrationId)
      .in("status", ["approved", "paid"])
      .select("id")
      .maybeSingle();

    if (error) {
      console.error("[stripe] confirm checkout update failed", error.message);
      // Fallback: status only (older schema cache without paid_at)
      const { data: fallback, error: fallbackError } = await admin
        .from("event_registrations")
        .update({ status: "paid" })
        .eq("id", registrationId)
        .eq("status", "approved")
        .select("id")
        .maybeSingle();
      if (fallbackError || !fallback) {
        return { markedPaid: false };
      }
      return { markedPaid: true };
    }

    return { markedPaid: Boolean(data) };
  } catch (err) {
    console.error("[stripe] confirm checkout failed", err);
    return { markedPaid: false };
  }
}
