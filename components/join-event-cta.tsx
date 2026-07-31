"use client";

import { Sparkles } from "lucide-react";
import { L } from "@/components/locale-link";
import { useI18n } from "@/components/i18n-provider";
import { useAuthState } from "@/components/auth-state-provider";

/**
 * Charismatic Join CTA for the main header.
 * Signed out → sign in (then Join). Signed in → Join page.
 */
export function JoinEventCta({ className }: { className?: string }) {
  const { locale, dict } = useI18n();
  const { signedIn, ready } = useAuthState();

  const base =
    className ??
    "inline-flex h-9 items-center justify-center gap-1.5 rounded-full bg-brand-orange px-4 text-xs font-semibold text-white transition-colors hover:bg-brand-orangeHover focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-paper-cream";

  if (!ready) {
    return (
      <span className={`${base} opacity-70`} aria-hidden>
        <Sparkles className="h-3.5 w-3.5" />
        {dict.nav.joinCta}
      </span>
    );
  }

  if (signedIn) {
    return (
      <L href="/join" className={base} title={dict.nav.join}>
        <Sparkles className="h-3.5 w-3.5" />
        {dict.nav.joinCta}
      </L>
    );
  }

  const next = `/${locale}/join`;
  return (
    <L
      href={`/login?next=${encodeURIComponent(next)}`}
      className={base}
      title={dict.nav.joinCtaHint}
    >
      <Sparkles className="h-3.5 w-3.5" />
      {dict.nav.joinCta}
    </L>
  );
}
