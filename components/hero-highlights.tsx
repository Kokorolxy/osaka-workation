"use client";

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { FeatureIcon } from "@/components/feature-icon";
import { useI18n } from "@/components/i18n-provider";

export function HeroHighlights() {
  const { dict } = useI18n();
  const items = dict.data.whyOsaka;
  const home = dict.pages.home;
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setI((v) => (v + 1) % items.length), 3600);
    return () => clearInterval(id);
  }, [paused, items.length]);

  const item = items[i];

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="rounded-3xl border border-paper-line bg-white/85 p-6 shadow-[0_24px_60px_-30px_rgba(15,15,15,0.4)] backdrop-blur-md sm:p-8"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-orange">
          {home.whyHighlightLabel}
        </span>
        <div className="flex gap-1.5">
          {items.map((_, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`Highlight ${idx + 1}`}
              onClick={() => setI(idx)}
              className={`h-1.5 rounded-full transition-all ${
                idx === i ? "w-6 bg-brand-orange" : "w-1.5 bg-brand-ink/15"
              }`}
            />
          ))}
        </div>
      </div>

      <div key={i} className="animate-fade-up mt-6 min-h-[150px]">
        <FeatureIcon name={item.icon} />
        <h3 className="mt-4 text-2xl font-extrabold tracking-tight text-brand-ink">
          {item.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-paper-line pt-5 text-sm">
        <span className="flex items-center gap-2 text-muted">
          <MapPin className="h-4 w-4 text-brand-orange" />
          {home.heroLocation}
        </span>
        <span className="font-semibold text-brand-ink">{home.heroMembers}</span>
      </div>
    </div>
  );
}
