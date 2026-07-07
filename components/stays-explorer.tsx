"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Check, ArrowUpRight, Users, User } from "lucide-react";
import { STAYS, STAY_TYPES, OCCUPANCY } from "@/lib/site";

export function StaysExplorer() {
  const [type, setType] = useState<string>("All");
  const [occ, setOcc] = useState<string>("All");

  const filtered = useMemo(
    () =>
      STAYS.filter(
        (s) =>
          (type === "All" || s.type === type) &&
          (occ === "All" || s.occupancy.includes(occ as never)),
      ),
    [type, occ],
  );

  return (
    <div>
      {/* filters */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-bold uppercase tracking-[0.16em] text-muted">
            Type
          </span>
          {["All", ...STAY_TYPES].map((t) => (
            <Chip key={t} active={type === t} onClick={() => setType(t)}>
              {t}
            </Chip>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-bold uppercase tracking-[0.16em] text-muted">
            For
          </span>
          {["All", ...OCCUPANCY].map((o) => (
            <Chip key={o} active={occ === o} onClick={() => setOcc(o)}>
              {o === "Solo" && <User className="h-3.5 w-3.5" />}
              {o === "Group" && <Users className="h-3.5 w-3.5" />}
              {o}
            </Chip>
          ))}
        </div>
      </div>

      <p className="mt-6 text-sm text-muted">
        {filtered.length} {filtered.length === 1 ? "stay" : "stays"}
      </p>

      {/* grid */}
      <div className="mt-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((s) => (
          <article
            key={s.name}
            className="group flex flex-col overflow-hidden rounded-3xl border border-paper-line bg-white transition-all hover:-translate-y-1 hover:border-brand-orange/40 hover:shadow-[0_18px_40px_-24px_rgba(15,15,15,0.35)]"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={s.image}
                alt={s.name}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-ink backdrop-blur">
                {s.type}
              </span>
              {s.badge && (
                <span className="absolute right-3 top-3 rounded-full bg-brand-orange px-3 py-1 text-xs font-bold text-white">
                  {s.badge}
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-bold text-brand-ink">{s.name}</h3>
              </div>
              <p className="mt-1 text-sm text-muted">{s.area}</p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {s.occupancy.map((o) => (
                  <span
                    key={o}
                    className="inline-flex items-center gap-1 rounded-full bg-paper-cream px-2.5 py-1 text-xs font-medium text-brand-ink"
                  >
                    {o === "Solo" ? (
                      <User className="h-3 w-3 text-brand-orange" />
                    ) : (
                      <Users className="h-3 w-3 text-brand-orange" />
                    )}
                    {o}
                  </span>
                ))}
              </div>

              <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted">
                {s.perks.map((p) => (
                  <li key={p} className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-brand-orange" />
                    {p}
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex items-center justify-between border-t border-paper-line pt-4">
                <div>
                  <span className="text-lg font-bold text-brand-ink">
                    {s.price}
                  </span>
                  <span className="text-sm text-muted"> / {s.unit}</span>
                </div>
                <a
                  href={s.url}
                  target={s.url.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-full bg-paper-cream px-4 py-2 text-sm font-semibold text-brand-ink transition-colors hover:bg-brand-orange hover:text-white"
                >
                  View <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-6 rounded-3xl border border-paper-line bg-white p-10 text-center text-muted">
          No stays match that combination yet — try a different filter.
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
