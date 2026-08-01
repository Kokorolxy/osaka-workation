"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { defaultLocale, isLocale } from "@/lib/i18n/config";
import {
  EARLY_BIRD_LIMIT,
  getWorkationPackage,
  resolvePackageKey,
  type PricingTier,
  type TicketDuration,
} from "@/lib/workation-packages";
import type { RegistrationStatus } from "@/lib/database.types";
import { friendlyAppError } from "@/lib/errors/user-message";

function localeFromForm(formData: FormData): string {
  const raw = String(formData.get("locale") ?? defaultLocale);
  return isLocale(raw) ? raw : defaultLocale;
}

export type SaveRegistrationResult =
  | { ok: true }
  | { ok: false; error: string; code?: string };

const COUNTABLE_STATUSES = ["pending_approval", "approved", "paid"] as const;

function fail(code: string, error: string): SaveRegistrationResult {
  return { ok: false, code, error };
}

export async function getEarlyBirdRemaining(eventId: string): Promise<number> {
  const supabase = createAdminClient();
  const { count } = await supabase
    .from("event_registrations")
    .select("id", { count: "exact", head: true })
    .eq("event_id", eventId)
    .in("package_key", [
      "week1_early_bird",
      "week2_early_bird",
      "week2_single_early_bird",
    ])
    .in("status", [...COUNTABLE_STATUSES]);

  return Math.max(0, EARLY_BIRD_LIMIT - (count ?? 0));
}

export async function checkReferralUsage(
  referralCode: string,
): Promise<{
  valid: boolean;
  usedCount: number;
  remainingUses: number;
  exists: boolean;
}> {
  if (!referralCode.trim()) {
    return { valid: false, usedCount: 0, remainingUses: 0, exists: false };
  }

  const supabase = createAdminClient();

  // Find referrer by code
  const { data: referrerData, error: refError } = await supabase.rpc(
    "find_referrer_by_code",
    { code: referralCode.toUpperCase() },
  );

  if (refError || !referrerData) {
    return { valid: false, usedCount: 0, remainingUses: 0, exists: false };
  }

  const referrerId = typeof referrerData === "string" ? referrerData : null;

  if (!referrerId) {
    return { valid: false, usedCount: 0, remainingUses: 0, exists: false };
  }

  // Count current usage
  const { count: usedCount } = await supabase
    .from("event_registrations")
    .select("id", { count: "exact", head: true })
    .eq("referrer_id", referrerId)
    .in("status", [...COUNTABLE_STATUSES]);

  const used = usedCount ?? 0;

  return {
    valid: true,
    usedCount: used,
    remainingUses: Number.MAX_SAFE_INTEGER,
    exists: true,
  };
}

export async function saveEventRegistration(
  formData: FormData,
): Promise<SaveRegistrationResult> {
  const locale = localeFromForm(formData);
  const eventId = String(formData.get("event_id") ?? "").trim();
  const duration = String(formData.get("duration") ?? "").trim() as TicketDuration;
  const pricingTier = String(
    formData.get("pricing_tier") ?? "",
  ).trim() as PricingTier;
  const referralCode = String(formData.get("referral_code") ?? "")
    .trim()
    .toUpperCase();
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const notes = String(formData.get("notes") ?? "").trim() || null;
  const statusRaw = String(formData.get("status") ?? "draft");
  const status: RegistrationStatus =
    statusRaw === "pending_approval" ? "pending_approval" : "draft";

  if (
    !eventId ||
    (duration !== "week1" && duration !== "week2" && duration !== "week2_single")
  ) {
    return { ok: false, error: "Please choose an event and duration." };
  }
  if (
    pricingTier !== "general" &&
    pricingTier !== "early_bird" &&
    pricingTier !== "referral"
  ) {
    return { ok: false, error: "Please choose a ticket type." };
  }

  const packageKey = resolvePackageKey(duration, pricingTier);
  const catalog = getWorkationPackage(packageKey);
  if (!catalog) {
    return { ok: false, error: "Invalid ticket selection." };
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "You must be signed in." };
  }

  let referrerId: string | null = null;
  let referralCodeUsed: string | null = null;

  if (pricingTier === "early_bird") {
    const remaining = await getEarlyBirdRemaining(eventId);
    // Allow keeping early bird if this user already has an early-bird registration
    const { data: existingOwn } = await supabase
      .from("event_registrations")
      .select("package_key")
      .eq("user_id", user.id)
      .eq("event_id", eventId)
      .maybeSingle();
    const alreadyEarly =
      existingOwn?.package_key === "week1_early_bird" ||
      existingOwn?.package_key === "week2_early_bird" ||
      existingOwn?.package_key === "week2_single_early_bird";
    if (remaining <= 0 && !alreadyEarly) {
      return {
        ok: false,
        error: "Early bird tickets are sold out. Choose General or Referral.",
      };
    }
  }

  if (pricingTier === "referral") {
    if (!referralCode) {
      return fail(
        "referral_required",
        "Enter a referral code for the referral ticket.",
      );
    }

    const { data: referrerUuid, error: refLookupError } = await supabase.rpc(
      "find_referrer_by_code",
      { code: referralCode },
    );

    if (refLookupError) {
      return fail(
        "referral_lookup_failed",
        refLookupError.message ||
          "We couldn’t verify that referral code. Please try again.",
      );
    }

    const referrerIdResolved =
      typeof referrerUuid === "string" ? referrerUuid : null;

    if (!referrerIdResolved) {
      return fail(
        "referral_invalid",
        "That referral code isn’t valid. Ask an admin for a code from their Account page.",
      );
    }

    if (referrerIdResolved === user.id) {
      return fail(
        "referral_own",
        "You can’t use your own referral code. Enter another admin’s code.",
      );
    }

    referrerId = referrerIdResolved;
    referralCodeUsed = referralCode;
  }

  const { data: option, error: optionError } = await supabase
    .from("event_options")
    .select("id")
    .eq("event_id", eventId)
    .eq("key", packageKey)
    .eq("kind", "package")
    .maybeSingle();

  if (optionError || !option) {
    return { ok: false, error: "Invalid ticket selection." };
  }

  const { data: existing } = await supabase
    .from("event_registrations")
    .select("status")
    .eq("user_id", user.id)
    .eq("event_id", eventId)
    .maybeSingle();

  if (
    existing &&
    (existing.status === "approved" || existing.status === "paid")
  ) {
    return {
      ok: false,
      error:
        "This registration is already approved. Contact an admin to change it.",
    };
  }

  const { error } = await supabase.from("event_registrations").upsert(
    {
      user_id: user.id,
      event_id: eventId,
      package_key: packageKey,
      addon_keys: [],
      stay_key: null,
      phone,
      notes,
      status,
      referrer_id: referrerId,
      referral_code_used: referralCodeUsed,
    },
    { onConflict: "user_id,event_id" },
  );

  if (error) {
    return {
      ok: false,
      error: friendlyAppError(
        error,
        "We couldn’t save your registration. Please try again.",
      ),
    };
  }

  revalidatePath(`/${locale}/join`);
  revalidatePath(`/${locale}/admin/registrations`);
  revalidatePath(`/${locale}/account`);
  return { ok: true };
}

export async function setRegistrationStatus(
  formData: FormData,
): Promise<SaveRegistrationResult> {
  const locale = localeFromForm(formData);
  const registrationId = String(formData.get("registration_id") ?? "").trim();
  const next = String(formData.get("status") ?? "").trim() as RegistrationStatus;

  if (!registrationId) {
    return { ok: false, error: "Missing registration." };
  }
  if (next !== "approved" && next !== "cancelled" && next !== "pending_approval") {
    return { ok: false, error: "Invalid status." };
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
    return { ok: false, error: "Only admins can change registration status." };
  }

  const { error } = await supabase
    .from("event_registrations")
    .update({ status: next })
    .eq("id", registrationId);

  if (error) {
    return {
      ok: false,
      error: friendlyAppError(
        error,
        "We couldn’t update that registration. Please try again.",
      ),
    };
  }

  revalidatePath(`/${locale}/admin/registrations`);
  revalidatePath(`/${locale}/join`);
  return { ok: true };
}
