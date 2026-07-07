"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Clock, MapPin } from "lucide-react";
import { FeatureIcon } from "@/components/feature-icon";
import { useI18n } from "@/components/i18n-provider";

const WORKATION_MONTH = 10; // November (0-indexed)

export function EventsCalendar() {
  const { dict } = useI18n();
  const t = dict.pages.events;
  const items = t.calItems;

  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setI((v) => (v + 1) % items.length), 4200);
    return () => clearInterval(id);
  }, [paused, items.length]);

  const active = items[i];

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
      {/* ANNUAL RHYTHM */}
      <div className="rounded-3xl border border-paper-line bg-white p-6 sm:p-8">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-brand-orange">
          <span className="h-2 w-2 rounded-full bg-brand-orange" />
          {t.calYearRound}
        </div>

        {/* meetup bar spanning the year */}
        <div className="relative mt-4 h-2.5 rounded-full bg-brand-orange/20">
          <div
            className="absolute top-0 h-2.5 rounded-full bg-brand-orange"
            style={{ left: `${(WORKATION_MONTH / 12) * 100}%`, width: `${(2 / 12) * 100}%` }}
          />
        </div>

        {/* months */}
        <div className="mt-2 grid grid-cols-12 gap-1 text-center">
          {t.calMonths.map((m, idx) => (
            <div
              key={m}
              className={`rounded-lg py-2 text-[10px] font-semibold sm:text-xs ${
                idx === WORKATION_MONTH || idx === WORKATION_MONTH + 1
                  ? "bg-brand-orange/10 text-brand-orange"
                  : "text-muted"
              }`}
            >
              {m}
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-end gap-2 text-sm font-bold text-brand-orange">
          <span className="rounded-full bg-brand-orange px-3 py-1 text-xs text-white">
            {t.calWorkation}
          </span>
        </div>
      </div>

      {/* UPCOMING CAROUSEL */}
      <div
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <p className="eyebrow mb-4">{t.calUpcoming}</p>

        <div
          key={i}
          className="animate-fade-up rounded-3xl border border-paper-line bg-white p-7"
        >
          <FeatureIcon name={active.icon} />
          <h3 className="mt-4 text-xl font-extrabold tracking-tight text-brand-ink">
            {active.title}
          </h3>
          <p className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-brand-orange">
            <Clock className="h-4 w-4" />
            {active.when}
          </p>
          <p className="mt-1.5 inline-flex items-center gap-2 text-sm text-muted">
            <MapPin className="h-4 w-4 text-brand-orange" />
            {active.where}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-1.5">
            {items.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Event ${idx + 1}`}
                onClick={() => setI(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  idx === i ? "w-6 bg-brand-orange" : "w-1.5 bg-brand-ink/15"
                }`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Previous"
              onClick={() => setI((v) => (v - 1 + items.length) % items.length)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-paper-line text-brand-ink transition-colors hover:border-brand-orange hover:text-brand-orange"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={() => setI((v) => (v + 1) % items.length)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-paper-line text-brand-ink transition-colors hover:border-brand-orange hover:text-brand-orange"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
