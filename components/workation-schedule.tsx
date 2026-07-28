"use client";

import { Sun, Moon, Sparkles, UsersRound } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import { SCHEDULE, SCHEDULE_ADDONS, pick, type ScheduleDay } from "@/lib/schedule";

function DayCard({ d }: { d: ScheduleDay }) {
  const { locale, dict } = useI18n();
  const t = dict.pages.events;
  return (
    <div
      className={`rounded-2xl border p-5 ${
        d.highlight
          ? "border-brand-orange/40 bg-brand-orange/[0.06]"
          : "border-paper-line bg-white"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-baseline gap-2">
          <span className="text-base font-extrabold text-brand-ink">
            {locale === "ja" ? d.dateJa : d.date}
          </span>
          <span className="text-xs font-semibold uppercase tracking-wide text-muted">
            {pick(d.dow, locale)}
          </span>
          {d.highlight && (
            <Sparkles className="h-3.5 w-3.5 text-brand-orange" />
          )}
        </div>
        <span className="shrink-0 rounded-full bg-paper-cream px-2.5 py-1 text-xs font-semibold text-brand-ink">
          {pick(d.price, locale)}
        </span>
      </div>

      {d.cohortB && (
        <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-brand-orange px-2.5 py-1 text-[11px] font-bold text-white">
          <UsersRound className="h-3 w-3" />
          {t.schedCohortBadge}
        </div>
      )}

      <div className="mt-3 space-y-2 text-sm">
        <div className="flex gap-2.5">
          <Sun className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" />
          <div>
            <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-muted">
              {t.schedDaytime}
            </span>
            <span className="text-brand-ink/85">{pick(d.day, locale)}</span>
          </div>
        </div>
        <div className="flex gap-2.5">
          <Moon className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" />
          <div>
            <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-muted">
              {t.schedEvening}
            </span>
            <span className="text-brand-ink/85">{pick(d.night, locale)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function WorkationSchedule() {
  const { locale, dict } = useI18n();
  const t = dict.pages.events;
  const week1 = SCHEDULE.slice(0, 7);
  const week2 = SCHEDULE.slice(7);

  return (
    <div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-brand-orange" />
            <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-brand-ink">
              {t.schedWeek1}
            </h3>
          </div>
          <div className="space-y-4">
            {week1.map((d) => (
              <DayCard key={d.date} d={d} />
            ))}
          </div>
        </div>
        <div>
          <div className="mb-4 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-brand-orange" />
            <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-brand-ink">
              {t.schedWeek2}
            </h3>
          </div>
          <div className="space-y-4">
            {week2.map((d) => (
              <DayCard key={d.date} d={d} />
            ))}
          </div>
        </div>
      </div>

      {/* add-ons */}
      <div className="mt-8 rounded-3xl border border-paper-line bg-paper-sand p-6 sm:p-7">
        <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-brand-orange">
          {pick(SCHEDULE_ADDONS.title, locale)}
        </h3>
        <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-brand-ink/80">
          {SCHEDULE_ADDONS.items.map((it) => (
            <li key={it.en} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
              {pick(it, locale)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
