import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SectionHeading, CTAStrip } from "@/components/ui";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { isLocale, defaultLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Metadata {
  const locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const d = getDictionary(locale).pages.community;
  return buildMetadata({
    locale,
    title: d.metaTitle,
    description: d.metaDescription,
    path: "/community",
    og: "community",
  });
}

const GALLERY = [
  "/img/community-1.jpg",
  "/img/community-2.jpg",
  "/img/community-3.jpg",
  "/img/community-4.jpg",
  "/img/community-5.jpg",
  "/img/community-6.jpg",
];

export default function CommunityPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const dict = getDictionary(locale);
  const t = dict.pages.community;

  return (
    <>
      <PageHero
        eyebrow={t.heroEyebrow}
        title={t.heroTitle}
        body={t.heroBody}
        image="/img/community-hero.jpg"
      />

      {/* DISCORD STAT BLOCK */}
      <section className="container-page py-16 sm:py-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div className="rounded-3xl border border-paper-line bg-white p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-orange/15">
                <MessageCircle className="h-5 w-5 text-brand-orange" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-brand-ink">
                  {t.discordName}
                </h3>
                <p className="text-sm text-muted">{t.discordServer}</p>
              </div>
            </div>
            <div className="mt-7 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-paper-line bg-paper-cream p-5 text-center">
                <div className="text-3xl font-extrabold text-brand-orange">
                  127
                </div>
                <div className="mt-1 text-sm text-muted">{t.members}</div>
              </div>
              <div className="rounded-2xl border border-paper-line bg-paper-cream p-5 text-center">
                <div className="text-3xl font-extrabold text-brand-orange">
                  23
                </div>
                <div className="mt-1 text-sm text-muted">{t.onlineNow}</div>
              </div>
            </div>
            <a
              href={SITE.discord}
              target="_blank"
              rel="noreferrer"
              className="btn-primary mt-6 w-full"
            >
              {t.joinServer} <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>

          <SectionHeading
            eyebrow={t.whyEyebrow}
            title={t.whyTitle}
            body={t.whyBody}
          />
        </div>
      </section>

      {/* GALLERY */}
      <section className="border-y border-paper-line bg-white">
        <div className="container-page py-16 sm:py-20">
          <SectionHeading
            align="center"
            eyebrow={t.galleryEyebrow}
            title={t.galleryTitle}
          />
          <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-3">
            {GALLERY.map((img) => (
              <div
                key={img}
                className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-paper-line"
              >
                <Image
                  src={img}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="container-page py-16 sm:py-20">
        <SectionHeading
          eyebrow={t.testimonialsEyebrow}
          title={t.testimonialsTitle}
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {dict.data.testimonials.map((item) => (
            <figure key={item.name} className="card p-7">
              <blockquote className="text-lg leading-relaxed text-brand-ink">
                &ldquo;{item.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-orange/15 text-sm font-bold text-brand-orange">
                  {item.initials}
                </span>
                <span>
                  <span className="block font-semibold text-brand-ink">
                    {item.name} <span className="ml-1">{item.flag}</span>
                  </span>
                  <span className="block text-sm text-muted">{item.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <CTAStrip
        title={t.ctaTitle}
        body={t.ctaBody}
        primaryHref={SITE.discord}
        primaryLabel={dict.actions.joinDiscord}
        secondaryHref="/events#meetups"
        secondaryLabel={dict.ui.common.seeMeetups}
      />
    </>
  );
}
