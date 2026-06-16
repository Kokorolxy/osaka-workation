"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const POOL = Array.from({ length: 12 }, (_, i) => `/img/wall-${i + 1}.jpg`);
const SLOTS = 8;

export function PhotoWall() {
  const [tiles, setTiles] = useState<string[]>(() => POOL.slice(0, SLOTS));

  useEffect(() => {
    const id = setInterval(() => {
      setTiles((prev) => {
        const next = [...prev];
        const slot = Math.floor(Math.random() * SLOTS);
        const candidates = POOL.filter((p) => !next.includes(p));
        if (candidates.length) {
          next[slot] =
            candidates[Math.floor(Math.random() * candidates.length)];
        }
        return next;
      });
    }, 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {tiles.map((src, i) => (
        <div
          key={i}
          className="relative aspect-square overflow-hidden rounded-2xl border border-paper-line"
        >
          <Image
            key={src}
            src={src}
            alt="Life in Osaka with the community"
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="animate-fade-in object-cover"
          />
        </div>
      ))}
    </div>
  );
}
