"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { LogIn, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { L } from "@/components/locale-link";

/** Shared size/style for language, Discord, and Sign in header chips */
export const HEADER_CHIP =
  "inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-brand-ink/15 bg-white px-3 text-xs font-semibold text-brand-ink transition-colors hover:border-brand-orange/40 hover:text-brand-orange";

type AuthNavProps = {
  className?: string;
  iconClassName?: string;
};

export function AuthNav({ className, iconClassName }: AuthNavProps) {
  const pathname = usePathname();
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return;

    const supabase = createClient();
    let mounted = true;

    // Server-action login/logout sets cookies without firing the browser
    // auth listener, so re-check on every navigation.
    const sync = () => {
      void supabase.auth.getUser().then(({ data }) => {
        if (mounted) setSignedIn(!!data.user);
      });
    };

    sync();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(!!session?.user);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [pathname]);

  if (signedIn) {
    return (
      <L
        href="/account"
        className={iconClassName ?? HEADER_CHIP}
        aria-label="Account"
      >
        <User className="h-3.5 w-3.5" />
      </L>
    );
  }

  return (
    <L href="/login" className={className ?? HEADER_CHIP}>
      <LogIn className="h-3.5 w-3.5" />
      Sign in
    </L>
  );
}
