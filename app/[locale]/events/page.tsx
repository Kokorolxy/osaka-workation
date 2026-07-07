import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, Calendar, Users, Clock, Globe2 } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/ui";
import { Countdown } from "@/components/countdown";
import { Newsletter } from "@/components/newsletter";
import { Pricing } from "@/components/pricing";
import { IncludesGrid } from "@/components/includes-grid";
import { WorkationTimeline } from "@/components/workation-timeline";
import { MeetupCard } from "@/components/meetup-card";
import { PhotoWall } from "@/components/photo-wall";
import { JsonLd } from "@/components/json-ld";
import { L } from "@/components/locale-link";
import { isLocale, defaultLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Metadata {
  const locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const d = getDictionary(locale).pages.events;
  return buildMetadata({
    locale,
    title: d.metaTitle,
    description: d.metaDescription,
    path: "/events",
    og: "events",
  });
}

export default function EventsPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const dict = getDictionary(locale);
  const t = dict.pages.events;
  const w = dict.data.workation;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Event",
          name: w.title,
          description: w.pitch,
          startDate: "2026-11-02",
          endDate: "2026-11-15",
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          eventStatus: "https://schema.org/EventScheduled",
          location: {
            "@type": "Place",
            name: "Osaka, Japan",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Osaka",
              addressCountry: "JP",
            },
          },
          image: "https://osakaworkation.com/img/events-hero.jpg",
          organizer: {
            "@type": "Organization",
            name: "OSAKA Workation",
            url: "https://osakaworkation.com",
          },
          offers: {
            "@type": "Offer",
            price: "30000",
            priceCurrency: "JPY",
            url: "https://osakaworkation.com/events#pricing",
            availability: "https://schema.org/InStock",
          },
        }}
      />
      <PageHero
        eyebrow={t.heroEyebrow}
        title={t.heroTitle}
        body={t.heroBody}
        image="/img/events-hero.jpg"
        alt="Digital nomad events, meetups and the Workation in Osaka, Japan"
      />

      {/* WORKATION HERO BLOCK */}
      <section id="workation" className="container-page scroll-mt-24 py-16 sm:py-20">
        <div className="overflow-hidden rounded-3xl border border-paper-line bg-white">
          <div className="grid gap-8 p-8 sm:p-12 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-3 py-1 text-xs font-bold text-white">
                {w.recruiting}
              </span>
              <h2 className="mt-5 text-4xl font-extrabold tracking-tight text-brand-ink sm:text-5xl">
                {w.title}
              </h2>
              <p className="mt-5 max-w-md leading-relaxed text-muted">{w.pitch}</p>

              <div className="mt-6 flex flex-wrap gap-3 text-sm">
                <span className="inline-flex items-center gap-2 rounded-full border border-paper-line bg-paper-cream px-4 py-2 text-brand-ink/80">
                  <Clock className="h-4 w-4 text-brand-orange" />
                  {w.duration}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-paper-line bg-paper-cream px-4 py-2 text-brand-ink/80">
                  <Calendar className="h-4 w-4 text-brand-orange" />
                  {w.dates}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-paper-line bg-paper-cream px-4 py-2 text-brand-ink/80">
                  <Users className="h-4 w-4 text-brand-orange" />
                  {w.capacity}
                </span>
              </div>

              <div className="mt-8 max-w-sm">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                  {t.kicksOffIn}
                </p>
                <Countdown />
              </div>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-paper-line">
              <Image
                src="/img/workation-daytrip.jpg"
                alt="Kyoto and Nara day trip — an Osaka Workation event in Japan"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* GLOBAL PHOTO WALL */}
      <section className="container-page pb-4">
        <div className="mb-8 flex items-center gap-3">
          <Globe2 className="h-5 w-5 text-brand-orange" />
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
            {t.globalCrew}
          </p>
          <span className="h-px flex-1 bg-paper-line" />
        </div>
        <PhotoWall />
      </section>

      {/* WHAT'S INCLUDED */}
      <section className="container-page py-12 sm:py-16">
        <SectionHeading
          eyebrow={t.includesEyebrow}
          title={t.includesTitle}
          body={t.includesBody}
        />
        <div className="mt-12">
          <IncludesGrid />
        </div>
      </section>

      {/* PROGRAMME TIMELINE */}
      <section className="border-y border-paper-line bg-white">
        <div className="container-page py-16 sm:py-20">
          <SectionHeading
            eyebrow={t.flowEyebrow}
            title={t.flowTitle}
            body={t.flowBody}
          />
          <div className="mt-12">
            <WorkationTimeline />
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <L href="/#newsletter" className="btn-primary">
              {dict.pages.home.joinWaitlist} <ArrowRight className="h-4 w-4" />
            </L>
            <L href="/contact#partner" className="btn-ghost">
              {t.partnerBtn}
            </L>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="container-page scroll-mt-24 py-16 sm:py-20">
        <SectionHeading
          eyebrow={t.pricingEyebrow}
          title={t.pricingTitle}
          body={t.pricingBody}
        />
        <div className="mt-12">
          <Pricing />
        </div>
      </section>

      {/* WEEKLY MEETUPS */}
      <section id="meetups" className="container-page scroll-mt-24 py-16 sm:py-20">
        <SectionHeading
          eyebrow={t.meetupsEyebrow}
          title={t.meetupsTitle}
          body={t.meetupsBody}
        />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {dict.data.meetups.map((m) => (
            <MeetupCard key={m.title} meetup={m} />
          ))}
        </div>
      </section>

      {/* WAITLIST */}
      <section className="container-page pb-20">
        <div className="rounded-3xl border border-paper-line bg-paper-sand p-8 text-center sm:p-12">
          <h2 className="text-2xl font-extrabold tracking-tight text-brand-ink sm:text-3xl">
            {t.waitlistTitle}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-muted">{t.waitlistBody}</p>
          <div className="mx-auto mt-7 max-w-md">
            <Newsletter />
          </div>
        </div>
      </section>
    </>
  );
}
