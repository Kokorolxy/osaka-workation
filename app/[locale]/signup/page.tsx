import type { Metadata } from "next";
import Link from "next/link";
import { signUp } from "@/lib/auth/actions";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { friendlyAuthError } from "@/lib/errors/user-message";
import { FeedbackBanner } from "@/components/feedback-banner";

export const metadata: Metadata = {
  title: "Sign up",
  robots: { index: false, follow: false },
};

export default function SignupPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: { error?: string };
}) {
  const locale: Locale = isLocale(params.locale)
    ? params.locale
    : defaultLocale;
  const errorMessage = searchParams.error
    ? friendlyAuthError(searchParams.error)
    : null;

  return (
    <main className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_top,_rgba(234,85,4,0.12),_transparent_60%)]"
      />
      <div className="container-page relative flex min-h-[70vh] items-center justify-center py-24">
        <div className="w-full max-w-md rounded-3xl border border-paper-line bg-white p-8 shadow-[0_24px_50px_-36px_rgba(15,15,15,0.35)]">
          <p className="eyebrow">Account</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-brand-ink">
            Create account
          </h1>
          <p className="mt-2 text-sm text-muted">
            New accounts start as members. Admins are promoted separately.
          </p>

          <form action={signUp} className="mt-8 space-y-4">
            <input type="hidden" name="locale" value={locale} />

            <label className="block text-sm font-medium text-brand-ink">
              Display name
              <input
                type="text"
                name="display_name"
                autoComplete="name"
                className="mt-1.5 w-full rounded-xl border border-paper-line bg-paper-cream/50 px-4 py-3 text-brand-ink outline-none ring-brand-orange transition focus:ring-2"
              />
            </label>

            <label className="block text-sm font-medium text-brand-ink">
              Email
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                className="mt-1.5 w-full rounded-xl border border-paper-line bg-paper-cream/50 px-4 py-3 text-brand-ink outline-none ring-brand-orange transition focus:ring-2"
              />
            </label>

            <label className="block text-sm font-medium text-brand-ink">
              Password
              <input
                type="password"
                name="password"
                required
                minLength={6}
                autoComplete="new-password"
                className="mt-1.5 w-full rounded-xl border border-paper-line bg-paper-cream/50 px-4 py-3 text-brand-ink outline-none ring-brand-orange transition focus:ring-2"
              />
            </label>

            <button type="submit" className="btn-primary w-full">
              Sign up
            </button>
          </form>

          {errorMessage ? (
            <div className="mt-3">
              <FeedbackBanner variant="error">{errorMessage}</FeedbackBanner>
            </div>
          ) : null}

          <p className="mt-6 text-center text-sm text-muted">
            Already have an account?{" "}
            <Link
              href={`/${locale}/login`}
              className="font-semibold text-brand-orange hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
