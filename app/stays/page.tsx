import { Star, Wifi, Check, BedDouble } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { CTAStrip, SectionHeading } from "@/components/ui";
import { StaysExplorer } from "@/components/stays-explorer";
import { buildMetadata } from "@/lib/seo";

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
        <div className="mb-8 max-w-2xl">
          <span className="eyebrow">Handpicked partners</span>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-brand-ink sm:text-3xl">
            Filter by type &amp; who&apos;s coming
          </h2>
          <p className="mt-3 text-muted">
            We only recommend vetted partner stays we&apos;d book ourselves —
            from a solo Airbnb to a group share house. Browsing is on us;
            booking happens on the partner&apos;s own page.
          </p>
        </div>

        <StaysExplorer />
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
