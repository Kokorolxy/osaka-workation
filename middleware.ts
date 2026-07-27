import { NextResponse, type NextRequest } from "next/server";
import { locales, defaultLocale } from "@/lib/i18n/config";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const hasLocale = locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );

  if (!hasLocale) {
    const url = req.nextUrl.clone();
    url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }

  return updateSession(req);
}

export const config = {
  // Run on everything except Next internals, the API, and files with an extension
  // (icons, og/*.png, img/*.jpg, sitemap.xml, robots.txt, etc.).
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
