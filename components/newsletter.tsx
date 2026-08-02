"use client";

import { ArrowRight } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import { L } from "@/components/locale-link";

export function Newsletter() {
  const { dict } = useI18n();

  return (
    <L href="/join" className="btn-primary w-full sm:w-auto">
      {dict.ui.newsletter.join} <ArrowRight className="h-4 w-4" />
    </L>
  );
}
