"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useLocale } from "./i18n-provider";

/**
 * Locale-aware internal link. Prefixes internal hrefs ("/stays") with the
 * current locale ("/ja/stays"). External / hash / mailto hrefs pass through.
 */
export function L({
  href,
  ...props
}: Omit<ComponentProps<typeof Link>, "href"> & { href: string }) {
  const locale = useLocale();
  const isInternal = href.startsWith("/");
  const resolved = isInternal
    ? `/${locale}${href === "/" ? "" : href}`
    : href;
  return <Link href={resolved} {...props} />;
}
