"use client";

import { useState } from "react";
import Image from "next/image";
import { Clock } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";

export function WorkationTimeline() {
  const { dict } = useI18n();
  const schedule = dict.data.workation.schedule;
  const [active, setActive] = useState(0);
  const step = schedule[active];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-paper-line">
      <Image
        src="/img/timeline-bg.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-brand-ink/85 via-brand-ink/70 to-brand-ink/85" />

      <div className="relative grid gap-8 p-8 sm:p-12 lg:grid-cols-[0.9fr_1.1fr]">
        {/* clickable phases */}
        <div className="flex flex-wrap gap-2 lg:flex-col">
          {schedule.map((s, i) => {
            const on = i === active;
            return (
              <button
                key={s.title}
                type="button"
                onClick={() => setActive(i)}
                className={`group flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all ${
                  on
                    ? "border-brand-orange bg-brand-orange/20 backdrop-blur"
                    : "border-white/20 bg-white/5 hover:border-white/50 hover:bg-white/10"
                }`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    on ? "bg-brand-orange text-white" : "bg-white/15 text-white"
                  }`}
                >
                  {i + 1}
                </span>
                <span
                  className={`text-sm font-semibold ${
                    on ? "text-white" : "text-white/80"
                  }`}
                >
                  {s.phase}
                </span>
              </button>
            );
          })}
        </div>

        {/* detail panel */}
        <div
          key={active}
          className="animate-fade-up self-center rounded-2xl border border-white/15 bg-white/10 p-7 backdrop-blur-md"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
            {step.phase}
          </span>
          <h3 className="mt-4 text-2xl font-extrabold tracking-tight text-white">
            {step.title}
          </h3>
          <p className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-brand-orange">
            <Clock className="h-4 w-4" />
            {step.time}
          </p>
          <p className="mt-3 leading-relaxed text-white/85">{step.body}</p>
        </div>
      </div>
    </div>
  );
}
