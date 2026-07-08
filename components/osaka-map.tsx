"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import { useI18n } from "@/components/i18n-provider";

type Spot = {
  en: string;
  ja: string;
  lat: number;
  lng: number;
  kind: "stay" | "spot";
  dir: "left" | "right";
};

const SPOTS: Spot[] = [
  { en: "Umeda", ja: "梅田", lat: 34.7025, lng: 135.4959, kind: "stay", dir: "right" },
  { en: "Nakazakicho", ja: "中崎町", lat: 34.706, lng: 135.5016, kind: "stay", dir: "right" },
  { en: "Osaka Castle", ja: "大阪城", lat: 34.6873, lng: 135.5262, kind: "spot", dir: "right" },
  { en: "Shinsaibashi", ja: "心斎橋", lat: 34.6723, lng: 135.5006, kind: "stay", dir: "left" },
  { en: "Dotonbori", ja: "道頓堀", lat: 34.6686, lng: 135.5028, kind: "spot", dir: "right" },
  { en: "Namba", ja: "難波", lat: 34.6635, lng: 135.5010, kind: "stay", dir: "left" },
  { en: "Tennoji", ja: "天王寺", lat: 34.6465, lng: 135.5133, kind: "stay", dir: "right" },
];

export function OsakaMap() {
  const { locale } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      const el = ref.current;
      if (!el || cancelled) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((el as any)._leaflet_id) return;

      const map = L.map(el, {
        scrollWheelZoom: false,
        zoomControl: true,
        attributionControl: true,
      }).setView([34.6795, 135.51], 12);
      mapRef.current = map;

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        {
          maxZoom: 19,
          attribution:
            '&copy; OpenStreetMap &copy; CARTO',
        },
      ).addTo(map);

      SPOTS.forEach((s) => {
        const name = locale === "ja" ? s.ja : s.en;
        const icon = L.divIcon({
          className: "",
          html: `<div class="ow-pin ${s.kind === "spot" ? "ow-pin--spot" : ""}"></div>`,
          iconSize: [18, 18],
          iconAnchor: [9, 9],
        });
        L.marker([s.lat, s.lng], { icon })
          .addTo(map)
          .bindTooltip(name, {
            permanent: true,
            direction: s.dir,
            className: "ow-tip",
            offset: s.dir === "right" ? [10, 0] : [-10, 0],
          });
      });

      setTimeout(() => map.invalidateSize(), 200);
    })();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [locale]);

  return (
    <div
      ref={ref}
      className="relative z-0 h-[440px] w-full overflow-hidden rounded-3xl border border-paper-line"
    />
  );
}
