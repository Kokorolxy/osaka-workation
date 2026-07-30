"use client";

import { usePathname } from "next/navigation";
import { L } from "@/components/locale-link";

const ADMIN_NAV = [
  { href: "/admin", label: "Overview", match: (path: string) => /\/admin\/?$/.test(path) },
  {
    href: "/admin/users",
    label: "Users",
    match: (path: string) => path.includes("/admin/users"),
  },
  {
    href: "/admin/registrations",
    label: "Registrations",
    match: (path: string) => path.includes("/admin/registrations"),
  },
] as const;

export function AdminNav() {
  const pathname = usePathname() ?? "";

  return (
    <nav className="flex flex-wrap gap-2">
      {ADMIN_NAV.map((item) => {
        const active = item.match(pathname);
        return (
          <L
            key={item.href}
            href={item.href}
            className={`inline-flex h-9 items-center rounded-full border px-4 text-xs font-semibold transition-colors ${
              active
                ? "border-brand-orange bg-brand-orange/10 text-brand-orange"
                : "border-brand-ink/15 bg-white text-brand-ink hover:border-brand-orange/40 hover:text-brand-orange"
            }`}
          >
            {item.label}
          </L>
        );
      })}
      <L
        href="/account"
        className="inline-flex h-9 items-center rounded-full px-4 text-xs font-semibold text-muted transition-colors hover:text-brand-ink"
      >
        Account
      </L>
    </nav>
  );
}
