import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, ArrowRight } from "lucide-react";
import { BlogContent } from "@/components/blog-content";
import { L } from "@/components/locale-link";
import { POSTS, getPost } from "@/lib/blog";
import { SITE } from "@/lib/site";
import { isLocale, defaultLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Metadata {
  const locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const post = getPost(locale, params.slug);
  if (!post) return {};
  const ogImage = `/og/blog-${post.slug}.png`;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `/${locale}/blog/${post.slug}`,
      languages: {
        en: `/en/blog/${post.slug}`,
        ja: `/ja/blog/${post.slug}`,
        "x-default": `/en/blog/${post.slug}`,
      },
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: `https://osakaworkation.com/${locale}/blog/${post.slug}`,
      siteName: "OSAKA Workation",
      locale: locale === "ja" ? "ja_JP" : "en_US",
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [ogImage],
    },
  };
}

export default function BlogPostPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const dict = getDictionary(locale);
  const t = dict.pages.blog;
  const post = getPost(locale, params.slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: `https://osakaworkation.com${post.cover}`,
    datePublished: post.date,
    inLanguage: locale,
    author: { "@type": "Organization", name: SITE.shortName },
    publisher: { "@type": "Organization", name: SITE.shortName },
    mainEntityOfPage: `https://osakaworkation.com/${locale}/blog/${post.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="pb-20">
        <div className="container-page max-w-3xl pt-28 sm:pt-32">
          <L
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-orange hover:text-brand-orangeHover"
          >
            <ArrowLeft className="h-4 w-4" /> {t.backToGuides}
          </L>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wide text-brand-orange">
            {post.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-brand-ink sm:text-5xl">
            {post.title}
          </h1>
          <div className="mt-5 flex items-center gap-4 text-sm text-muted">
            <span>{post.dateLabel}</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {post.readingTime}
            </span>
          </div>
        </div>

        <div className="container-page mt-8 max-w-4xl">
          <div className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-paper-line">
            <Image
              src={post.cover}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 900px"
              className="object-cover"
            />
          </div>
        </div>

        <div className="container-page mt-12 max-w-3xl">
          <BlogContent body={post.body} />

          <div className="mt-14 overflow-hidden rounded-3xl bg-brand-orange p-8 text-center sm:p-10">
            <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              {t.articleCtaTitle}
            </h2>
            <p className="mx-auto mt-3 max-w-md text-white/90">
              {t.articleCtaBody}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <L
                href="/events#workation"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-orange transition-colors hover:bg-paper-cream"
              >
                {t.articleCtaPrimary} <ArrowRight className="h-4 w-4" />
              </L>
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/70 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                {t.articleCtaFollow}
              </a>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
