import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Users, Clock } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/ui";
import { Countdown } from "@/components/countdown";
import { Newsletter } from "@/components/newsletter";
import { MEETUPS, WORKATION } from "@/lib/site";

export const metadata: Metadata = {
  title: "Events",
  description:
    "The 14-day November 2026 Workation plus weekly meetups, cooking classes, and photo walks — Osaka's full digital nomad calendar.",
};

export default function EventsPage() {
  return (
    <>
      <PageHero
        eyebrow="Events"
        title="Upcoming experiences"
        body="A 14-day flagship Workation, plus the weekly meetups that keep the community close all year round."
        image="/events/event-3.jpg"
      />

      {/* WORKATION HERO BLOCK */}
      <section id="workation" className="container-page scroll-mt-24 py-16 sm:py-20">
        <div className="overflow-hidden rounded-3xl border border-brand-orange/30 bg-gradient-to-br from-brand-orange/15 via-ink-700 to-ink-800">
          <div className="grid gap-8 p-8 sm:p-12 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-3 py-1 text-xs font-bold text-white">
                Now recruiting · Early bird open
              </span>
              <h2 className="mt-5 text-4xl font-extrabold tracking-tight text-brand-cream sm:text-5xl">
                {WORKATION.title}
              </h2>
              <p className="mt-5 max-w-md leading-relaxed text-white/75">
                {WORKATION.pitch}
              </p>

              <div className="mt-6 flex flex-wrap gap-3 text-sm">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-white/80">
                  <Clock className="h-4 w-4 text-brand-orange" />
                  {WORKATION.duration}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-white/80">
                  <Calendar className="h-4 w-4 text-brand-orange" />
                  {WORKATION.dates}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-white/80">
                  <Users className="h-4 w-4 text-brand-orange" />
                  {WORKATION.capacity}
                </span>
              </div>

              <div className="mt-8 max-w-sm">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/55">
                  Kicks off in
                </p>
                <Countdown />
              </div>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10">
              <Image
                src="/events/event-6.jpg"
                alt="Osaka Workation evening gathering"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* WHAT'S INCLUDED */}
      <section className="container-page py-12 sm:py-16">
        <SectionHeading
          eyebrow="One ticket, everything in"
          title="What's included"
          body="No piecing together a trip. The Workation bundles your stay, your desk, and a full programme of Osaka life into a single package."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {WORKATION.includes.map((i) => (
            <div key={i.title} className="card p-6 hover:border-brand-orange/40">
              <div className="text-3xl">{i.icon}</div>
              <h3 className="mt-4 text-lg font-bold text-brand-cream">
                {i.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                {i.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* PROGRAMME TIMELINE */}
      <section className="border-y border-ink-border bg-ink-800">
        <div className="container-page py-16 sm:py-20">
          <SectionHeading
            eyebrow="The 14 days"
            title="How the Workation flows"
            body="Work your mornings, live Osaka your evenings. Here's the shape of the two weeks."
          />
          <div className="mt-12 space-y-4">
            {WORKATION.schedule.map((step, i) => (
              <div
                key={step.title}
                className="grid items-start gap-4 rounded-2xl border border-ink-border bg-ink-700 p-6 sm:grid-cols-[140px_1fr]"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-orange/15 text-sm font-bold text-brand-orange">
                    {i + 1}
                  </span>
                  <span className="text-sm font-semibold uppercase tracking-wide text-brand-orange">
                    {step.phase}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-brand-cream">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-white/65">
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
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

      {/* WEEKLY MEETUPS */}
      <section id="meetups" className="container-page scroll-mt-24 py-16 sm:py-20">
        <SectionHeading
          eyebrow="All year round"
          title="Weekly meetups & experiences"
          body="Can't make November? The community runs year-round. Drop into any of these — first one's always on us."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {MEETUPS.map((m) => (
            <div key={m.title} className="card p-6 hover:border-brand-orange/40">
              <div className="text-3xl">{m.icon}</div>
              <h3 className="mt-4 text-lg font-bold text-brand-cream">
                {m.title}
              </h3>
              <p className="mt-1 text-sm font-medium text-brand-orange">
                {m.cadence}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                {m.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* WAITLIST */}
      <section className="container-page pb-20">
        <div className="rounded-3xl border border-ink-border bg-ink-700 p-8 text-center sm:p-12">
          <h2 className="text-2xl font-extrabold tracking-tight text-brand-cream sm:text-3xl">
            Want first access to dates & pricing?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-white/65">
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
