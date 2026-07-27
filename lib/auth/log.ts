import { friendlyAuthError } from "@/lib/errors/user-message";

type AuthLogContext = {
  action: "signIn" | "signUp" | "signOut";
  email?: string;
};

function supabaseHost() {
  try {
    const raw = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!raw) return "(missing NEXT_PUBLIC_SUPABASE_URL)";
    return new URL(raw).host;
  } catch {
    return "(invalid NEXT_PUBLIC_SUPABASE_URL)";
  }
}

function causeChain(err: unknown): string[] {
  const parts: string[] = [];
  let current: unknown = err;
  let depth = 0;
  while (current && depth < 5) {
    if (current instanceof Error) {
      parts.push(
        `${current.name}: ${current.message}${
          "code" in current ? ` (code=${String((current as { code?: unknown }).code)})` : ""
        }`,
      );
      current = current.cause;
    } else {
      parts.push(String(current));
      break;
    }
    depth += 1;
  }
  return parts;
}

/** Server-side auth diagnostics — never logs passwords. */
export function logAuthError(context: AuthLogContext, error: unknown) {
  const payload: Record<string, unknown> = {
    action: context.action,
    email: context.email || undefined,
    supabaseHost: supabaseHost(),
    hasAnonKey: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? null,
  };

  if (error && typeof error === "object") {
    const e = error as {
      message?: string;
      status?: number;
      code?: string;
      name?: string;
      cause?: unknown;
    };
    payload.errorName = e.name;
    payload.errorMessage = e.message;
    payload.errorStatus = e.status;
    payload.errorCode = e.code;
    if (e.cause) payload.cause = causeChain(e.cause);
  } else {
    payload.errorMessage = String(error);
  }

  console.error("[auth]", JSON.stringify(payload));
}

export function assertSupabaseEnv(): string | null {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.error("[auth] NEXT_PUBLIC_SUPABASE_URL is missing");
    return "Sign-in isn’t available right now. Please try again later.";
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error("[auth] NEXT_PUBLIC_SUPABASE_ANON_KEY is missing");
    return "Sign-in isn’t available right now. Please try again later.";
  }
  try {
    new URL(process.env.NEXT_PUBLIC_SUPABASE_URL);
  } catch {
    console.error("[auth] NEXT_PUBLIC_SUPABASE_URL is not a valid URL");
    return "Sign-in isn’t available right now. Please try again later.";
  }
  return null;
}

/** User-facing auth error copy (technical detail stays in server logs). */
export function publicAuthErrorMessage(error: unknown): string {
  return friendlyAuthError(error);
}
