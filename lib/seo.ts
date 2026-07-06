import type { Metadata } from "next";

const BASE = "https://osakaworkation.com";

export function buildMetadata({
  title,
  description,
  path,
  og,
}: {
  title: string;
  description: string;
  path: string;
  og: string;
}): Metadata {
  const image = `/og/${og}.png`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${BASE}${path}`,
      siteName: "OSAKA Workation",
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
