"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { L } from "@/components/locale-link";
import { useI18n } from "@/components/i18n-provider";

type AuthOnlyNavLinkProps = {
  className: (active: boolean) => string;
};

/** Nav item visible only when the user has a session. */
export function AuthOnlyNavLink({ className }: AuthOnlyNavLinkProps) {
  const { locale, dict } = useI18n();
  const pathname = usePathname();
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return;

    const supabase = createClient();
    let mounted = true;

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

  if (!signedIn) return null;

  const href = "/join";
  const full = `/${locale}${href}`;
  const active = pathname === full || pathname.startsWith(`${full}/`);

  return (
    <L href={href} className={className(active)}>
      {dict.nav.join}
    </L>
  );
}
