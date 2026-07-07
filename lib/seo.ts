import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n/config";

const BASE = "https://osakaworkation.com";

export function buildMetadata({
  locale,
  title,
  description,
  path,
  og,
}: {
  locale: Locale;
  title: string;
  description: string;
  path: string; // "" for home, "/stays", etc.
  og: string;
}): Metadata {
  const image = `/og/${og}.png`;
  const url = `${BASE}/${locale}${path}`;
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}${path}`,
      languages: {
        en: `/en${path}`,
        ja: `/ja${path}`,
        "x-default": `/en${path}`,
      },
    },
    openGraph: {
      title,
      description,
      type: "website",
      url,
      siteName: "OSAKA Workation",
      locale: locale === "ja" ? "ja_JP" : "en_US",
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
