"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Sunrise, Laptop, Users, PartyPopper, Landmark, Droplets, Trees,
  Sparkles, type LucideIcon,
} from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import { PROGRAM, SCHEDULE_ADDONS, pick } from "@/lib/schedule";

const ICONS: Record<string, LucideIcon> = {
  sunrise: Sunrise,
  laptop: Laptop,
  users: Users,
  party: PartyPopper,
  landmark: Landmark,
  waterfall: Droplets,
  picnic: Trees,
  culture: Sparkles,
};

function Icon({ name, className }: { name: string; className?: string }) {
  const Cmp = ICONS[name] ?? Sparkles;
  return <Cmp className={className} strokeWidth={1.75} />;
}

export function WorkationSchedule() {
  const { locale, dict } = useI18n();
  const t = dict.pages.events;
  const [phase, setPhase] = useState(0);
  const active = PROGRAM.phases[phase];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-paper-line">
      <Image src="/img/timeline-bg.jpg" alt="" fill sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-br from-brand-ink/90 via-brand-ink/80 to-brand-ink/90" />

      <div className="relative p-6 sm:p-10">
        {/* daily rhythm strip */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-brand-orange">
            {pick(PROGRAM.rhythm.title, locale)}
          </h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {PROGRAM.rhythm.items.map((it) => (
              <div
                key={it.icon}
                className="flex items-start gap-3 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-orange/20 text-brand-orange">
                  <Icon name={it.icon} className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white">{pick(it.label, locale)}</p>
                  <p className="mt-0.5 text-xs leading-snug text-white/60">
                    {pick(it.note, locale)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* week tabs */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {PROGRAM.phases.map((p, i) => {
            const on = i === phase;
            return (
              <button
                key={i}
                type="button"
                onMouseEnter={() => setPhase(i)}
                onFocus={() => setPhase(i)}
                onClick={() => setPhase(i)}
                aria-pressed={on}
                className={`flex flex-1 items-center justify-between gap-3 rounded-2xl border px-5 py-4 text-left transition-all ${
                  on
                    ? "border-brand-orange bg-brand-orange/25 backdrop-blur"
                    : "border-white/20 bg-white/5 hover:bg-white/10"
                }`}
              >
                <span>
                  <span
                    className={`block text-sm font-bold uppercase tracking-[0.14em] ${
                      on ? "text-white" : "text-white/75"
                    }`}
                  >
                    {i === 0 ? t.schedWeek1 : t.schedWeek2}
                  </span>
                  <span className="mt-0.5 block text-xs text-white/55">
                    {pick(p.dates, locale)}
                  </span>
                </span>
                <span
                  className={`h-2.5 w-2.5 shrink-0 rounded-full ${on ? "bg-brand-orange" : "bg-white/25"}`}
                />
              </button>
            );
          })}
        </div>

        {/* active phase */}
        <div key={phase} className="animate-fade-up mt-6 rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-md sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-orange">
            {pick(active.week, locale)} · {pick(active.dates, locale)}
          </p>
          <h4 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            {pick(active.theme, locale)}
          </h4>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/70">
            {pick(active.body, locale)}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {active.highlights.map((h) => (
              <div
                key={h.icon + pick(h.label, "en")}
                className="flex items-center gap-3 rounded-2xl border border-brand-orange/40 bg-brand-orange/15 p-4"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-orange text-white">
                  <Icon name={h.icon} className="h-5 w-5" />
                </span>
                <p className="text-sm font-bold leading-snug text-white">
                  {pick(h.label, locale)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* optional add-ons */}
        <div className="mt-6 rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-md sm:p-7">
          <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-brand-orange">
            {pick(SCHEDULE_ADDONS.title, locale)}
          </h3>
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/85">
            {SCHEDULE_ADDONS.items.map((it) => (
              <li key={it.en} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
                {pick(it, locale)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
