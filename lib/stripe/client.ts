import Stripe from "stripe";

let stripeClient: Stripe | null = null;

function normalizedStripeSecretKey(): string | null {
  const raw = process.env.STRIPE_SECRET_KEY;
  if (!raw) return null;

  // Prevent hidden whitespace/newlines or accidental wrapping quotes from
  // breaking the Authorization header in serverless environments.
  const normalized = raw.trim().replace(/^['\"]|['\"]$/g, "").replace(/[\r\n]/g, "");
  return normalized || null;
}

export function getStripe(): Stripe {
  const key = normalizedStripeSecretKey();
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  if (!/^sk_(test|live)_/.test(key)) {
    throw new Error("STRIPE_SECRET_KEY format is invalid");
  }
  if (!stripeClient) {
    stripeClient = new Stripe(key);
  }
  return stripeClient;
}

export function isStripeConfigured(): boolean {
  return Boolean(normalizedStripeSecretKey());
}

export function siteOrigin(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}
