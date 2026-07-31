import type { Metadata } from "next";
import Image from "next/image";
import { Star, Wifi, BedDouble, Hotel, Users, Home, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { CTAStrip, SectionHeading } from "@/components/ui";
import { L } from "@/components/locale-link";
import { buildMetadata } from "@/lib/seo";
import { isLocale, defaultLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Metadata {
  const locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const d = getDictionary(locale).pages.stays;
  return buildMetadata({
    locale,
    title: d.metaTitle,
    description: d.metaDescription,
    path: "/stays",
    og: "stays",
  });
}

const TYPE_IMAGES = [
  "/stays/accom-hotel.jpg",
  "/stays/accom-coliving.jpg",
  "/stays/accom-guesthouse.jpg",
];
const TYPE_ICONS = [Hotel, Users, Home];
const GALLERY = ["/stays/comfort-1.jpg", "/stays/comfort-2.jpg"];

export default function StaysPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const t = getDictionary(locale).pages.stays;

  const includeIcons = [
    <Wifi key="w" className="h-5 w-5 text-brand-orange" />,
    <BedDouble key="b" className="h-5 w-5 text-brand-orange" />,
    <Star key="s" className="h-5 w-5 text-brand-orange" />,
  ];

  return (
    <>
      <PageHero
        eyebrow={t.heroEyebrow}
        title={t.heroTitle}
        body={t.heroBody}
        image="/stays/stay-hero.jpg"
        alt="A comfortable, work-ready stay in Osaka, Japan"
      />

      {/* HOW IT WORKS */}
      <section className="container-page py-16 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <span className="eyebrow">{t.howEyebrow}</span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-brand-ink sm:text-4xl">
              {t.howTitle}
            </h2>
            <p className="mt-4 leading-relaxed text-muted">{t.howBody}</p>
            <L href="/contact" className="btn-primary mt-7">
              {t.howCta} <ArrowRight className="h-4 w-4" />
            </L>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-paper-line">
            <Image
              src="/stays/stays-how.jpg"
              alt="Arriving at a comfortable stay in Osaka, Japan"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* THREE TYPES */}
      <section className="border-y border-paper-line bg-white">
        <div className="container-page py-16 sm:py-20">
          <SectionHeading
            align="center"
            eyebrow={t.typesEyebrow}
            title={t.typesTitle}
            body={t.typesBody}
          />
          <div className="mx-auto mt-12 grid gap-6 md:grid-cols-3">
            {t.typeItems.map((item, i) => {
              const Icon = TYPE_ICONS[i];
              return (
                <article
                  key={item.name}
                  className="group overflow-hidden rounded-3xl border border-paper-line bg-white transition-all hover:-translate-y-1 hover:border-brand-orange/40 hover:shadow-[0_18px_40px_-24px_rgba(15,15,15,0.35)]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={TYPE_IMAGES[i]}
                      alt={item.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute left-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/90 text-brand-orange backdrop-blur">
                      <Icon className="h-5 w-5" strokeWidth={1.75} />
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-brand-ink">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-brand-orange">
                      {item.tagline}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-muted">
                      {item.body}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* COMFORT GALLERY */}
      <section className="container-page py-16 sm:py-20">
        <SectionHeading
          eyebrow={t.galleryEyebrow}
          title={t.galleryTitle}
          body={t.galleryBody}
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {GALLERY.map((img) => (
            <div
              key={img}
              className="group relative aspect-[3/2] overflow-hidden rounded-3xl border border-paper-line"
            >
              <Image
                src={img}
                alt="A comfortable, restful stay in Osaka"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      </section>

      {/* WHAT'S INCLUDED */}
      <section className="border-y border-paper-line bg-white">
        <div className="container-page py-16 sm:py-20">
          <SectionHeading
            align="center"
            eyebrow={t.includesEyebrow}
            title={t.includesTitle}
          />
          <div className="mx-auto mt-12 grid max-w-4xl gap-5 sm:grid-cols-3">
            {t.includes.map((f, i) => (
              <div
                key={f.title}
                className="rounded-2xl border border-paper-line bg-paper-cream p-6 text-center"
              >
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-brand-orange/10">
                  {includeIcons[i]}
                </div>
                <h3 className="mt-4 font-bold text-brand-ink">{f.title}</h3>
                <p className="mt-2 text-sm text-muted">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTAStrip
        title={t.ctaTitle}
        body={t.ctaBody}
        primaryHref="/events#workation"
        primaryLabel={t.ctaPrimary}
        secondaryHref="/contact"
        secondaryLabel={t.ctaSecondary}
      />
    </>
  );
}
