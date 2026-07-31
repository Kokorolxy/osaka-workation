"use client";

import { type ReactNode } from "react";
import { L } from "@/components/locale-link";
import { useI18n } from "@/components/i18n-provider";
import { useAuthState } from "@/components/auth-state-provider";

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
  const { signedIn } = useAuthState();

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
