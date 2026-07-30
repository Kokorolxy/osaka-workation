"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import { L } from "@/components/locale-link";
import { useI18n } from "@/components/i18n-provider";

type WaitlistOrJoinLinkProps = {
  waitlistHref: string;
  className?: string;
  title?: string;
  onClick?: () => void;
  children: ReactNode;
};

export function WaitlistOrJoinLink({
  waitlistHref,
  className,
  title,
  onClick,
  children,
}: WaitlistOrJoinLinkProps) {
  const { locale } = useI18n();
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return;

    const supabase = createClient();
    let mounted = true;

    void supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      setSignedIn(!!data.user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(!!session?.user);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <L
      href={
        signedIn
          ? "/account"
          : `/login?next=${encodeURIComponent(`/${locale}/account`)}`
      }
      className={className}
      title={title}
      onClick={onClick}
    >
      {children}
    </L>
  );
}
