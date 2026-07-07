"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/components/i18n-provider";

// First day of November 2026 (Osaka time, approx).
const TARGET = new Date("2026-11-02T09:00:00+09:00").getTime();

function diff() {
  const now = Date.now();
  const d = Math.max(0, TARGET - now);
  return {
    days: Math.floor(d / 86400000),
    hours: Math.floor((d / 3600000) % 24),
    mins: Math.floor((d / 60000) % 60),
    secs: Math.floor((d / 1000) % 60),
  };
}

export function Countdown() {
  const { dict } = useI18n();
  const [t, setT] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    setT(diff());
    const id = setInterval(() => setT(diff()), 1000);
    return () => clearInterval(id);
  }, []);

  const cells = [
    { v: t.days, l: dict.ui.countdown.days },
    { v: t.hours, l: dict.ui.countdown.hours },
    { v: t.mins, l: dict.ui.countdown.mins },
    { v: t.secs, l: dict.ui.countdown.secs },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3">
      {cells.map((c) => (
        <div
          key={c.l}
          className="rounded-2xl border border-paper-line bg-paper-cream px-2 py-3 text-center"
        >
          <div className="text-2xl font-extrabold tabular-nums text-brand-orange sm:text-3xl">
            {String(c.v).padStart(2, "0")}
          </div>
          <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
            {c.l}
          </div>
        </div>
      ))}
    </div>
  );
}
