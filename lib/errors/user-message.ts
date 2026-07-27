/**
 * Map technical / vendor errors to short, user-facing copy.
 * Keep secrets and hostnames out of the UI.
 */

import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import { en } from "@/lib/i18n/dictionaries/en";

type ErrorCopy = Dictionary["ui"]["errors"];

const FALLBACK_EN = en.ui.errors.fallback;

function rawMessage(error: unknown): string {
  if (!error) return "";
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && "message" in error) {
    return String((error as { message?: unknown }).message ?? "");
  }
  return String(error);
}

function errorCode(error: unknown): string {
  if (error && typeof error === "object" && "code" in error) {
    return String((error as { code?: unknown }).code ?? "").toLowerCase();
  }
  return "";
}

function looksTechnical(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    message.length >= 160 ||
    lower.includes("postgres") ||
    lower.includes("pgrst") ||
    lower.includes("jwt") ||
    lower.includes("stack") ||
    lower.includes("supabase") ||
    lower.includes("violates") ||
    lower.includes("sqlstate") ||
    message.includes("http://") ||
    message.includes("https://")
  );
}

/**
 * Auth-focused friendly message (login / signup / callback).
 */
export function friendlyAuthError(
  error: unknown,
  errors: ErrorCopy = en.ui.errors,
): string {
  const code = errorCode(error);
  const message = rawMessage(error).trim();
  const lower = message.toLowerCase();

  if (message === "auth_callback_failed" || lower === "auth_callback_failed") {
    return errors.authCallbackFailed;
  }
  if (message === "missing_code" || lower === "missing_code") {
    return errors.missingCode;
  }

  if (
    code === "invalid_credentials" ||
    lower.includes("invalid login credentials") ||
    lower.includes("invalid email or password")
  ) {
    return errors.invalidCredentials;
  }

  if (
    code === "email_not_confirmed" ||
    lower.includes("email not confirmed")
  ) {
    return errors.emailNotConfirmed;
  }

  if (
    code === "user_already_exists" ||
    lower.includes("already registered") ||
    lower.includes("user already registered") ||
    lower.includes("already been registered")
  ) {
    return errors.alreadyRegistered;
  }

  if (
    lower.includes("password should be at least") ||
    lower.includes("password is known to be weak") ||
    (lower.includes("password") && lower.includes("characters"))
  ) {
    return errors.weakPassword;
  }

  if (
    code === "over_request_rate_limit" ||
    lower.includes("rate limit") ||
    lower.includes("too many requests") ||
    lower.includes("email rate limit")
  ) {
    return errors.rateLimited;
  }

  if (
    lower.includes("unable to validate email") ||
    lower.includes("invalid email") ||
    (lower.includes("email address") && lower.includes("invalid"))
  ) {
    return errors.invalidEmail;
  }

  if (
    lower.includes("signup is disabled") ||
    lower.includes("signups not allowed")
  ) {
    return errors.signupDisabled;
  }

  if (
    lower === "fetch failed" ||
    lower.includes("econnrefused") ||
    lower.includes("enotfound") ||
    lower.includes("network") ||
    lower.includes("failed to fetch")
  ) {
    return errors.network;
  }

  if (
    lower.includes("server misconfigured") ||
    lower.includes("next_public_supabase")
  ) {
    return errors.misconfigured;
  }

  if (message && !looksTechnical(message)) {
    return message;
  }

  return errors.fallback;
}

/**
 * General app / database errors for members and admins.
 */
export function friendlyAppError(
  error: unknown,
  fallback?: string,
  errors: ErrorCopy = en.ui.errors,
): string {
  const resolvedFallback = fallback ?? errors.fallback;
  const message = rawMessage(error).trim();
  const lower = message.toLowerCase();
  const code = errorCode(error);

  if (!message) return resolvedFallback;

  if (message === "auth_callback_failed" || lower === "auth_callback_failed") {
    return errors.authCallbackFailed;
  }
  if (message === "missing_code" || lower === "missing_code") {
    return errors.missingCode;
  }

  if (
    code === "42501" ||
    lower.includes("row-level security") ||
    lower.includes("permission denied")
  ) {
    return errors.permissionDenied;
  }

  if (
    code === "23505" ||
    lower.includes("duplicate key") ||
    lower.includes("unique constraint")
  ) {
    return errors.duplicate;
  }

  if (
    lower.includes("jwt expired") ||
    (lower.includes("session") && lower.includes("expired")) ||
    lower.includes("not authenticated")
  ) {
    return errors.sessionExpired;
  }

  if (
    lower === "fetch failed" ||
    lower.includes("network") ||
    lower.includes("failed to fetch")
  ) {
    return errors.connection;
  }

  const authMapped = friendlyAuthError(error, errors);
  if (authMapped !== errors.fallback && authMapped !== FALLBACK_EN) {
    return authMapped;
  }

  if (message && !looksTechnical(message)) {
    return message;
  }

  return resolvedFallback;
}
