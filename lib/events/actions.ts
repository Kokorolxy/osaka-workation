"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { defaultLocale, isLocale } from "@/lib/i18n/config";
import {
  getWorkationPackage,
  stayKeyForPackage,
} from "@/lib/workation-packages";
import type { RegistrationStatus } from "@/lib/database.types";
import { friendlyAppError } from "@/lib/errors/user-message";

function localeFromForm(formData: FormData): string {
  const raw = String(formData.get("locale") ?? defaultLocale);
  return isLocale(raw) ? raw : defaultLocale;
}

export type SaveRegistrationResult =
  | { ok: true }
  | { ok: false; error: string };

export async function saveEventRegistration(
  formData: FormData,
): Promise<SaveRegistrationResult> {
  const locale = localeFromForm(formData);
  const eventId = String(formData.get("event_id") ?? "").trim();
  const packageKey = String(formData.get("package_key") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const notes = String(formData.get("notes") ?? "").trim() || null;
  const statusRaw = String(formData.get("status") ?? "draft");
  const status: RegistrationStatus =
    statusRaw === "pending_approval" ? "pending_approval" : "draft";

  if (!eventId || !packageKey) {
    return { ok: false, error: "Please choose an event and a package." };
  }

  const catalog = getWorkationPackage(packageKey);
  if (!catalog) {
    return { ok: false, error: "Invalid package selection." };
  }

  const stayKey = stayKeyForPackage(packageKey);

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "You must be signed in." };
  }

  const { data: option, error: optionError } = await supabase
    .from("event_options")
    .select("id")
    .eq("event_id", eventId)
    .eq("key", packageKey)
    .eq("kind", "package")
    .maybeSingle();

  if (optionError || !option) {
    return { ok: false, error: "Invalid package selection." };
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
      stay_key: stayKey,
      phone,
      notes,
      status,
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
