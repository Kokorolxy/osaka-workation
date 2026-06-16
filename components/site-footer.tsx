import Link from "next/link";
import Image from "next/image";
import { Instagram, MessageCircle, Mail } from "lucide-react";
import { SITE } from "@/lib/site";

const COLUMNS = [
  {
    title: "Explore",
    links: [
      { label: "Stays", href: "/stays" },
      { label: "Events", href: "/events" },
      { label: "Community", href: "/community" },
      { label: "Workation 2026", href: "/events#workation" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Discord", href: SITE.discord, external: true },
      { label: "Meetups", href: "/events#meetups" },
      { label: "Instagram", href: SITE.instagram, external: true },
      { label: "Newsletter", href: "/#newsletter" },
    ],
  },
  {
    title: "Info",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/contact#faq" },
      { label: "Partner with us", href: "/contact#partner" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-ink-border bg-ink-900">
      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-xs">
            <Image
              src="/logo/logo-orange.png"
              alt={SITE.name}
              width={200}
              height={95}
              className="h-12 w-auto"
            />
            <p className="mt-4 text-sm leading-relaxed text-white/55">
              Building Japan&apos;s friendliest international digital nomad
              community — one onigiri at a time.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-brand-orange hover:text-brand-orange"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={SITE.discord}
                target="_blank"
                rel="noreferrer"
                aria-label="Discord"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-brand-orange hover:text-brand-orange"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <a
                href={`mailto:${SITE.email}`}
                aria-label="Email"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-brand-orange hover:text-brand-orange"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-white">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-3 text-sm">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="link-muted"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href} className="link-muted">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-ink-border pt-6 text-xs text-white/45 sm:flex-row">
          <p>© {new Date().getFullYear()} Osaka Workation. Made with care in Osaka 大阪.</p>
          <p>{SITE.instagramHandle}</p>
        </div>
      </div>
    </footer>
  );
}
