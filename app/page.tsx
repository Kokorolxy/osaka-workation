import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, MapPin, Wifi } from "lucide-react";
import { Marquee, SectionHeading } from "@/components/ui";
import { Countdown } from "@/components/countdown";
import { Newsletter } from "@/components/newsletter";
import {
  DISTRICTS,
  SITE,
  STATS,
  WHY_OSAKA,
  WORKATION,
} from "@/lib/site";

export default function HomePage() {
  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="relative isolate flex min-h-[92vh] items-center overflow-hidden">
        <Image
          src="/events/event-4.jpg"
          alt="Osaka digital nomad community meetup"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="hero-overlay absolute inset-0" />

        <div className="container-page relative z-10 grid gap-10 pb-16 pt-28 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-white backdrop-blur">
              ✈ Osaka, Japan · Workation 2026
            </span>
            <h1 className="mt-6 text-5xl font-extrabold leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Work.
              <br />
              Explore.
              <br />
              <span className="text-brand-orange">Connect.</span>
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-white/80">
              Osaka&apos;s first international digital nomad community — real
              stays, real people, real Japan.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/events#workation" className="btn-primary">
                Join November Workation <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={SITE.discord}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost"
              >
                Join Discord <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* stats card */}
          <div className="animate-fade-up rounded-3xl border border-white/15 bg-ink-900/55 p-6 backdrop-blur-md sm:p-8">
            <div className="grid grid-cols-2 gap-x-6 gap-y-7">
              {STATS.map((s) => (
                <div key={s.label}>
                  <div className="text-3xl font-extrabold text-brand-orange sm:text-4xl">
                    {s.value}
                  </div>
                  <div className="mt-1 text-sm text-white/65">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="mt-7 flex items-center gap-3 border-t border-white/10 pt-5 text-sm text-white/70">
              <MapPin className="h-4 w-4 text-brand-orange" />
              Based in Osaka · 通天閣 Tsutenkaku neighborhood
            </div>
          </div>
        </div>
      </section>

      <Marquee />

      {/* ---------- WHY OSAKA ---------- */}
      <section className="container-page py-20 sm:py-24">
        <SectionHeading
          eyebrow="Why Osaka"
          title="Japan's best-kept secret"
          body="Cheaper than Tokyo, warmer than anywhere, and built for people who want to actually live in Japan — not just visit."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {WHY_OSAKA.map((w) => (
            <div
              key={w.title}
              className="card p-6 hover:border-brand-orange/40"
            >
              <div className="text-3xl">{w.icon}</div>
              <h3 className="mt-4 text-lg font-bold text-brand-cream">
                {w.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                {w.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- NOVEMBER WORKATION FEATURE ---------- */}
      <section className="border-y border-ink-border bg-ink-800">
        <div className="container-page grid gap-10 py-20 sm:py-24 lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-ink-border">
            <Image
              src="/events/event-6.jpg"
              alt="Evening rooftop gathering with the Osaka nomad community"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <span className="absolute left-4 top-4 rounded-full bg-brand-orange px-3 py-1 text-xs font-bold text-white">
              Now recruiting · Early bird open
            </span>
          </div>

          <div>
            <span className="eyebrow">The flagship event</span>
            <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-brand-cream sm:text-5xl">
              {WORKATION.title}
            </h2>
            <p className="mt-3 text-lg font-semibold text-brand-orange">
              {WORKATION.duration} · {WORKATION.dates} · {WORKATION.capacity}
            </p>
            <p className="mt-4 max-w-md leading-relaxed text-white/70">
              {WORKATION.pitch}
            </p>

            <div className="mt-7">
              <Countdown />
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link href="/events#workation" className="btn-primary">
                See the full programme <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/#newsletter" className="btn-ghost">
                Join the waitlist
              </Link>
            </div>

            <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-white/75">
              {WORKATION.includes.slice(0, 6).map((i) => (
                <li key={i.title} className="flex items-center gap-2">
                  <span>{i.icon}</span>
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
            eyebrow="Explore"
            title="Pick your neighborhood"
            body="Three distinct bases, each with its own rhythm. Find the one that matches how you work and unwind."
          />
          <Link
            href="/stays"
            className="hidden items-center gap-1 text-sm font-semibold text-brand-orange hover:text-brand-orangeHover sm:inline-flex"
          >
            Browse all stays <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {DISTRICTS.map((d) => (
            <Link
              key={d.name}
              href="/stays"
              className="group relative overflow-hidden rounded-3xl border border-ink-border"
            >
              <div className="relative aspect-[4/5]">
                <Image
                  src={d.image}
                  alt={d.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/30 to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-6">
                <div className="text-sm font-semibold text-brand-orange">
                  {d.kanji}
                </div>
                <h3 className="mt-1 text-2xl font-bold text-white">{d.name}</h3>
                <p className="mt-2 text-sm text-white/70">{d.body}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------- COMMUNITY PREVIEW ---------- */}
      <section className="border-y border-ink-border bg-ink-800">
        <div className="container-page grid gap-10 py-20 sm:py-24 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="eyebrow">Community</span>
            <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-brand-cream sm:text-5xl">
              Join 100+ digital nomads
            </h2>
            <p className="mt-4 max-w-md leading-relaxed text-white/70">
              From Thursday coffee meetups to nabe nights and photo walks, this
              is a crew of locals and internationals building Osaka&apos;s first
              real nomad scene.
            </p>
            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-ink-border bg-ink-700 p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-3 w-3">
                  <span className="absolute h-3 w-3 animate-ping rounded-full bg-brand-orange/60" />
                  <span className="h-3 w-3 rounded-full bg-brand-orange" />
                </span>
                <span className="text-sm text-white/70">
                  <b className="text-white">23</b> online now on Discord
                </span>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={SITE.discord}
                target="_blank"
                rel="noreferrer"
                className="btn-primary"
              >
                Join Discord <ArrowUpRight className="h-4 w-4" />
              </a>
              <Link href="/community" className="btn-ghost">
                Meet the community
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-2 text-sm text-white/60">
              <Wifi className="h-4 w-4 text-brand-orange" /> Average 100+ Mbps in
              Osaka cafes & coworking
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {["event-3.jpg", "event-2.jpg", "event-1.jpg", "event-5.jpg"].map(
              (img, i) => (
                <div
                  key={img}
                  className={`relative overflow-hidden rounded-2xl border border-ink-border ${
                    i % 3 === 0 ? "aspect-[4/5]" : "aspect-square"
                  }`}
                >
                  <Image
                    src={`/events/${img}`}
                    alt="Osaka nomad community event"
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* ---------- NEWSLETTER ---------- */}
      <section id="newsletter" className="container-page py-20 sm:py-24">
        <div className="relative overflow-hidden rounded-3xl border border-brand-orange/30 bg-gradient-to-br from-brand-orange/15 via-ink-700 to-ink-800 px-6 py-14 text-center sm:px-14">
          <div className="absolute -left-16 -top-16 h-48 w-48 rounded-full bg-brand-orange/30 blur-3xl" />
          <span className="eyebrow relative">Stay in the loop</span>
          <h2 className="relative mt-3 text-3xl font-extrabold tracking-tight text-brand-cream sm:text-4xl">
            Get the waitlist before anyone else
          </h2>
          <p className="relative mx-auto mt-4 max-w-lg text-white/70">
            New stays, upcoming events, and first access to the November
            Workation. No spam — just Osaka.
          </p>
          <div className="relative mx-auto mt-8 max-w-md">
            <Newsletter />
            <p className="mt-3 text-xs text-white/45">
              Join 200+ nomads already signed up.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
