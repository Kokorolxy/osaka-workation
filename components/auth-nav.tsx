"use client";

import { LogIn, User } from "lucide-react";
import { L } from "@/components/locale-link";
import { useI18n } from "@/components/i18n-provider";
import { useAuthState } from "@/components/auth-state-provider";

/** Shared size/style for language, Discord, and Sign in header chips */
export const HEADER_CHIP =
  "inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-brand-ink/15 bg-white px-3 text-xs font-semibold text-brand-ink transition-colors hover:border-brand-orange/40 hover:text-brand-orange";

type AuthNavProps = {
  className?: string;
  iconClassName?: string;
};

export function AuthNav({ className, iconClassName }: AuthNavProps) {
  const { dict } = useI18n();
  const { signedIn } = useAuthState();

  if (signedIn) {
    return (
      <L
        href="/account"
        className={iconClassName ?? HEADER_CHIP}
        aria-label={dict.pages.auth.accountAria}
      >
        <User className="h-3.5 w-3.5" />
      </L>
    );
  }

  return (
    <L href="/login" className={className ?? HEADER_CHIP}>
      <LogIn className="h-3.5 w-3.5" />
      {dict.pages.auth.signIn}
    </L>
  );
}
