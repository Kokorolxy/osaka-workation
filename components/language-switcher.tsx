"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Globe, Check, ChevronDown } from "lucide-react";
import { locales, localeNames, localeShort, isLocale } from "@/lib/i18n/config";
import { useLocale } from "./i18n-provider";

export function LanguageSwitcher() {
  const current = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  function switchTo(target: string) {
    const segments = pathname.split("/");
    // segments[0] === "", segments[1] === current locale
    if (isLocale(segments[1])) segments[1] = target;
    else segments.splice(1, 0, target);
    router.push(segments.join("/") || `/${target}`);
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        className="inline-flex items-center gap-1.5 rounded-full border border-paper-line bg-white px-3 py-2 text-sm font-medium text-brand-ink transition-colors hover:border-brand-orange/40"
        aria-label="Change language"
      >
        <Globe className="h-4 w-4 text-brand-orange" />
        {localeShort[current]}
        <ChevronDown className="h-3.5 w-3.5 text-muted" />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-40 overflow-hidden rounded-2xl border border-paper-line bg-white py-1 shadow-[0_18px_40px_-20px_rgba(15,15,15,0.35)]">
          {locales.map((l) => (
            <button
              key={l}
              type="button"
              onMouseDown={() => switchTo(l)}
              className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors hover:bg-paper-cream ${
                l === current ? "font-semibold text-brand-orange" : "text-brand-ink"
              }`}
            >
              {localeNames[l]}
              {l === current && <Check className="h-4 w-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
