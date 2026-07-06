import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { TallyFab } from "@/components/tally-fab";
import { JsonLd } from "@/components/json-ld";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL("https://osakaworkation.com"),
  title: {
    default: "OSAKA Digital Nomads Workation",
    template: "%s · OSAKA Workation",
  },
  description:
    "Osaka's first international digital nomad community — real stays, monthly meetups, and the 14-day November Workation 2026. Work from Osaka. Connect with the world.",
  openGraph: {
    title: "OSAKA Digital Nomads Workation",
    description:
      "Work from Osaka. Connect with the world. Join the November 2026 Workation and Osaka's friendliest nomad community.",
    type: "website",
    siteName: "OSAKA Workation",
    url: "https://osakaworkation.com",
    images: [{ url: "/og/home.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "OSAKA Digital Nomads Workation",
    description:
      "Work from Osaka. Connect with the world. Join the November 2026 Workation.",
    images: ["/og/home.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-paper-cream font-sans text-brand-ink">
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
        <SiteFooter />
        <TallyFab />
        <Script
          src="https://tally.so/widgets/embed.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
