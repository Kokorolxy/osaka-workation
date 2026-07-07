import Image from "next/image";
import { Instagram, MessageCircle, Mail, Link2 } from "lucide-react";
import { SITE } from "@/lib/site";
import { L } from "@/components/locale-link";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";

export function SiteFooter({ dict }: { dict: Dictionary }) {
  const f = dict.footer.links;

  const columns = [
    {
      title: dict.footer.colExplore,
      links: [
        { label: f.stays, href: "/stays" },
        { label: f.events, href: "/events" },
        { label: f.community, href: "/community" },
        { label: f.blog, href: "/blog" },
        { label: f.workation2026, href: "/events#workation" },
      ],
    },
    {
      title: dict.footer.colCommunity,
      links: [
        { label: f.discord, href: SITE.discord, external: true },
        { label: f.meetups, href: "/events#meetups" },
        { label: f.instagram, href: SITE.instagram, external: true },
        { label: f.allLinks, href: SITE.linktree, external: true },
      ],
    },
    {
      title: dict.footer.colInfo,
      links: [
        { label: f.about, href: "/about" },
        { label: f.contact, href: "/contact" },
        { label: f.faq, href: "/contact#faq" },
        { label: f.partner, href: "/contact#partner" },
      ],
    },
  ];

  return (
    <footer className="border-t border-paper-line bg-white">
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
            <p className="mt-4 text-sm leading-relaxed text-muted">
              {dict.footer.blurb}
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-paper-line text-muted transition-colors hover:border-brand-orange hover:text-brand-orange"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={SITE.discord}
                target="_blank"
                rel="noreferrer"
                aria-label="Discord"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-paper-line text-muted transition-colors hover:border-brand-orange hover:text-brand-orange"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <a
                href={`mailto:${SITE.email}`}
                aria-label="Email"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-paper-line text-muted transition-colors hover:border-brand-orange hover:text-brand-orange"
              >
                <Mail className="h-4 w-4" />
              </a>
              <a
                href={SITE.linktree}
                target="_blank"
                rel="noreferrer"
                aria-label="Linktree"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-paper-line text-muted transition-colors hover:border-brand-orange hover:text-brand-orange"
              >
                <Link2 className="h-4 w-4" />
              </a>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-brand-ink">
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
                      <L href={link.href} className="link-muted">
                        {link.label}
                      </L>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-paper-line pt-6 text-xs text-muted sm:flex-row">
          <p>
            © {new Date().getFullYear()} Osaka Workation. {dict.footer.madeIn}
          </p>
          <p>{SITE.instagramHandle}</p>
        </div>
      </div>
    </footer>
  );
}
