import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, Clock } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { L } from "@/components/locale-link";
import { buildMetadata } from "@/lib/seo";
import { getPosts } from "@/lib/blog";
import { isLocale, defaultLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Metadata {
  const locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const d = getDictionary(locale).pages.blog;
  return buildMetadata({
    locale,
    title: d.metaTitle,
    description: d.metaDescription,
    path: "/blog",
    og: "blog",
  });
}

export default function BlogPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const dict = getDictionary(locale);
  const t = dict.pages.blog;
  const [featured, ...rest] = getPosts(locale);

  return (
    <>
      <PageHero
        eyebrow={t.heroEyebrow}
        title={t.heroTitle}
        body={t.heroBody}
        image="/blog/cafes-cover.jpg"
      />

      <section className="container-page py-16 sm:py-20">
        <L
          href={`/blog/${featured.slug}`}
          className="group grid gap-8 overflow-hidden rounded-3xl border border-paper-line bg-white lg:grid-cols-2"
        >
          <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto">
            <Image
              src={featured.cover}
              alt={featured.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority
            />
          </div>
          <div className="flex flex-col justify-center p-8 sm:p-10">
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wide text-brand-orange">
              {featured.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-brand-ink sm:text-3xl">
              {featured.title}
            </h2>
            <p className="mt-3 leading-relaxed text-muted">{featured.excerpt}</p>
            <div className="mt-6 flex items-center gap-4 text-sm text-muted">
              <span>{featured.dateLabel}</span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {featured.readingTime}
              </span>
            </div>
            <span className="mt-6 inline-flex items-center gap-2 font-semibold text-brand-orange">
              {dict.ui.common.readGuide} <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </L>

        {rest.length > 0 && (
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {rest.map((p) => (
              <L
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group overflow-hidden rounded-3xl border border-paper-line bg-white transition-all hover:-translate-y-1 hover:border-brand-orange/40"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={p.cover}
                    alt={p.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-brand-ink">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted">{p.excerpt}</p>
                </div>
              </L>
            ))}
          </div>
        )}

        <div className="mt-12 rounded-3xl border border-paper-line bg-paper-sand p-8 text-center">
          <p className="text-muted">
            {t.more}{" "}
            <L
              href="/#newsletter"
              className="font-semibold text-brand-orange hover:text-brand-orangeHover"
            >
              {t.getNotified}
            </L>
            .
          </p>
        </div>
      </section>
    </>
  );
}
