import type { Metadata } from "next";
import Link from "next/link";
import { signUp } from "@/lib/auth/actions";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { friendlyAuthError } from "@/lib/errors/user-message";
import { FeedbackBanner } from "@/components/feedback-banner";
import { AuthSignupForm } from "@/components/auth-signup-form";

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
            {auth.signUpTitle}
          </h1>
          <p className="mt-2 text-sm text-muted">{auth.signUpBody}</p>

          <AuthSignupForm locale={locale} auth={auth} action={signUp} />

          {errorMessage ? (
            <div className="mt-3">
              <FeedbackBanner variant="error">{errorMessage}</FeedbackBanner>
            </div>
          ) : null}

          <p className="mt-6 text-center text-sm text-muted">
            {auth.hasAccount}{" "}
            <Link
              href={`/${locale}/login`}
              className="font-semibold text-brand-orange hover:underline"
            >
              {auth.signIn}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
