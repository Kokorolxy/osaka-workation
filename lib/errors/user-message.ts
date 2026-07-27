/**
 * Map technical / vendor errors to short, user-facing copy.
 * Keep secrets and hostnames out of the UI.
 */

const FALLBACK =
  "Something went wrong. Please try again in a moment.";

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

/** Known query-param / short codes from redirects. */
const CODE_MESSAGES: Record<string, string> = {
  auth_callback_failed:
    "That confirmation link didn’t work or has expired. Try signing in, or sign up again.",
  missing_code:
    "That confirmation link is incomplete. Please request a new one.",
};

/**
 * Auth-focused friendly message (login / signup / callback).
 */
export function friendlyAuthError(error: unknown): string {
  const code = errorCode(error);
  const message = rawMessage(error).trim();
  const lower = message.toLowerCase();

  if (CODE_MESSAGES[message]) return CODE_MESSAGES[message];
  if (CODE_MESSAGES[lower]) return CODE_MESSAGES[lower];

  if (
    code === "invalid_credentials" ||
    lower.includes("invalid login credentials") ||
    lower.includes("invalid email or password")
  ) {
    return "Email or password is incorrect. Check your details and try again.";
  }

  if (
    code === "email_not_confirmed" ||
    lower.includes("email not confirmed")
  ) {
    return "Please confirm your email before signing in. Check your inbox for the link.";
  }

  if (
    code === "user_already_exists" ||
    lower.includes("already registered") ||
    lower.includes("user already registered") ||
    lower.includes("already been registered")
  ) {
    return "An account with this email already exists. Try signing in instead.";
  }

  if (
    lower.includes("password should be at least") ||
    lower.includes("password is known to be weak") ||
    (lower.includes("password") && lower.includes("characters"))
  ) {
    return "Please choose a stronger password (at least 6 characters).";
  }

  if (
    code === "over_request_rate_limit" ||
    lower.includes("rate limit") ||
    lower.includes("too many requests") ||
    lower.includes("email rate limit")
  ) {
    return "Too many attempts. Please wait a minute and try again.";
  }

  if (
    lower.includes("unable to validate email") ||
    lower.includes("invalid email") ||
    (lower.includes("email address") && lower.includes("invalid"))
  ) {
    return "Please enter a valid email address.";
  }

  if (
    lower.includes("signup is disabled") ||
    lower.includes("signups not allowed")
  ) {
    return "New sign-ups are temporarily closed. Please try again later.";
  }

  if (
    lower === "fetch failed" ||
    lower.includes("econnrefused") ||
    lower.includes("enotfound") ||
    lower.includes("network") ||
    lower.includes("failed to fetch")
  ) {
    return "We couldn’t reach the sign-in service. Please check your connection and try again.";
  }

  if (
    lower.includes("server misconfigured") ||
    lower.includes("next_public_supabase")
  ) {
    return "Sign-in isn’t available right now. Please try again later.";
  }

  if (message && !looksTechnical(message)) {
    return message;
  }

  return FALLBACK;
}

/**
 * General app / database errors for members and admins.
 */
export function friendlyAppError(error: unknown, fallback = FALLBACK): string {
  const message = rawMessage(error).trim();
  const lower = message.toLowerCase();
  const code = errorCode(error);

  if (!message) return fallback;

  if (CODE_MESSAGES[message] || CODE_MESSAGES[lower]) {
    return CODE_MESSAGES[message] ?? CODE_MESSAGES[lower];
  }

  if (
    code === "42501" ||
    lower.includes("row-level security") ||
    lower.includes("permission denied")
  ) {
    return "You don’t have permission to do that.";
  }

  if (
    code === "23505" ||
    lower.includes("duplicate key") ||
    lower.includes("unique constraint")
  ) {
    return "That record already exists. Refresh the page and try again.";
  }

  if (
    lower.includes("jwt expired") ||
    (lower.includes("session") && lower.includes("expired")) ||
    lower.includes("not authenticated")
  ) {
    return "Your session expired. Please sign in again.";
  }

  if (
    lower === "fetch failed" ||
    lower.includes("network") ||
    lower.includes("failed to fetch")
  ) {
    return "Connection problem. Please check your network and try again.";
  }

  // Reuse auth mapping for vendor auth strings that bubble into app actions
  const authMapped = friendlyAuthError(error);
  if (authMapped !== FALLBACK) {
    return authMapped;
  }

  if (message && !looksTechnical(message)) {
    return message;
  }

  return fallback;
}
