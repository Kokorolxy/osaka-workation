import type { Metadata } from "next";
import Link from "next/link";
import { signIn } from "@/lib/auth/actions";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { friendlyAuthError } from "@/lib/errors/user-message";
import { FeedbackBanner } from "@/components/feedback-banner";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default function LoginPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: { error?: string; message?: string; next?: string };
}) {
  const locale: Locale = isLocale(params.locale)
    ? params.locale
    : defaultLocale;
  const auth = getDictionary(locale).pages.auth;
  const errors = getDictionary(locale).ui.errors;
  const errorMessage = searchParams.error
    ? friendlyAuthError(searchParams.error, errors)
    : null;

  return (
    <main className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_top,_rgba(234,85,4,0.12),_transparent_60%)]"
      />
      <div className="container-page relative flex min-h-[70vh] items-center justify-center py-24">
        <div className="w-full max-w-md rounded-3xl border border-paper-line bg-white p-8 shadow-[0_24px_50px_-36px_rgba(15,15,15,0.35)]">
          <p className="eyebrow">{auth.eyebrow}</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-brand-ink">
            {auth.signInTitle}
          </h1>
          <p className="mt-2 text-sm text-muted">{auth.signInBody}</p>

          <form action={signIn} className="mt-8 space-y-4">
            <input type="hidden" name="locale" value={locale} />
            <input
              type="hidden"
              name="next"
              value={searchParams.next ?? `/${locale}/account`}
            />

            <label className="block text-sm font-medium text-brand-ink">
              {auth.email}
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                className="mt-1.5 w-full rounded-xl border border-paper-line bg-paper-cream/50 px-4 py-3 text-brand-ink outline-none ring-brand-orange transition focus:ring-2"
              />
            </label>

            <label className="block text-sm font-medium text-brand-ink">
              {auth.password}
              <input
                type="password"
                name="password"
                required
                minLength={6}
                autoComplete="current-password"
                className="mt-1.5 w-full rounded-xl border border-paper-line bg-paper-cream/50 px-4 py-3 text-brand-ink outline-none ring-brand-orange transition focus:ring-2"
              />
            </label>

            <button type="submit" className="btn-primary w-full">
              {auth.signIn}
            </button>
          </form>

          {searchParams.message ? (
            <div className="mt-3">
              <FeedbackBanner variant="success">
                {searchParams.message}
              </FeedbackBanner>
            </div>
          ) : null}

          {errorMessage ? (
            <div className="mt-3">
              <FeedbackBanner variant="error">{errorMessage}</FeedbackBanner>
            </div>
          ) : null}

          <p className="mt-6 text-center text-sm text-muted">
            {auth.noAccount}{" "}
            <Link
              href={`/${locale}/signup`}
              className="font-semibold text-brand-orange hover:underline"
            >
              {auth.createOne}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
