import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/ui";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Osaka Workation connects remote workers from around the world with the real Osaka — its people, neighborhoods, and creative culture.",
};

const OFFER = [
  {
    title: "Social media",
    body: "We document the real Osaka for a global remote-work audience across Instagram and TikTok.",
  },
  {
    title: "Monthly meetups",
    body: "Coffee mornings, cooking classes, and photo walks that turn strangers into a community.",
  },
  {
    title: "Annual Workation",
    body: "A 14-day November flagship that bundles stays, coworking, and Kansai culture into one package.",
  },
];

const AUDIENCE = [
  {
    title: "Nomads",
    body: "Follow @osaka_digitalnomads_workation — the waitlist opens this summer.",
  },
  {
    title: "Coworking spaces & stays",
    body: "Reach a global remote-work audience in your off-season.",
  },
  {
    title: "Sponsors & municipalities",
    body: "Co-create the case study for international 関係人口 in Osaka.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Work from Osaka. Connect with the world."
        body="大阪から世界へ。ローカルとつながる国際ノマドコミュニティ"
        image="/events/event-1.jpg"
      />

      {/* WHO WE ARE */}
      <section className="container-page py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <span className="eyebrow">Who we are</span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-brand-cream sm:text-4xl">
              Osaka&apos;s first international digital nomad community
            </h2>
            <div className="mt-5 space-y-4 leading-relaxed text-white/70">
              <p>
                We connect remote workers from around the world with the real
                Osaka — its people, neighborhoods, and creative culture —
                through social media, monthly meetups, and an annual workation.
              </p>
              <p>
                Tokyo gets the spotlight, but Osaka is where you actually want to
                live: warmer, cheaper, funnier, and unmistakably itself. Our job
                is to make landing here feel less like tourism and more like
                moving in with friends who already know the city.
              </p>
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-ink-border">
            <Image
              src="/events/event-2.jpg"
              alt="Osaka nomad community gathering"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* WHY OSAKA / NUMBERS */}
      <section className="border-y border-ink-border bg-ink-800">
        <div className="container-page py-16 sm:py-20">
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { v: "30%", l: "Cheaper than Tokyo, same quality of life" },
              { v: "100+", l: "Mbps average in cafes & coworking" },
              { v: "3", l: "Languages spoken across the community" },
            ].map((s) => (
              <div
                key={s.l}
                className="rounded-3xl border border-ink-border bg-ink-700 p-8 text-center"
              >
                <div className="text-4xl font-extrabold text-brand-orange">
                  {s.v}
                </div>
                <p className="mx-auto mt-2 max-w-[16rem] text-sm text-white/60">
                  {s.l}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT WE OFFER */}
      <section className="container-page py-16 sm:py-20">
        <SectionHeading
          eyebrow="What we do"
          title="Three ways we build the community"
        />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {OFFER.map((o, i) => (
            <div key={o.title} className="card p-7">
              <span className="text-sm font-bold text-brand-orange">
                0{i + 1}
              </span>
              <h3 className="mt-3 text-lg font-bold text-brand-cream">
                {o.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                {o.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* JOIN / PARTNER */}
      <section className="border-t border-ink-border bg-ink-800">
        <div className="container-page py-16 sm:py-20">
          <SectionHeading
            eyebrow="Join or partner with us"
            title="There's a place here for you"
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {AUDIENCE.map((a) => (
              <div
                key={a.title}
                className="rounded-3xl border border-ink-border bg-ink-700 p-7"
              >
                <h3 className="text-lg font-bold text-brand-cream">
                  {a.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">
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
              Follow on Instagram <ArrowRight className="h-4 w-4" />
            </a>
            <Link href="/contact#partner" className="btn-ghost">
              Partner with us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
