import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/ui";
import { CountUp } from "@/components/count-up";
import { AboutTabs } from "@/components/about-tabs";
import { SITE } from "@/lib/site";

export const metadata = buildMetadata({
  title: "About OSAKA Workation",
  description:
    "Osaka Workation connects remote workers from around the world with the real Osaka — its people, neighborhoods, and creative culture.",
  path: "/about",
  og: "about",
});

const AUDIENCE = [
  {
    title: "Nomads",
    body: "Follow @osaka_workation — the waitlist opens this summer.",
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
        image="/img/about-hero.jpg"
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
          <p className="text-lg font-semibold text-brand-ink">{SITE.tagline}</p>
          <p className="max-w-xl text-sm leading-relaxed text-muted">
            {SITE.taglineJa}
          </p>
          <div className="mt-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-orange">
            <span className="h-px w-8 bg-brand-orange/40" />
            Est. Osaka 2026
            <span className="h-px w-8 bg-brand-orange/40" />
          </div>
        </div>
      </section>

      {/* WHO WE ARE */}
      <section className="container-page py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <span className="eyebrow">Who we are</span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-brand-ink sm:text-4xl">
              Osaka&apos;s first international digital nomad community
            </h2>
            <div className="mt-5 space-y-4 leading-relaxed text-muted">
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
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-paper-line">
            <Image
              src="/img/about-cafe.jpg"
              alt="Working from a cosy Osaka cafe"
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
            {[
              { to: 30, suffix: "%", l: "Cheaper than Tokyo, same quality of life" },
              { to: 100, suffix: "+", l: "Mbps average in cafes & coworking" },
              { to: 3, suffix: "", l: "Languages spoken across the community" },
            ].map((s) => (
              <div
                key={s.l}
                className="rounded-3xl border border-paper-line bg-paper-cream p-8 text-center"
              >
                <CountUp
                  to={s.to}
                  suffix={s.suffix}
                  className="block text-5xl font-extrabold tracking-tight text-brand-orange"
                />
                <p className="mx-auto mt-2 max-w-[16rem] text-sm text-muted">
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
          body="Tap through to see how it fits together."
        />
        <div className="mt-12">
          <AboutTabs />
        </div>
      </section>

      {/* JOIN / PARTNER */}
      <section className="border-t border-paper-line bg-paper-sand">
        <div className="container-page py-16 sm:py-20">
          <SectionHeading
            eyebrow="Join or partner with us"
            title="There's a place here for you"
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {AUDIENCE.map((a) => (
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
