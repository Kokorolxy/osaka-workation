"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { SITE } from "@/lib/site";
import { useI18n } from "@/components/i18n-provider";
import { useAuthState } from "@/components/auth-state-provider";

export function Newsletter() {
  const { dict, locale } = useI18n();
  const { signedIn } = useAuthState();
  const router = useRouter();

  function open() {
    if (signedIn) {
      router.push(`/${locale}/join`);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    if (w.Tally?.openPopup) {
      w.Tally.openPopup(SITE.tallyId, {
        layout: "modal",
        width: 640,
        overlay: true,
      });
    } else {
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
      className="btn-primary w-full sm:w-auto"
    >
      {dict.ui.newsletter.join} <ArrowRight className="h-4 w-4" />
    </button>
  );
}
