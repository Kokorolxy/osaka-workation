import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SectionHeading, CTAStrip } from "@/components/ui";
import { SITE, TESTIMONIALS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Community",
  description:
    "100+ digital nomads from around the world, building Osaka's first real remote-work scene. Meet the people and join the Discord.",
};

const GALLERY = [
  "event-4.jpg",
  "event-3.jpg",
  "event-2.jpg",
  "event-6.jpg",
  "event-1.jpg",
  "event-5.jpg",
];

export default function CommunityPage() {
  return (
    <>
      <PageHero
        eyebrow="Community"
        title="The people make the place"
        body="Locals and internationals, engineers and artists, first-timers and Japan veterans — all building Osaka's friendliest nomad community together."
        image="/events/event-4.jpg"
      />

      {/* DISCORD STAT BLOCK */}
      <section className="container-page py-16 sm:py-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div className="rounded-3xl border border-ink-border bg-ink-700 p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-orange/15">
                <MessageCircle className="h-5 w-5 text-brand-orange" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-brand-cream">
                  Osaka Nomads
                </h3>
                <p className="text-sm text-white/55">Discord server</p>
              </div>
            </div>
            <div className="mt-7 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-ink-border bg-ink-600 p-5 text-center">
                <div className="text-3xl font-extrabold text-brand-orange">
                  127
                </div>
                <div className="mt-1 text-sm text-white/55">Members</div>
              </div>
              <div className="rounded-2xl border border-ink-border bg-ink-600 p-5 text-center">
                <div className="text-3xl font-extrabold text-brand-orange">
                  23
                </div>
                <div className="mt-1 text-sm text-white/55">Online now</div>
              </div>
            </div>
            <a
              href={SITE.discord}
              target="_blank"
              rel="noreferrer"
              className="btn-primary mt-6 w-full"
            >
              Join the server <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>

          <SectionHeading
            eyebrow="Why people stay"
            title="Find your tribe in Osaka"
            body="It started with a handful of remote workers and a coffee meetup. Now it's a city-wide crew that swaps client leads, shares apartments, explores Kansai on weekends, and actually shows up for each other. No gatekeeping — just good people who chose Osaka."
          />
        </div>
      </section>

      {/* GALLERY */}
      <section className="border-y border-ink-border bg-ink-800">
        <div className="container-page py-16 sm:py-20">
          <SectionHeading
            align="center"
            eyebrow="Real events, real photos"
            title="Moments from the community"
          />
          <div className="mt-12 grid auto-rows-[200px] grid-cols-2 gap-4 sm:auto-rows-[240px] lg:grid-cols-4">
            {GALLERY.map((img, i) => (
              <div
                key={img}
                className={`relative overflow-hidden rounded-2xl border border-ink-border ${
                  i === 0 ? "col-span-2 row-span-2" : ""
                } ${i === 3 ? "lg:col-span-2" : ""}`}
              >
                <Image
                  src={`/events/${img}`}
                  alt="Osaka nomad community event"
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="container-page py-16 sm:py-20">
        <SectionHeading
          eyebrow="In their words"
          title="What members say"
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="card p-7"
            >
              <blockquote className="text-lg leading-relaxed text-brand-cream">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-orange/15 text-sm font-bold text-brand-orange">
                  {t.initials}
                </span>
                <span>
                  <span className="block font-semibold text-white">
                    {t.name} <span className="ml-1">{t.flag}</span>
                  </span>
                  <span className="block text-sm text-white/55">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <CTAStrip
        title="Come as a guest, leave with a crew"
        body="Follow along on Instagram, jump into Discord, or come straight to a Thursday meetup. The first coffee's on us."
        primaryHref={SITE.discord}
        primaryLabel="Join Discord"
        secondaryHref="/events#meetups"
        secondaryLabel="See meetups"
      />
    </>
  );
}
