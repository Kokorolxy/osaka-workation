import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, ArrowRight } from "lucide-react";
import { BlogContent } from "@/components/blog-content";
import { POSTS, getPost } from "@/lib/blog";
import { SITE } from "@/lib/site";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const post = getPost(params.slug);
  if (!post) return {};
  const ogImage = `/og/blog-${post.slug}.png`;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: `https://osakaworkation.com/blog/${post.slug}`,
      siteName: "OSAKA Workation",
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
  params: { slug: string };
}) {
  const post = getPost(params.slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: `https://osakaworkation.com${post.cover}`,
    datePublished: post.date,
    author: { "@type": "Organization", name: SITE.shortName },
    publisher: { "@type": "Organization", name: SITE.shortName },
    mainEntityOfPage: `https://osakaworkation.com/blog/${post.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="pb-20">
        {/* header */}
        <div className="container-page max-w-3xl pt-28 sm:pt-32">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-orange hover:text-brand-orangeHover"
          >
            <ArrowLeft className="h-4 w-4" /> All guides
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wide text-brand-orange">
            {post.tags.map((t) => (
              <span key={t}>{t}</span>
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

        {/* cover */}
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

        {/* body */}
        <div className="container-page mt-12 max-w-3xl">
          <BlogContent body={post.body} />

          {/* CTA */}
          <div className="mt-14 overflow-hidden rounded-3xl bg-brand-orange p-8 text-center sm:p-10">
            <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Come work from Osaka with us
            </h2>
            <p className="mx-auto mt-3 max-w-md text-white/90">
              Join the community for weekly coffee meetups, or lock in your spot
              for the November Workation.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/events#workation"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-orange transition-colors hover:bg-paper-cream"
              >
                See the Workation <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/70 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Follow @osaka_workation
              </a>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
