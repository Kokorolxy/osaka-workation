"use server";

import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect";
import {
  createAdminStripeTestCheckout,
  createRegistrationCheckout,
} from "@/lib/stripe/checkout";
import { defaultLocale, isLocale } from "@/lib/i18n/config";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { friendlyAppError } from "@/lib/errors/user-message";
import type { RegistrationStatus } from "@/lib/database.types";

function localeFromForm(formData: FormData): string {
  const raw = String(formData.get("locale") ?? defaultLocale);
  return isLocale(raw) ? raw : defaultLocale;
}

export type StartCheckoutResult =
  | { ok: true }
  | { ok: false; error: string };

/** Server action: create Checkout Session and redirect to Stripe. */
export async function startRegistrationCheckout(
  formData: FormData,
): Promise<StartCheckoutResult> {
  const locale = localeFromForm(formData);
  const registrationId = String(formData.get("registration_id") ?? "").trim();

  if (!registrationId) {
    return { ok: false, error: "Missing registration." };
  }

  try {
    const result = await createRegistrationCheckout(registrationId, locale);
    if (!result.ok) {
      return result;
    }
    redirect(result.url);
  } catch (err) {
    if (isRedirectError(err)) throw err;
    return {
      ok: false,
      error: friendlyAppError(
        err,
        "We couldn’t start checkout. Please try again.",
      ),
    };
  }
}

/** Server action: create an admin-only Stripe test session and redirect. */
export async function startAdminStripeTestCheckout(
  formData: FormData,
): Promise<StartCheckoutResult> {
  const locale = localeFromForm(formData);

  try {
    const result = await createAdminStripeTestCheckout(locale);
    if (!result.ok) {
      return result;
    }
    redirect(result.url);
  } catch (err) {
    if (isRedirectError(err)) throw err;
    return {
      ok: false,
      error: friendlyAppError(
        err,
        "We couldn’t start Stripe test checkout. Please try again.",
      ),
    };
  }
}

/** Admin fallback when webhook isn’t running locally. */
export async function markRegistrationPaid(
  formData: FormData,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const locale = localeFromForm(formData);
  const registrationId = String(formData.get("registration_id") ?? "").trim();

  if (!registrationId) {
    return { ok: false, error: "Missing registration." };
  }

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
    return { ok: false, error: "Only admins can mark as paid." };
  }

  const next: RegistrationStatus = "paid";
  const { error } = await supabase
    .from("event_registrations")
    .update({ status: next, paid_at: new Date().toISOString() })
    .eq("id", registrationId)
    .eq("status", "approved");

  if (error) {
    return {
      ok: false,
      error: friendlyAppError(error, "Couldn’t mark as paid."),
    };
  }

  revalidatePath(`/${locale}/admin/registrations`);
  revalidatePath(`/${locale}/join`);
  revalidatePath(`/${locale}/account`);
  return { ok: true };
}
