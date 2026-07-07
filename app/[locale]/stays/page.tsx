import type { Metadata } from "next";
import { Star, Wifi, BedDouble } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { CTAStrip, SectionHeading } from "@/components/ui";
import { StaysExplorer } from "@/components/stays-explorer";
import { buildMetadata } from "@/lib/seo";
import { isLocale, defaultLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Metadata {
  const locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const d = getDictionary(locale).pages.stays;
  return buildMetadata({
    locale,
    title: d.metaTitle,
    description: d.metaDescription,
    path: "/stays",
    og: "stays",
  });
}

export default function StaysPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const t = getDictionary(locale).pages.stays;

  const includeIcons = [
    <Wifi key="w" className="h-5 w-5 text-brand-orange" />,
    <BedDouble key="b" className="h-5 w-5 text-brand-orange" />,
    <Star key="s" className="h-5 w-5 text-brand-orange" />,
  ];

  return (
    <>
      <PageHero
        eyebrow={t.heroEyebrow}
        title={t.heroTitle}
        body={t.heroBody}
        image="/stays/stay-hero.jpg"
        alt="Curated stays and accommodation in Osaka, Japan for digital nomads"
      />

      <section className="container-page py-16 sm:py-20">
        <div className="mb-8 max-w-2xl">
          <span className="eyebrow">{t.introEyebrow}</span>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-brand-ink sm:text-3xl">
            {t.introTitle}
          </h2>
          <p className="mt-3 text-muted">{t.introBody}</p>
        </div>

        <StaysExplorer />
      </section>

      <section className="border-y border-paper-line bg-white">
        <div className="container-page py-16 sm:py-20">
          <SectionHeading
            align="center"
            eyebrow={t.includesEyebrow}
            title={t.includesTitle}
          />
          <div className="mx-auto mt-12 grid max-w-4xl gap-5 sm:grid-cols-3">
            {t.includes.map((f, i) => (
              <div
                key={f.title}
                className="rounded-2xl border border-paper-line bg-paper-cream p-6 text-center"
              >
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-brand-orange/10">
                  {includeIcons[i]}
                </div>
                <h3 className="mt-4 font-bold text-brand-ink">{f.title}</h3>
                <p className="mt-2 text-sm text-muted">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTAStrip
        title={t.ctaTitle}
        body={t.ctaBody}
        primaryHref="/events#workation"
        primaryLabel={t.ctaPrimary}
        secondaryHref="/contact"
        secondaryLabel={t.ctaSecondary}
      />
    </>
  );
}
