"use client";

import { useEffect, useState } from "react";

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
  const [t, setT] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    setT(diff());
    const id = setInterval(() => setT(diff()), 1000);
    return () => clearInterval(id);
  }, []);

  const cells = [
    { v: t.days, l: "Days" },
    { v: t.hours, l: "Hours" },
    { v: t.mins, l: "Min" },
    { v: t.secs, l: "Sec" },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3">
      {cells.map((c) => (
        <div
          key={c.l}
          className="rounded-2xl border border-white/15 bg-white/5 px-2 py-3 text-center backdrop-blur"
        >
          <div className="text-2xl font-extrabold tabular-nums text-white sm:text-3xl">
            {String(c.v).padStart(2, "0")}
          </div>
          <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/55">
            {c.l}
          </div>
        </div>
      ))}
    </div>
  );
}
