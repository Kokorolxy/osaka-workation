"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { SITE } from "@/lib/site";
import { useI18n } from "@/components/i18n-provider";
import { L } from "@/components/locale-link";
import { LanguageSwitcher } from "@/components/language-switcher";

export function SiteHeader() {
  const { locale, dict } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const nav = [
    { href: "/", label: dict.nav.home },
    { href: "/stays", label: dict.nav.stays },
    { href: "/events", label: dict.nav.events },
    { href: "/community", label: dict.nav.community },
    { href: "/blog", label: dict.nav.blog },
    { href: "/about", label: dict.nav.about },
    { href: "/contact", label: dict.nav.contact },
  ];

  const isActive = (href: string) => {
    const full = `/${locale}${href === "/" ? "" : href}`;
    return href === "/" ? pathname === full : pathname.startsWith(full);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open
          ? "border-b border-paper-line bg-paper-cream/85 backdrop-blur"
          : "border-b border-transparent bg-paper-cream/30 backdrop-blur-sm"
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between gap-3">
        <L href="/" className="flex items-center gap-2.5" aria-label={SITE.name}>
          <Image
            src="/logo/logo-mark-orange.png"
            alt=""
            width={28}
            height={50}
            className="h-8 w-auto"
            priority
          />
          <span className="flex flex-col leading-none">
            <span className="text-[15px] font-extrabold tracking-[0.18em] text-brand-ink">
              OSAKA
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-brand-orange">
              Digital Nomads Workation
            </span>
          </span>
        </L>

        <nav className="hidden items-center gap-0 lg:flex">
          {nav.map((item) => (
            <L
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap rounded-full px-2.5 py-2 text-[13px] font-medium transition-colors ${
                isActive(item.href)
                  ? "text-brand-orange"
                  : "text-brand-ink/70 hover:text-brand-ink"
              }`}
            >
              {item.label}
            </L>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          <LanguageSwitcher />
          <a
            href={SITE.discord}
            target="_blank"
            rel="noreferrer"
            className="btn-primary whitespace-nowrap !px-4 !py-2.5"
          >
            {dict.actions.joinDiscord} <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSwitcher />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-brand-ink/15 text-brand-ink"
            aria-label={dict.actions.menu}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-paper-line bg-paper-cream lg:hidden">
          <nav className="container-page flex flex-col py-4">
            {nav.map((item) => (
              <L
                key={item.href}
                href={item.href}
                className="rounded-xl px-3 py-3 text-base font-medium text-brand-ink/80 hover:bg-brand-ink/5 hover:text-brand-ink"
              >
                {item.label}
              </L>
            ))}
            <a
              href={SITE.discord}
              target="_blank"
              rel="noreferrer"
              className="btn-primary mt-3"
            >
              {dict.actions.joinDiscord} <ArrowUpRight className="h-4 w-4" />
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
