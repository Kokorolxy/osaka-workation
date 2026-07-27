import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { defaultLocale, isLocale } from "@/lib/i18n/config";

export async function GET(
  request: NextRequest,
  { params }: { params: { locale: string } },
) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const next = searchParams.get("next") ?? `/${locale}/account`;

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/${locale}/login?error=auth_callback_failed`);
}
