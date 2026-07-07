import type { MetadataRoute } from "next";
import { POSTS } from "@/lib/blog";
import { locales } from "@/lib/i18n/config";

const BASE = "https://osakaworkation.com";

function entry(path: string, changeFrequency: "weekly" | "monthly", priority: number) {
  return locales.map((locale) => ({
    url: `${BASE}/${locale}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
    alternates: {
      languages: Object.fromEntries(
        locales.map((l) => [l, `${BASE}/${l}${path}`]),
      ),
    },
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/stays", "/events", "/community", "/blog", "/about", "/contact"];
  const routes = paths.flatMap((p) => entry(p, "weekly", p === "" ? 1 : 0.8));
  const posts = POSTS.flatMap((p) => entry(`/blog/${p.slug}`, "monthly", 0.6));
  return [...routes, ...posts];
}
