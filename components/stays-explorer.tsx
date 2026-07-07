"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Check, ArrowUpRight, Users, User } from "lucide-react";
import { STAYS, STAY_TYPES, OCCUPANCY } from "@/lib/site";
import { useI18n } from "@/components/i18n-provider";

export function StaysExplorer() {
  const { dict } = useI18n();
  const s = dict.data.stays;

  // Merge structural stay data (type/occupancy/price/unit/image/url) with translated text.
  const stays = STAYS.map((base, i) => ({ ...base, ...s.listings[i] }));

  const [type, setType] = useState<string>("All");
  const [occ, setOcc] = useState<string>("All");

  const filtered = useMemo(
    () =>
      stays.filter(
        (item) =>
          (type === "All" || item.type === type) &&
          (occ === "All" || item.occupancy.includes(occ as never)),
      ),
    [type, occ, stays],
  );

  const unitLabel = (u: string) => (u === "night" ? s.perNight : s.perMonth);

  return (
    <div>
      {/* filters */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-bold uppercase tracking-[0.16em] text-muted">
            {s.typeLabel}
          </span>
          <Chip active={type === "All"} onClick={() => setType("All")}>
            {s.typeAll}
          </Chip>
          {STAY_TYPES.map((t) => (
            <Chip key={t} active={type === t} onClick={() => setType(t)}>
              {s.typeLabels[t] ?? t}
            </Chip>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-bold uppercase tracking-[0.16em] text-muted">
            {s.forLabel}
          </span>
          <Chip active={occ === "All"} onClick={() => setOcc("All")}>
            {s.typeAll}
          </Chip>
          {OCCUPANCY.map((o) => (
            <Chip key={o} active={occ === o} onClick={() => setOcc(o)}>
              {o === "Solo" ? (
                <User className="h-3.5 w-3.5" />
              ) : (
                <Users className="h-3.5 w-3.5" />
              )}
              {s.occupancy[o] ?? o}
            </Chip>
          ))}
        </div>
      </div>

      <p className="mt-6 text-sm text-muted">
        {filtered.length}{" "}
        {filtered.length === 1 ? s.resultsOne : s.resultsMany}
      </p>

      {/* grid */}
      <div className="mt-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <article
            key={item.name}
            className="group flex flex-col overflow-hidden rounded-3xl border border-paper-line bg-white transition-all hover:-translate-y-1 hover:border-brand-orange/40 hover:shadow-[0_18px_40px_-24px_rgba(15,15,15,0.35)]"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-ink backdrop-blur">
                {s.typeLabels[item.type] ?? item.type}
              </span>
              {item.badge && (
                <span className="absolute right-3 top-3 rounded-full bg-brand-orange px-3 py-1 text-xs font-bold text-white">
                  {item.badge}
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h3 className="text-lg font-bold text-brand-ink">{item.name}</h3>
              <p className="mt-1 text-sm text-muted">{item.area}</p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {item.occupancy.map((o) => (
                  <span
                    key={o}
                    className="inline-flex items-center gap-1 rounded-full bg-paper-cream px-2.5 py-1 text-xs font-medium text-brand-ink"
                  >
                    {o === "Solo" ? (
                      <User className="h-3 w-3 text-brand-orange" />
                    ) : (
                      <Users className="h-3 w-3 text-brand-orange" />
                    )}
                    {s.occupancy[o] ?? o}
                  </span>
                ))}
              </div>

              <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted">
                {item.perks.map((p) => (
                  <li key={p} className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-brand-orange" />
                    {p}
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex items-center justify-between border-t border-paper-line pt-4">
                <div>
                  <span className="text-lg font-bold text-brand-ink">
                    {item.price}
                  </span>
                  <span className="text-sm text-muted"> / {unitLabel(item.unit)}</span>
                </div>
                <a
                  href={item.url}
                  target={item.url.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-full bg-paper-cream px-4 py-2 text-sm font-semibold text-brand-ink transition-colors hover:bg-brand-orange hover:text-white"
                >
                  {s.view} <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-6 rounded-3xl border border-paper-line bg-white p-10 text-center text-muted">
          {s.empty}
        </div>
      )}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "border-brand-orange bg-brand-orange/10 text-brand-orange"
          : "border-paper-line bg-white text-muted hover:border-brand-orange/40 hover:text-brand-ink"
      }`}
    >
      {children}
    </button>
  );
}
