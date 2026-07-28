"use client";

import Image from "next/image";
import { Sun, Moon, Sparkles, UsersRound } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import { SCHEDULE, SCHEDULE_ADDONS, pick, type ScheduleDay } from "@/lib/schedule";

function DayRow({ d }: { d: ScheduleDay }) {
  const { locale, dict } = useI18n();
  const t = dict.pages.events;
  const num = (locale === "ja" ? d.dateJa : d.date).replace(/[^0-9]/g, "");
  return (
    <div className="relative flex gap-4 pb-4">
      {/* timeline node */}
      <div
        className={`relative z-10 flex h-[52px] w-[52px] shrink-0 flex-col items-center justify-center rounded-2xl border text-center backdrop-blur ${
          d.highlight
            ? "border-brand-orange bg-brand-orange text-white"
            : "border-white/25 bg-white/10 text-white"
        }`}
      >
        <span className="text-lg font-extrabold leading-none">{num}</span>
        <span
          className={`mt-0.5 text-[9px] font-bold uppercase tracking-wide ${
            d.highlight ? "text-white/85" : "text-white/60"
          }`}
        >
          {pick(d.dow, locale)}
        </span>
      </div>

      {/* card */}
      <div
        className={`flex-1 rounded-2xl border p-4 backdrop-blur-md ${
          d.highlight
            ? "border-brand-orange/60 bg-brand-orange/25"
            : "border-white/15 bg-white/10"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {d.highlight && <Sparkles className="h-3.5 w-3.5 text-brand-orange" />}
            {d.cohortB && (
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-orange px-2 py-0.5 text-[10px] font-bold text-white">
                <UsersRound className="h-2.5 w-2.5" />
                {t.schedCohortBadge}
              </span>
            )}
          </div>
          <span className="shrink-0 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold text-white">
            {pick(d.price, locale)}
          </span>
        </div>

        <div className="mt-2 space-y-1.5 text-sm">
          <div className="flex gap-2">
            <Sun className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" />
            <span className="text-white/90">{pick(d.day, locale)}</span>
          </div>
          <div className="flex gap-2">
            <Moon className="mt-0.5 h-4 w-4 shrink-0 text-white/55" />
            <span className="text-white/90">{pick(d.night, locale)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function WeekColumn({ label, days }: { label: string; days: ScheduleDay[] }) {
  return (
    <div>
      <div className="mb-5 flex items-center gap-2.5">
        <span className="flex h-7 items-center rounded-full bg-white/15 px-3 text-xs font-bold uppercase tracking-[0.14em] text-white backdrop-blur">
          {label}
        </span>
      </div>
      <div className="relative">
        <div
          className="absolute left-[26px] top-4 bottom-8 w-px bg-white/20"
          aria-hidden
        />
        {days.map((d) => (
          <DayRow key={d.date} d={d} />
        ))}
      </div>
    </div>
  );
}

export function WorkationSchedule() {
  const { locale, dict } = useI18n();
  const t = dict.pages.events;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-paper-line">
      <Image
        src="/img/timeline-bg.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-brand-ink/90 via-brand-ink/80 to-brand-ink/90" />

      <div className="relative p-6 sm:p-10">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <WeekColumn label={t.schedWeek1} days={SCHEDULE.slice(0, 7)} />
          <WeekColumn label={t.schedWeek2} days={SCHEDULE.slice(7)} />
        </div>

        {/* add-ons */}
        <div className="mt-8 rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-md sm:p-7">
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
