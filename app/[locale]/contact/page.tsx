import { Instagram, MessageCircle, Mail, ChevronDown, Link2 } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/ui";
import { ContactForm } from "@/components/contact-form";
import { JsonLd } from "@/components/json-ld";
import { buildMetadata } from "@/lib/seo";
import { FAQS, SITE } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Contact",
  description:
    "Get in touch about the November Workation, stays, or partnerships — or just say hi. Osaka Workation replies within a couple of days.",
  path: "/contact",
  og: "contact",
});

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
      <PageHero
        eyebrow="Contact"
        title="Let's talk"
        body="Questions about the Workation, a stay, or a partnership? Drop us a line — we read everything and reply within a couple of days."
        image="/img/contact-hero.jpg"
      />

      <section className="container-page py-16 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          {/* contact methods */}
          <div>
            <SectionHeading eyebrow="Reach us" title="The fastest ways in" />
            <div className="mt-8 space-y-4">
              <ContactRow
                icon={<MessageCircle className="h-5 w-5 text-brand-orange" />}
                title="Discord"
                value="Chat with the community in real time"
                href={SITE.discord}
              />
              <ContactRow
                icon={<Instagram className="h-5 w-5 text-brand-orange" />}
                title="Instagram"
                value={SITE.instagramHandle}
                href={SITE.instagram}
              />
              <ContactRow
                icon={<Mail className="h-5 w-5 text-brand-orange" />}
                title="Email"
                value={SITE.email}
                href={`mailto:${SITE.email}`}
              />
              <ContactRow
                icon={<Link2 className="h-5 w-5 text-brand-orange" />}
                title="All our links"
                value="linktr.ee/osakaworkation"
                href={SITE.linktree}
              />
            </div>

            <div
              id="partner"
              className="mt-8 scroll-mt-24 rounded-3xl border border-brand-orange/30 bg-brand-orange/10 p-7"
            >
              <h3 className="text-lg font-bold text-brand-ink">
                Partner or sponsor
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Coworking spaces, stays, brands, and municipalities — reach a
                global remote-work audience and help build the case study for
                international 関係人口 in Osaka. Pick &ldquo;Partnership&rdquo; in
                the form and we&apos;ll send the deck.
              </p>
            </div>
          </div>

          {/* form */}
          <ContactForm />
        </div>
      </section>

      {/* FAQ */}
      <section
        id="faq"
        className="scroll-mt-24 border-t border-paper-line bg-white"
      >
        <div className="container-page py-16 sm:py-20">
          <SectionHeading
            align="center"
            eyebrow="FAQ"
            title="Questions, answered"
          />
          <div className="mx-auto mt-12 max-w-3xl space-y-3">
            {FAQS.map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl border border-paper-line bg-paper-cream p-5"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-semibold text-brand-ink">
                  {f.q}
                  <ChevronDown className="h-5 w-5 shrink-0 text-brand-orange transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function ContactRow({
  icon,
  title,
  value,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noreferrer"
      className="flex items-center gap-4 rounded-2xl border border-paper-line bg-white p-5 transition-colors hover:border-brand-orange/40"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-orange/15">
        {icon}
      </span>
      <span>
        <span className="block font-semibold text-brand-ink">{title}</span>
        <span className="block text-sm text-muted">{value}</span>
      </span>
    </a>
  );
}
