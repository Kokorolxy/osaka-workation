import Image from "next/image";
import { ArrowRight, ArrowUpRight, Wifi } from "lucide-react";
import { Marquee } from "@/components/marquee";
import { SectionHeading } from "@/components/ui";
import { FeatureIcon } from "@/components/feature-icon";
import { Countdown } from "@/components/countdown";
import { Newsletter } from "@/components/newsletter";
import { HeroHighlights } from "@/components/hero-highlights";
import { FoodCard } from "@/components/food-card";
import { L } from "@/components/locale-link";
import { SITE } from "@/lib/site";
import { isLocale, defaultLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export default function HomePage({ params }: { params: { locale: string } }) {
  const locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const dict = getDictionary(locale);
  const t = dict.pages.home;
  const w = dict.data.workation;

  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="relative isolate flex min-h-[94vh] items-center overflow-hidden">
        <Image
          src="/img/hero-osaka.jpg"
          alt="Dotonbori canal, Osaka, Japan — OSAKA digital nomad Workation"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="hero-scrim absolute inset-0" />

        <div className="container-page relative z-10 grid gap-10 pb-16 pt-28 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-orange/30 bg-white/80 px-4 py-1.5 text-xs font-semibold tracking-wide text-brand-orange backdrop-blur">
              {t.heroBadge}
            </span>
            <h1 className="mt-6 text-5xl font-extrabold leading-[0.95] tracking-tight text-brand-ink sm:text-6xl lg:text-7xl">
              {t.heroTitle[0]}
              <br />
              {t.heroTitle[1]}
              <br />
              <span className="text-brand-orange">{t.heroTitle[2]}</span>
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-brand-ink/80">
              {t.heroSubtitle}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <L href="/events#workation" className="btn-primary">
                {t.heroJoinWorkation} <ArrowRight className="h-4 w-4" />
              </L>
              <a
                href={SITE.discord}
                target="_blank"
                rel="noreferrer"
                className="btn-light"
              >
                {dict.actions.joinDiscord} <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="animate-fade-up">
            <HeroHighlights />
          </div>
        </div>
      </section>

      <Marquee />

      {/* ---------- WHY OSAKA ---------- */}
      <section className="container-page py-20 sm:py-24">
        <SectionHeading eyebrow={t.whyEyebrow} title={t.whyTitle} body={t.whyBody} />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {dict.data.whyOsaka.map((item) => (
            <div key={item.title} className="card card-hover p-6">
              <FeatureIcon name={item.icon} />
              <h3 className="mt-4 text-lg font-bold text-brand-ink">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- NOVEMBER WORKATION FEATURE ---------- */}
      <section className="border-y border-paper-line bg-white">
        <div className="container-page grid gap-10 py-20 sm:py-24 lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-paper-line">
            <Image
              src="/img/workation-feature.jpg"
              alt="November Workation event — Osaka digital nomad community in Japan"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <span className="absolute left-4 top-4 rounded-full bg-brand-orange px-3 py-1 text-xs font-bold text-white">
              {w.recruiting}
            </span>
          </div>

          <div>
            <span className="eyebrow">{t.flagshipEyebrow}</span>
            <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-brand-ink sm:text-5xl">
              {w.title}
            </h2>
            <p className="mt-3 text-lg font-semibold text-brand-orange">
              {w.duration} · {w.dates} · {w.capacity}
            </p>
            <p className="mt-4 max-w-md leading-relaxed text-muted">{w.pitch}</p>

            <div className="mt-7">
              <Countdown />
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <L href="/events#workation" className="btn-primary">
                {t.seeProgramme} <ArrowRight className="h-4 w-4" />
              </L>
              <L href="/#newsletter" className="btn-ghost">
                {t.joinWaitlist}
              </L>
            </div>

            <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-brand-ink/80">
              {w.includes.map((i) => (
                <li key={i.title} className="flex items-center gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
                  {i.title}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---------- DISTRICTS ---------- */}
      <section className="container-page py-20 sm:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow={t.districtsEyebrow}
            title={t.districtsTitle}
            body={t.districtsBody}
          />
          <L
            href="/stays"
            className="hidden items-center gap-1 text-sm font-semibold text-brand-orange hover:text-brand-orangeHover sm:inline-flex"
          >
            {dict.ui.common.browseAllStays} <ArrowRight className="h-4 w-4" />
          </L>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {dict.data.districts.map((d) => (
            <L
              key={d.name}
              href="/stays"
              className="group relative overflow-hidden rounded-3xl border border-paper-line"
            >
              <div className="relative aspect-[4/5]">
                <Image
                  src={d.image}
                  alt={d.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/85 via-brand-ink/25 to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-6">
                <div className="text-sm font-semibold text-brand-orange">
                  {d.kanji}
                </div>
                <h3 className="mt-1 text-2xl font-bold text-white">{d.name}</h3>
                <p className="mt-2 text-sm text-white/85">{d.body}</p>
              </div>
            </L>
          ))}
        </div>
      </section>

      {/* ---------- TASTE OF OSAKA ---------- */}
      <section className="border-y border-paper-line bg-paper-sand">
        <div className="container-page py-20 sm:py-24">
          <SectionHeading
            eyebrow={t.foodEyebrow}
            title={t.foodTitle}
            body={t.foodBody}
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            {dict.data.food.map((f) => (
              <FoodCard key={f.label} food={f} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------- COMMUNITY PREVIEW ---------- */}
      <section className="container-page py-20 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="eyebrow">{t.communityEyebrow}</span>
            <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-brand-ink sm:text-5xl">
              {t.communityTitle}
            </h2>
            <p className="mt-4 max-w-md leading-relaxed text-muted">
              {t.communityBody}
            </p>
            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-paper-line bg-white p-4">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-3 w-3 animate-ping rounded-full bg-brand-orange/60" />
                <span className="inline-flex h-3 w-3 rounded-full bg-brand-orange" />
              </span>
              <span className="text-sm text-muted">
                <b className="text-brand-ink">23</b> {t.onlineNow}
              </span>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={SITE.discord}
                target="_blank"
                rel="noreferrer"
                className="btn-primary"
              >
                {dict.actions.joinDiscord} <ArrowUpRight className="h-4 w-4" />
              </a>
              <L href="/community" className="btn-ghost">
                {t.meetCommunity}
              </L>
            </div>
            <div className="mt-8 flex items-center gap-2 text-sm text-muted">
              <Wifi className="h-4 w-4 text-brand-orange" /> {t.wifiNote}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              "/img/home-coworking.jpg",
              "/img/home-meetup.jpg",
              "/img/home-laptop.jpg",
              "/img/home-cafe.jpg",
            ].map((img) => (
              <div
                key={img}
                className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-paper-line"
              >
                <Image
                  src={img}
                  alt="Osaka digital nomad community — coworking and meetups"
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- NEWSLETTER ---------- */}
      <section id="newsletter" className="container-page pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-brand-ink px-6 py-14 text-center sm:px-14">
          <div className="absolute -left-16 -top-16 h-48 w-48 rounded-full bg-brand-orange/40 blur-3xl" />
          <span className="eyebrow relative">{t.newsletterEyebrow}</span>
          <h2 className="relative mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {t.newsletterTitle}
          </h2>
          <p className="relative mx-auto mt-4 max-w-lg text-white/70">
            {t.newsletterBody}
          </p>
          <div className="relative mx-auto mt-8 max-w-md">
            <Newsletter />
            <p className="mt-3 text-xs text-white/45">{t.newsletterCount}</p>
          </div>
        </div>
      </section>
    </>
  );
}
