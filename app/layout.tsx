import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://osaka-workation.vercel.app"),
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
      <body className="min-h-screen bg-ink-900 font-sans">
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
