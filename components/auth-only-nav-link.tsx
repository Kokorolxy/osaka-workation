"use client";

import { usePathname } from "next/navigation";
import { L } from "@/components/locale-link";
import { useI18n } from "@/components/i18n-provider";
import { useAuthState } from "@/components/auth-state-provider";

type AuthOnlyNavLinkProps = {
  className: (active: boolean) => string;
};

/** Nav item visible only when the user has a session. */
export function AuthOnlyNavLink({ className }: AuthOnlyNavLinkProps) {
  const { locale, dict } = useI18n();
  const pathname = usePathname();
  const { signedIn } = useAuthState();

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
