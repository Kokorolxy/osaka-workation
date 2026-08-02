import type { Metadata } from "next";
import { Instagram, MessageCircle, Mail, Link2 } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/ui";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { isLocale, defaultLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Metadata {
  const locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const d = getDictionary(locale).pages.contact;
  return buildMetadata({
    locale,
    title: d.metaTitle,
    description: d.metaDescription,
    path: "/contact",
    og: "contact",
  });
}

export default function ContactPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const dict = getDictionary(locale);
  const t = dict.pages.contact;

  return (
    <>
      <PageHero
        eyebrow={t.heroEyebrow}
        title={t.heroTitle}
        body={t.heroBody}
        image="/img/contact-hero.jpg"
        alt="Contact OSAKA Workation — digital nomad community in Osaka, Japan"
      />

      <section className="container-page py-16 sm:py-20">
        <div className="mx-auto max-w-5xl space-y-8">
          <div>
            <SectionHeading eyebrow={t.reachEyebrow} title={t.reachTitle} />
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <ContactRow
                icon={<MessageCircle className="h-5 w-5 text-brand-orange" />}
                title="Discord"
                value={t.discordValue}
                href={SITE.discord}
              />
              <ContactRow
                icon={<Instagram className="h-5 w-5 text-brand-orange" />}
                title="Instagram"
                value={SITE.instagramHandle}
                href={SITE.instagram}
              />
              <ContactRow
                icon={<Mail className="h-5 w-5 text-brand-orange" />}
                title={t.emailTitle}
                value={SITE.email}
                href={`mailto:${SITE.email}`}
              />
              <ContactRow
                icon={<Link2 className="h-5 w-5 text-brand-orange" />}
                title={t.linksTitle}
                value="linktr.ee/osakaworkation"
                href={SITE.linktree}
              />
            </div>

            <div
              id="partner"
              className="mt-8 scroll-mt-24 rounded-3xl border border-brand-orange/30 bg-brand-orange/10 p-7"
            >
              <h3 className="text-lg font-bold text-brand-ink">
                {t.partnerTitle}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {t.partnerBody}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ContactRow({
  icon,
  title,
  value,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noreferrer"
      className="flex items-center gap-4 rounded-2xl border border-paper-line bg-white p-5 transition-colors hover:border-brand-orange/40"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-orange/15">
        {icon}
      </span>
      <span>
        <span className="block font-semibold text-brand-ink">{title}</span>
        <span className="block text-sm text-muted">{value}</span>
      </span>
    </a>
  );
}
