import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/ui";
import { CountUp } from "@/components/count-up";
import { AboutTabs } from "@/components/about-tabs";
import { L } from "@/components/locale-link";
import { SITE } from "@/lib/site";
import { isLocale, defaultLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Metadata {
  const locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const d = getDictionary(locale).pages.about;
  return buildMetadata({
    locale,
    title: d.metaTitle,
    description: d.metaDescription,
    path: "/about",
    og: "about",
  });
}

function parseStat(v: string): { to: number; suffix: string } {
  const m = v.match(/^(\d+)(.*)$/);
  return { to: m ? parseInt(m[1], 10) : 0, suffix: m ? m[2] : "" };
}

export default function AboutPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const t = getDictionary(locale).pages.about;

  return (
    <>
      <PageHero
        eyebrow={t.heroEyebrow}
        title={t.heroTitle}
        body={t.heroBody}
        image="/img/about-hero.jpg"
        alt="About OSAKA Workation — remote work and community in Osaka, Japan"
      />

      {/* BRAND LOCKUP */}
      <section className="container-page py-14 sm:py-16">
        <div className="flex flex-col items-center gap-6 rounded-3xl border border-paper-line bg-white px-6 py-12 text-center">
          <Image
            src="/logo/logo-orange.png"
            alt={SITE.name}
            width={420}
            height={200}
            priority
            className="h-20 w-auto sm:h-24"
          />
          <p className="text-lg font-semibold text-brand-ink">{t.lockupTagline}</p>
          <p className="max-w-xl text-sm leading-relaxed text-muted">
            {t.lockupTaglineSub}
          </p>
          <div className="mt-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-orange">
            <span className="h-px w-8 bg-brand-orange/40" />
            {t.lockupEst}
            <span className="h-px w-8 bg-brand-orange/40" />
          </div>
        </div>
      </section>

      {/* WHO WE ARE */}
      <section className="container-page py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <span className="eyebrow">{t.whoEyebrow}</span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-brand-ink sm:text-4xl">
              {t.whoTitle}
            </h2>
            <div className="mt-5 space-y-4 leading-relaxed text-muted">
              <p>{t.whoBody1}</p>
              <p>{t.whoBody2}</p>
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-paper-line">
            <Image
              src="/img/about-cafe.jpg"
              alt="Working remotely from a cosy cafe in Osaka, Japan"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* NUMBERS */}
      <section className="border-y border-paper-line bg-white">
        <div className="container-page py-16 sm:py-20">
          <div className="grid gap-6 sm:grid-cols-3">
            {t.stats.map((s) => {
              const { to, suffix } = parseStat(s.v);
              return (
                <div
                  key={s.l}
                  className="rounded-3xl border border-paper-line bg-paper-cream p-8 text-center"
                >
                  <CountUp
                    to={to}
                    suffix={suffix}
                    className="block text-5xl font-extrabold tracking-tight text-brand-orange"
                  />
                  <p className="mx-auto mt-2 max-w-[16rem] text-sm text-muted">
                    {s.l}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className="container-page py-16 sm:py-20">
        <SectionHeading eyebrow={t.doEyebrow} title={t.doTitle} body={t.doBody} />
        <div className="mt-12">
          <AboutTabs />
        </div>
      </section>

      {/* JOIN / PARTNER */}
      <section className="border-t border-paper-line bg-paper-sand">
        <div className="container-page py-16 sm:py-20">
          <SectionHeading eyebrow={t.partnerEyebrow} title={t.partnerTitle} />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {t.audience.map((a) => (
              <div
                key={a.title}
                className="rounded-3xl border border-paper-line bg-white p-7"
              >
                <h3 className="text-lg font-bold text-brand-ink">{a.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {a.body}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
            >
              {t.followInstagram} <ArrowRight className="h-4 w-4" />
            </a>
            <L href="/contact#partner" className="btn-ghost">
              {t.partnerWithUs}
            </L>
          </div>
        </div>
      </section>
    </>
  );
}
