"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { L } from "@/components/locale-link";
import { useI18n } from "@/components/i18n-provider";

/**
 * Charismatic Join CTA for the main header.
 * Signed out → sign in (then Join). Signed in → Join page.
 */
export function JoinEventCta({ className }: { className?: string }) {
  const { locale, dict } = useI18n();
  const pathname = usePathname();
  const [signedIn, setSignedIn] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      setReady(true);
      return;
    }

    const supabase = createClient();
    let mounted = true;

    const sync = () => {
      void supabase.auth.getUser().then(({ data }) => {
        if (!mounted) return;
        setSignedIn(!!data.user);
        setReady(true);
      });
    };

    sync();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(!!session?.user);
      setReady(true);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [pathname]);

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
