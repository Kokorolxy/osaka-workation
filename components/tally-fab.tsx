"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ClipboardList } from "lucide-react";
import { SITE } from "@/lib/site";
import { useI18n } from "@/components/i18n-provider";
import { createClient } from "@/lib/supabase/client";

declare global {
  interface Window {
    Tally?: { openPopup: (id: string, options?: Record<string, unknown>) => void };
  }
}

export function TallyFab() {
  const { dict, locale } = useI18n();
  const [signedIn, setSignedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return;

    const supabase = createClient();
    let mounted = true;

    void supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      setSignedIn(!!data.user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(!!session?.user);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  function open() {
    if (signedIn) {
      router.push(`/${locale}/join`);
      return;
    }

    if (typeof window !== "undefined" && window.Tally) {
      window.Tally.openPopup(SITE.tallyId, {
        layout: "modal",
        width: 640,
        overlay: true,
      });
    } else {
      // Fallback if the embed script hasn't loaded yet.
      window.open(SITE.tallyUrl, "_blank", "noopener");
    }
  }

  return (
    <button
      type="button"
      onClick={open}
      data-tally-open={SITE.tallyId}
      data-tally-layout="modal"
      data-tally-width="640"
      data-tally-overlay="1"
      className="fixed bottom-5 right-5 z-[60] inline-flex items-center gap-2 rounded-full bg-brand-orange px-5 py-3.5 text-sm font-bold text-white shadow-[0_12px_30px_-8px_rgba(234,85,4,0.7)] transition-transform hover:scale-105 hover:bg-brand-orangeHover sm:bottom-7 sm:right-7"
      aria-label={dict.actions.joinWaitlist}
    >
      <ClipboardList className="h-4 w-4" />
      {dict.actions.joinWaitlist}
    </button>
  );
}
