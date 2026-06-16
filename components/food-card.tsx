"use client";

import { useState } from "react";
import Image from "next/image";
import { Star } from "lucide-react";

type Food = {
  image: string;
  label: string;
  blurb: string;
  shops: { name: string; area: string }[];
};

export function FoodCard({ food }: { food: Food }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onClick={() => setOpen((v) => !v)}
      className="group relative aspect-[5/4] cursor-pointer overflow-hidden rounded-3xl border border-paper-line"
    >
      <Image
        src={food.image}
        alt={food.label}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div
        className={`absolute inset-0 transition-colors duration-300 ${
          open
            ? "bg-brand-ink/85"
            : "bg-gradient-to-t from-brand-ink/70 to-transparent"
        }`}
      />

      {/* label (visible when closed) */}
      <span
        className={`absolute bottom-4 left-5 text-lg font-bold text-white transition-opacity duration-300 ${
          open ? "opacity-0" : "opacity-100"
        }`}
      >
        {food.label}
      </span>

      {/* shop list (revealed) */}
      <div
        className={`absolute inset-0 flex flex-col justify-center p-6 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex items-center gap-2 text-brand-orange">
          <Star className="h-4 w-4 fill-brand-orange" />
          <span className="text-xs font-bold uppercase tracking-[0.16em]">
            {food.blurb}
          </span>
        </div>
        <h3 className="mt-1 text-xl font-extrabold text-white">{food.label}</h3>
        <ol className="mt-3 space-y-2">
          {food.shops.map((s, i) => (
            <li key={s.name} className="flex items-center gap-3 text-sm">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-orange text-[11px] font-bold text-white">
                {i + 1}
              </span>
              <span className="font-semibold text-white">{s.name}</span>
              <span className="text-white/60">· {s.area}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
