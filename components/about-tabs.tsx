"use client";

import { useState } from "react";
import { Instagram, Users, CalendarDays, ArrowRight, type LucideIcon } from "lucide-react";
import { L } from "@/components/locale-link";
import { useI18n } from "@/components/i18n-provider";
import { SITE } from "@/lib/site";

const META: Record<
  string,
  { icon: LucideIcon; href: string; external: boolean }
> = {
  social: { icon: Instagram, href: SITE.instagram, external: true },
  meetups: { icon: Users, href: "/events#meetups", external: false },
  workation: { icon: CalendarDays, href: "/events#workation", external: false },
};

export function AboutTabs() {
  const { dict } = useI18n();
  const tabs = dict.pages.about.tabs;
  const [active, setActive] = useState(0);
  const tab = tabs[active];
  const meta = META[tab.key] ?? META.social;
  const Icon = meta.icon;

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <div className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
        {tabs.map((tb, i) => {
          const m = META[tb.key] ?? META.social;
          const TIcon = m.icon;
          return (
            <button
              key={tb.key}
              type="button"
              onClick={() => setActive(i)}
              className={`flex shrink-0 items-center gap-3 rounded-2xl border px-5 py-4 text-left text-sm font-semibold transition-all lg:shrink ${
                i === active
                  ? "border-brand-orange bg-brand-orange/10 text-brand-ink"
                  : "border-paper-line bg-white text-muted hover:border-brand-orange/40 hover:text-brand-ink"
              }`}
            >
              <TIcon
                className={`h-5 w-5 ${i === active ? "text-brand-orange" : "text-muted-soft"}`}
                strokeWidth={1.75}
              />
              {tb.label}
            </button>
          );
        })}
      </div>

      <div
        key={tab.key}
        className="animate-fade-up rounded-3xl border border-paper-line bg-white p-8 sm:p-10"
      >
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-orange/10 text-brand-orange">
          <Icon className="h-6 w-6" strokeWidth={1.75} />
        </span>
        <h3 className="mt-5 text-2xl font-extrabold tracking-tight text-brand-ink">
          {tab.headline}
        </h3>
        <p className="mt-3 max-w-xl leading-relaxed text-muted">{tab.body}</p>
        <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-brand-ink/80">
          {tab.points.map((p) => (
            <li key={p} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
              {p}
            </li>
          ))}
        </ul>
        <div className="mt-7">
          {meta.external ? (
            <a
              href={meta.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-orange hover:text-brand-orangeHover"
            >
              {tab.cta} <ArrowRight className="h-4 w-4" />
            </a>
          ) : (
            <L
              href={meta.href}
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-orange hover:text-brand-orangeHover"
            >
              {tab.cta} <ArrowRight className="h-4 w-4" />
            </L>
          )}
        </div>
      </div>
    </div>
  );
}
