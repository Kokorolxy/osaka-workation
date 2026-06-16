"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { FeatureIcon } from "@/components/feature-icon";
import { WORKATION } from "@/lib/site";

export function IncludesGrid() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {WORKATION.includes.map((item, i) => {
        const isOpen = open === i;
        return (
          <button
            key={item.title}
            type="button"
            aria-expanded={isOpen}
            onClick={() => setOpen(isOpen ? null : i)}
            className={`flex flex-col rounded-2xl border p-6 text-left transition-all ${
              isOpen
                ? "border-brand-orange bg-white shadow-[0_18px_40px_-26px_rgba(234,85,4,0.55)]"
                : "border-paper-line bg-white hover:-translate-y-1 hover:border-brand-orange/40"
            }`}
          >
            <div className="flex items-start justify-between">
              <FeatureIcon name={item.icon} />
              <span
                className={`mt-1 flex h-7 w-7 items-center justify-center rounded-full border transition-transform ${
                  isOpen
                    ? "rotate-45 border-brand-orange bg-brand-orange text-white"
                    : "border-paper-line text-muted"
                }`}
              >
                <Plus className="h-4 w-4" />
              </span>
            </div>
            <h3 className="mt-4 text-lg font-bold text-brand-ink">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {item.body}
            </p>
            <div
              className={`grid transition-all duration-300 ${
                isOpen ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="border-t border-paper-line pt-3 text-sm leading-relaxed text-brand-ink/80">
                  {item.detail}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
