import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/lib/database.types";
import { defaultLocale, isLocale } from "@/lib/i18n/config";

function stripLocale(pathname: string): { locale: string; path: string } {
  const segment = pathname.split("/")[1] ?? "";
  if (isLocale(segment)) {
    const rest = pathname.slice(segment.length + 1) || "/";
    return { locale: segment, path: rest };
  }
  return { locale: defaultLocale, path: pathname || "/" };
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Allow the marketing site to run before env is configured.
  if (!url || !anonKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  // Important: do not insert logic between createServerClient and getUser().
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { locale, path } = stripLocale(request.nextUrl.pathname);
  const isAuthPage = path === "/login" || path === "/signup";
  const isProtected =
    path === "/account" ||
    path.startsWith("/account/") ||
    path === "/join" ||
    path.startsWith("/join/");
  const isAdmin = path === "/admin" || path.startsWith("/admin/");

  if ((isProtected || isAdmin) && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = `/${locale}/login`;
    redirectUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (isAdmin && user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.role !== "admin") {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = `/${locale}/account`;
      return NextResponse.redirect(redirectUrl);
    }
  }

  if (isAuthPage && user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = `/${locale}/account`;
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}
