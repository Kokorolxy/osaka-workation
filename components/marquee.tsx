"use client";

import { useI18n } from "@/components/i18n-provider";

function Row({ ariaHidden = false }: { ariaHidden?: boolean }) {
  const { dict } = useI18n();
  const items = [...dict.marquee, ...dict.marquee];
  return (
    <div
      className="flex shrink-0 animate-marquee items-center gap-8 pr-8"
      aria-hidden={ariaHidden}
    >
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-8 whitespace-nowrap">
          <span className="text-sm font-semibold text-brand-ink">{item[0]}</span>
          <span className="text-sm text-muted-soft">{item[1]}</span>
          <span className="text-brand-orange">◦</span>
        </span>
      ))}
    </div>
  );
}

export function Marquee() {
  return (
    <div className="relative flex overflow-hidden border-y border-paper-line bg-white py-4">
      <Row />
      <Row ariaHidden />
    </div>
  );
}
