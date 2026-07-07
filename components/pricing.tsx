"use client";

import { useState } from "react";
import { Check, ArrowRight } from "lucide-react";
import { PRICING } from "@/lib/site";
import { L } from "@/components/locale-link";
import { useI18n } from "@/components/i18n-provider";

export function Pricing() {
  const { dict } = useI18n();
  const p = dict.data.pricing;

  // Merge structural pricing (price/period/checkout) with translated text by index.
  const tiers = PRICING.map((base, i) => ({ ...base, ...p.tiers[i] }));

  const [selected, setSelected] = useState(
    Math.max(0, tiers.findIndex((t) => t.popular)),
  );
  const active = tiers[selected];
  const activePrice =
    "earlyBird" in active && active.earlyBird ? active.earlyBird : active.price;

  return (
    <div>
      <div className="grid gap-5 md:grid-cols-3">
        {tiers.map((tier, i) => {
          const isActive = i === selected;
          const early = "earlyBird" in tier ? tier.earlyBird : undefined;
          return (
            <button
              key={tier.key}
              type="button"
              aria-pressed={isActive}
              onClick={() => setSelected(i)}
              className={`relative flex flex-col rounded-3xl border p-7 text-left transition-all ${
                isActive
                  ? "border-brand-orange bg-white shadow-[0_24px_50px_-28px_rgba(234,85,4,0.6)] ring-1 ring-brand-orange"
                  : "border-paper-line bg-white hover:-translate-y-1 hover:border-brand-orange/40"
              }`}
            >
              {tier.popular && (
                <span className="absolute right-5 top-5 rounded-full bg-brand-orange px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                  {p.mostPopular}
                </span>
              )}
              <span className="text-sm font-semibold text-muted">
                {tier.name}
              </span>
              <span className="text-xs text-muted-soft">{tier.tagline}</span>

              <span className="mt-3 flex items-end gap-2">
                <span className="text-3xl font-extrabold tracking-tight text-brand-ink">
                  {early ?? tier.price}
                </span>
                {early && (
                  <span className="pb-1 text-sm text-muted line-through">
                    {tier.price}
                  </span>
                )}
              </span>
              <span className="mt-1 text-sm text-brand-orange">
                {tier.period} · {tier.note}
              </span>

              <ul className="mt-5 space-y-2.5 text-sm text-brand-ink/80">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" />
                    {f}
                  </li>
                ))}
              </ul>

              <span
                className={`mt-6 inline-flex items-center gap-2 text-sm font-bold ${
                  isActive ? "text-brand-orange" : "text-muted"
                }`}
              >
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                    isActive
                      ? "border-brand-orange bg-brand-orange"
                      : "border-paper-line"
                  }`}
                >
                  {isActive && <Check className="h-3 w-3 text-white" />}
                </span>
                {isActive ? p.selected : p.select}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-3xl border border-paper-line bg-paper-cream p-6 sm:flex-row">
        <p className="text-sm text-muted">
          {p.pickedPrefix} <b className="text-brand-ink">{active.name}</b>{" "}
          {p.pickedMid} <span className="text-brand-ink">{activePrice}</span> ·{" "}
          {active.period}.{" "}
          {active.checkoutUrl ? p.securePrompt : p.waitlistPrompt}
        </p>
        {active.checkoutUrl ? (
          <a
            href={active.checkoutUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-primary whitespace-nowrap"
          >
            {p.buyTicket} <ArrowRight className="h-4 w-4" />
          </a>
        ) : (
          <L href="/#newsletter" className="btn-primary whitespace-nowrap">
            {p.reserve} <ArrowRight className="h-4 w-4" />
          </L>
        )}
      </div>

      <p className="mx-auto mt-4 max-w-2xl text-center text-xs text-muted-soft">
        {p.note}
      </p>
    </div>
  );
}
