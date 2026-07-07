import type { Metadata } from "next";
import Script from "next/script";
import "@/app/globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { TallyFab } from "@/components/tally-fab";
import { JsonLd } from "@/components/json-ld";
import { I18nProvider } from "@/components/i18n-provider";
import { SITE } from "@/lib/site";
import {
  locales,
  defaultLocale,
  isLocale,
  type Locale,
} from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Metadata {
  const locale: Locale = isLocale(params.locale)
    ? params.locale
    : defaultLocale;
  const dict = getDictionary(locale);
  return {
    metadataBase: new URL("https://osakaworkation.com"),
    title: {
      default: dict.meta.defaultTitle,
      template: "%s · OSAKA Workation",
    },
    description: dict.meta.defaultDescription,
    alternates: {
      canonical: `/${locale}`,
      languages: { en: "/en", ja: "/ja", "x-default": "/en" },
    },
    openGraph: {
      title: dict.meta.defaultTitle,
      description: dict.meta.defaultDescription,
      type: "website",
      siteName: "OSAKA Workation",
      url: `https://osakaworkation.com/${locale}`,
      locale: locale === "ja" ? "ja_JP" : "en_US",
      images: [{ url: "/og/home.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.defaultTitle,
      description: dict.meta.defaultDescription,
      images: ["/og/home.png"],
    },
  };
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const locale: Locale = isLocale(params.locale)
    ? params.locale
    : defaultLocale;
  const dict = getDictionary(locale);

  return (
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+JP:wght@400;500;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-paper-cream font-sans text-brand-ink">
        <I18nProvider locale={locale} dict={dict}>
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "Organization",
              name: SITE.name,
              alternateName: SITE.shortName,
              url: "https://osakaworkation.com",
              logo: "https://osakaworkation.com/icon.png",
              description:
                "Osaka's first international digital nomad community — stays, meetups, and the 14-day November Workation.",
              email: SITE.email,
              areaServed: "Osaka, Japan",
              sameAs: [SITE.instagram, SITE.linktree],
            }}
          />
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter dict={dict} />
          <TallyFab />
        </I18nProvider>
        <Script
          src="https://tally.so/widgets/embed.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
