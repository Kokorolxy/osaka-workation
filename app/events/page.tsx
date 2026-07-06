import Image from "next/image";
import Link from "next/link";
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
import { MEETUPS, WORKATION } from "@/lib/site";

export const metadata = buildMetadata({
  title: "November Workation 2026 & Events",
  description:
    "The 14-day November 2026 Workation plus weekly meetups, cooking classes, and photo walks — Osaka's full digital nomad calendar.",
  path: "/events",
  og: "events",
});

export default function EventsPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Event",
          name: WORKATION.title,
          description: WORKATION.pitch,
          startDate: "2026-11-02",
          endDate: "2026-11-15",
          eventAttendanceMode:
            "https://schema.org/OfflineEventAttendanceMode",
          eventStatus: "https://schema.org/EventScheduled",
          location: {
            "@type": "Place",
            name: "Osaka, Japan",
            address: { "@type": "PostalAddress", addressLocality: "Osaka", addressCountry: "JP" },
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
        eyebrow="Events"
        title="Upcoming experiences"
        body="A 14-day flagship Workation, plus the weekly meetups that keep the community close all year round."
        image="/img/events-hero.jpg"
      />

      {/* WORKATION HERO BLOCK */}
      <section id="workation" className="container-page scroll-mt-24 py-16 sm:py-20">
        <div className="overflow-hidden rounded-3xl border border-paper-line bg-white">
          <div className="grid gap-8 p-8 sm:p-12 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-3 py-1 text-xs font-bold text-white">
                Now recruiting · Early bird open
              </span>
              <h2 className="mt-5 text-4xl font-extrabold tracking-tight text-brand-ink sm:text-5xl">
                {WORKATION.title}
              </h2>
              <p className="mt-5 max-w-md leading-relaxed text-muted">
                {WORKATION.pitch}
              </p>

              <div className="mt-6 flex flex-wrap gap-3 text-sm">
                <span className="inline-flex items-center gap-2 rounded-full border border-paper-line bg-paper-cream px-4 py-2 text-brand-ink/80">
                  <Clock className="h-4 w-4 text-brand-orange" />
                  {WORKATION.duration}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-paper-line bg-paper-cream px-4 py-2 text-brand-ink/80">
                  <Calendar className="h-4 w-4 text-brand-orange" />
                  {WORKATION.dates}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-paper-line bg-paper-cream px-4 py-2 text-brand-ink/80">
                  <Users className="h-4 w-4 text-brand-orange" />
                  {WORKATION.capacity}
                </span>
              </div>

              <div className="mt-8 max-w-sm">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                  Kicks off in
                </p>
                <Countdown />
              </div>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-paper-line">
              <Image
                src="/img/workation-daytrip.jpg"
                alt="Kansai autumn day trip near Osaka"
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
            A global crew, one city
          </p>
          <span className="h-px flex-1 bg-paper-line" />
        </div>
        <PhotoWall />
      </section>

      {/* WHAT'S INCLUDED */}
      <section className="container-page py-12 sm:py-16">
        <SectionHeading
          eyebrow="One ticket, everything in"
          title="What's included"
          body="No piecing together a trip. Tap any card to see exactly what's covered."
        />
        <div className="mt-12">
          <IncludesGrid />
        </div>
      </section>

      {/* PROGRAMME TIMELINE */}
      <section className="border-y border-paper-line bg-white">
        <div className="container-page py-16 sm:py-20">
          <SectionHeading
            eyebrow="The 14 days"
            title="How the Workation flows"
            body="Tap a phase to see the schedule and times. Work your mornings, live Osaka your evenings."
          />
          <div className="mt-12">
            <WorkationTimeline />
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/#newsletter" className="btn-primary">
              Join the waitlist <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/contact#partner" className="btn-ghost">
              Partner or sponsor
            </Link>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="container-page scroll-mt-24 py-16 sm:py-20">
        <SectionHeading
          eyebrow="Pricing"
          title="Plans for every kind of stay"
          body="Pick the plan that fits, then join the waitlist to lock it in. Programme, coworking, and experiences are included — accommodation is a simple add-on from ¥4,500/night."
        />
        <div className="mt-12">
          <Pricing />
        </div>
      </section>

      {/* WEEKLY MEETUPS */}
      <section id="meetups" className="container-page scroll-mt-24 py-16 sm:py-20">
        <SectionHeading
          eyebrow="All year round"
          title="Weekly meetups & experiences"
          body="Can't make November? The community runs year-round. Hover (or tap) a card for the details — first one's always on us."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {MEETUPS.map((m) => (
            <MeetupCard key={m.title} meetup={m} />
          ))}
        </div>
      </section>

      {/* WAITLIST */}
      <section className="container-page pb-20">
        <div className="rounded-3xl border border-paper-line bg-paper-sand p-8 text-center sm:p-12">
          <h2 className="text-2xl font-extrabold tracking-tight text-brand-ink sm:text-3xl">
            Want first access to dates &amp; pricing?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-muted">
            Waitlist members hear about the November Workation before anyone
            else.
          </p>
          <div className="mx-auto mt-7 max-w-md">
            <Newsletter />
          </div>
        </div>
      </section>
    </>
  );
}
