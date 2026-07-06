import Image from "next/image";
import { Star, Wifi, Check, BedDouble } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { CTAStrip, SectionHeading } from "@/components/ui";
import { buildMetadata } from "@/lib/seo";
import { STAYS } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Curated Stays in Osaka",
  description:
    "Handpicked Osaka apartments and guesthouses with fast Wi-Fi and dedicated workspaces — ready for remote work from day one.",
  path: "/stays",
  og: "stays",
});

export default function StaysPage() {
  return (
    <>
      <PageHero
        eyebrow="Curated Stays"
        title="Find your perfect base in Osaka"
        body="Handpicked apartments and guesthouses, each vetted for fast Wi-Fi, a real desk, and a neighborhood you'll love coming home to."
        image="/stays/stay-hero.jpg"
      />

      <section className="container-page py-16 sm:py-20">
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
          <span className="rounded-full border border-brand-orange/40 bg-brand-orange/10 px-4 py-1.5 font-semibold text-brand-orange">
            All stays
          </span>
          {["Namba", "Umeda", "Tennoji", "Long-stay"].map((f) => (
            <span
              key={f}
              className="rounded-full border border-paper-line bg-white px-4 py-1.5"
            >
              {f}
            </span>
          ))}
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {STAYS.map((s) => (
            <article
              key={s.name}
              className="group overflow-hidden rounded-3xl border border-paper-line bg-white transition-all hover:-translate-y-1 hover:border-brand-orange/40 hover:shadow-[0_18px_40px_-24px_rgba(15,15,15,0.35)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={s.image}
                  alt={s.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-ink backdrop-blur">
                  {s.badge}
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-bold text-brand-ink">{s.name}</h3>
                  <span className="flex items-center gap-1 text-sm font-semibold text-brand-ink">
                    <Star className="h-4 w-4 fill-brand-orange text-brand-orange" />
                    {s.rating}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted">{s.area}</p>
                <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted">
                  {s.perks.map((p) => (
                    <li key={p} className="flex items-center gap-1.5">
                      <Check className="h-3.5 w-3.5 text-brand-orange" />
                      {p}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex items-center justify-between border-t border-paper-line pt-4">
                  <div>
                    <span className="text-lg font-bold text-brand-ink">
                      {s.price}
                    </span>
                    <span className="text-sm text-muted"> / night</span>
                  </div>
                  <button className="rounded-full bg-paper-cream px-4 py-2 text-sm font-semibold text-brand-ink transition-colors hover:bg-brand-orange hover:text-white">
                    View
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-paper-line bg-white">
        <div className="container-page py-16 sm:py-20">
          <SectionHeading
            align="center"
            eyebrow="What every stay includes"
            title="Work-ready, the moment you land"
          />
          <div className="mx-auto mt-12 grid max-w-4xl gap-5 sm:grid-cols-3">
            {[
              {
                icon: <Wifi className="h-5 w-5 text-brand-orange" />,
                title: "Fast, tested Wi-Fi",
                body: "Every listing is speed-checked. 150 Mbps minimum, video-call ready.",
              },
              {
                icon: <BedDouble className="h-5 w-5 text-brand-orange" />,
                title: "A real workspace",
                body: "A proper desk and chair — not a kitchen table. Built for full work days.",
              },
              {
                icon: <Star className="h-5 w-5 text-brand-orange" />,
                title: "Vetted by us",
                body: "Visited and approved by the local team. No surprises on arrival.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-paper-line bg-paper-cream p-6 text-center"
              >
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-brand-orange/10">
                  {f.icon}
                </div>
                <h3 className="mt-4 font-bold text-brand-ink">{f.title}</h3>
                <p className="mt-2 text-sm text-muted">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTAStrip
        title="Staying for the November Workation?"
        body="Workation tickets bundle your stay, coworking, and community programme into one package — no separate booking needed."
        primaryHref="/events#workation"
        primaryLabel="See the Workation"
        secondaryHref="/contact"
        secondaryLabel="Ask about stays"
      />
    </>
  );
}
