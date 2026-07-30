"use server";

import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect";
import { createClient } from "@/lib/supabase/server";
import { defaultLocale, isLocale } from "@/lib/i18n/config";
import {
  assertSupabaseEnv,
  logAuthError,
  publicAuthErrorMessage,
} from "@/lib/auth/log";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STRONG_PASSWORD_RE = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

function isRegistrationOpen(): boolean {
  const raw = (process.env.REGISTRATION_OPEN ?? "true").toLowerCase();
  return raw === "1" || raw === "true" || raw === "yes" || raw === "on";
}

function localeFromForm(formData: FormData): string {
  const raw = String(formData.get("locale") ?? defaultLocale);
  return isLocale(raw) ? raw : defaultLocale;
}

function safeNextPath(next: string | null, locale: string): string {
  if (next && next.startsWith(`/${locale}/`) && !next.startsWith("//")) {
    return next;
  }
  return `/${locale}/account`;
}

function redirectWithError(path: string, error: unknown) {
  redirect(
    `${path}?error=${encodeURIComponent(publicAuthErrorMessage(error))}`,
  );
}

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const locale = localeFromForm(formData);
  const next = safeNextPath(String(formData.get("next") ?? ""), locale);

  const envError = assertSupabaseEnv();
  if (envError) {
    logAuthError({ action: "signIn", email }, new Error(envError));
    redirect(
      `/${locale}/login?error=${encodeURIComponent(envError)}&next=${encodeURIComponent(next)}`,
    );
  }

  try {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      logAuthError({ action: "signIn", email }, error);
      redirect(
        `/${locale}/login?error=${encodeURIComponent(publicAuthErrorMessage(error))}&next=${encodeURIComponent(next)}`,
      );
    }
  } catch (err) {
    if (isRedirectError(err)) throw err;
    logAuthError({ action: "signIn", email }, err);
    redirect(
      `/${locale}/login?error=${encodeURIComponent(publicAuthErrorMessage(err))}&next=${encodeURIComponent(next)}`,
    );
  }

  redirect(next);
}

export async function signUp(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirm_password") ?? "");
  const displayName = String(formData.get("display_name") ?? "").trim();
  const locale = localeFromForm(formData);

  if (!isRegistrationOpen()) {
    const msg =
      locale === "ja"
        ? "新規登録は現在停止中です。後でもう一度お試しください。"
        : "New registrations are currently closed. Please try again later.";
    redirectWithError(`/${locale}/signup`, msg);
  }

  if (!EMAIL_RE.test(email)) {
    redirectWithError(`/${locale}/signup`, "Please enter a valid email address.");
  }

  if (!STRONG_PASSWORD_RE.test(password)) {
    redirectWithError(
      `/${locale}/signup`,
      "Password must be at least 8 characters and include an uppercase letter, a number, and a special character.",
    );
  }

  if (password !== confirmPassword) {
    redirectWithError(`/${locale}/signup`, "Passwords do not match.");
  }

  const envError = assertSupabaseEnv();
  if (envError) {
    logAuthError({ action: "signUp", email }, new Error(envError));
    redirectWithError(`/${locale}/signup`, new Error(envError));
  }

  let successMessage =
    "Account created. You can sign in with your email and password.";

  try {
    const supabase = createClient();
    const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

    console.info(
      "[auth]",
      JSON.stringify({
        action: "signUp",
        email,
        supabaseHost: new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).host,
        emailRedirectTo: `${origin}/${locale}/auth/callback`,
      }),
    );

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName || undefined },
        emailRedirectTo: `${origin}/${locale}/auth/callback`,
      },
    });

    if (error) {
      logAuthError({ action: "signUp", email }, error);
      redirectWithError(`/${locale}/signup`, error);
    }

    console.info(
      "[auth]",
      JSON.stringify({
        action: "signUp",
        email,
        userId: data.user?.id ?? null,
        identities: data.user?.identities?.length ?? 0,
        hasSession: Boolean(data.session),
      }),
    );

    if (data.user && !data.session) {
      successMessage =
        "Account created. Check your email for a confirmation link, then sign in.";
    }
  } catch (err) {
    if (isRedirectError(err)) throw err;
    logAuthError({ action: "signUp", email }, err);
    redirectWithError(`/${locale}/signup`, err);
  }

  redirect(
    `/${locale}/login?message=${encodeURIComponent(successMessage)}`,
  );
}

export async function signOut(formData: FormData) {
  const locale = localeFromForm(formData);

  try {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      logAuthError({ action: "signOut" }, error);
    }
  } catch (err) {
    if (isRedirectError(err)) throw err;
    logAuthError({ action: "signOut" }, err);
  }

  redirect(`/${locale}/login`);
}
