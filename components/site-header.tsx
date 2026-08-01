"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { SITE } from "@/lib/site";
import { useI18n } from "@/components/i18n-provider";
import { L } from "@/components/locale-link";
import { LanguageSwitcher } from "@/components/language-switcher";
import { AuthNav, HEADER_CHIP } from "@/components/auth-nav";
import { AuthOnlyNavLink } from "@/components/auth-only-nav-link";
import { JoinEventCta } from "@/components/join-event-cta";
import { DiscordIcon } from "@/components/discord-icon";

export function SiteHeader() {
  const { locale, dict } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  const pages = [
    { href: "/", label: dict.nav.home },
    { href: "/events", label: dict.nav.events },
    { href: "/community", label: dict.nav.community },
    { href: "/blog", label: dict.nav.blog },
    { href: "/about", label: dict.nav.about },
    { href: "/faq", label: dict.nav.faq },
    { href: "/contact", label: dict.nav.contact },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!drawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [drawerOpen]);

  const isActive = (href: string) => {
    const full = `/${locale}${href === "/" ? "" : href}`;
    return href === "/"
      ? pathname === full || pathname === `/${locale}`
      : pathname === full || pathname.startsWith(`${full}/`);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          scrolled || drawerOpen
            ? "border-b border-paper-line bg-paper-cream/90 backdrop-blur"
            : "border-b border-transparent bg-paper-cream/30 backdrop-blur-sm"
        }`}
      >
        <div className="container-page flex h-16 items-center justify-between gap-3">
          <L
            href="/"
            className="flex shrink-0 items-center gap-2.5"
            aria-label={SITE.name}
          >
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
              <span className="hidden text-[9px] font-semibold uppercase tracking-[0.22em] text-brand-orange sm:block">
                Digital Nomads Workation
              </span>
            </span>
          </L>

          <div className="flex min-w-0 flex-1 items-center justify-center px-2">
            <JoinEventCta />
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>
            <a
              href={SITE.discord}
              target="_blank"
              rel="noreferrer"
              className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border border-brand-ink/15 bg-white text-brand-ink transition-colors hover:border-brand-orange/40 hover:text-brand-orange sm:inline-flex"
              aria-label={dict.actions.joinDiscord}
              title={dict.actions.joinDiscord}
            >
              <DiscordIcon className="block h-[15px] w-[15px] shrink-0" />
            </a>
            <div className="hidden sm:block">
              <AuthNav />
            </div>
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-brand-ink/15 bg-white text-brand-ink transition-colors hover:border-brand-orange/40 hover:text-brand-orange"
              aria-label={dict.actions.menu}
              aria-expanded={drawerOpen}
              aria-controls="site-side-menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-brand-ink/35 transition-opacity duration-300 ${
          drawerOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!drawerOpen}
        onClick={() => setDrawerOpen(false)}
      />

      {/* Side menu */}
      <aside
        id="site-side-menu"
        role="dialog"
        aria-modal="true"
        aria-label={dict.nav.menuTitle}
        className={`fixed inset-y-0 right-0 z-[70] flex w-[min(20rem,88vw)] flex-col border-l border-paper-line bg-paper-cream shadow-[-18px_0_40px_-28px_rgba(15,15,15,0.45)] transition-transform duration-300 ease-out ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-paper-line px-5 py-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-orange">
            {dict.nav.menuTitle}
          </p>
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-brand-ink/15 text-brand-ink"
            aria-label={dict.actions.closeMenu}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {pages.map((item) => (
            <L
              key={item.href}
              href={item.href}
              className={`block rounded-xl px-3 py-3 text-base font-medium transition-colors ${
                isActive(item.href)
                  ? "bg-brand-orange/10 text-brand-orange"
                  : "text-brand-ink/80 hover:bg-brand-ink/5 hover:text-brand-ink"
              }`}
            >
              {item.label}
            </L>
          ))}
          <AuthOnlyNavLink
            className={(active) =>
              `block rounded-xl px-3 py-3 text-base font-medium transition-colors ${
                active
                  ? "bg-brand-orange/10 text-brand-orange"
                  : "text-brand-ink/80 hover:bg-brand-ink/5 hover:text-brand-ink"
              }`
            }
          />
        </nav>

        <div className="space-y-3 border-t border-paper-line px-5 py-5">
          <div className="flex flex-wrap items-center gap-2 sm:hidden">
            <LanguageSwitcher />
            <AuthNav />
          </div>
          <a
            href={SITE.discord}
            target="_blank"
            rel="noreferrer"
            className={`${HEADER_CHIP} w-full justify-center`}
          >
            <DiscordIcon className="block h-3.5 w-3.5 shrink-0" />
            {dict.actions.joinDiscord}
          </a>
          <p className="text-xs leading-relaxed text-muted">
            {dict.nav.joinCtaHint}
          </p>
        </div>
      </aside>
    </>
  );
}
