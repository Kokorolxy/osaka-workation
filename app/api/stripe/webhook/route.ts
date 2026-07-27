import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe/client";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

async function markPaidFromSession(session: Stripe.Checkout.Session) {
  const registrationId =
    session.metadata?.registration_id ?? session.client_reference_id ?? null;

  if (!registrationId) {
    console.error("[stripe/webhook] missing registration_id on session", session.id);
    return;
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
    console.error("[stripe/webhook] update failed", error.message);
    // Schema-cache lag: still flip status so members see Paid
    const { data: fallback, error: fallbackError } = await admin
      .from("event_registrations")
      .update({ status: "paid" })
      .eq("id", registrationId)
      .in("status", ["approved", "paid"])
      .select("id")
      .maybeSingle();
    if (fallbackError) {
      console.error("[stripe/webhook] fallback update failed", fallbackError.message);
      return;
    }
    if (!fallback) {
      console.error(
        "[stripe/webhook] no matching approved registration",
        registrationId,
      );
    }
    return;
  }

  if (!data) {
    console.error(
      "[stripe/webhook] no matching approved registration",
      registrationId,
    );
  }
}

export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!secret || secret === "whsec_..." || secret.includes("...")) {
    console.error(
      "[stripe/webhook] STRIPE_WEBHOOK_SECRET is missing or still a placeholder. " +
        "Copy the whsec_… printed by `stripe listen` into .env.local and restart npm run dev.",
    );
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET is not configured" },
      { status: 500 },
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  // Must verify against the exact raw bytes Stripe signed.
  const rawBody = Buffer.from(await request.arrayBuffer());

  let event: Stripe.Event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    console.error(
      "[stripe/webhook] signature error",
      message,
      "| Tip: use the whsec_ from the current `stripe listen` process (not the Dashboard), then restart Next.",
    );
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.payment_status === "paid" || session.status === "complete") {
          await markPaidFromSession(session);
        }
        break;
      }
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object as Stripe.Checkout.Session;
        await markPaidFromSession(session);
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error("[stripe/webhook] handler error", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
