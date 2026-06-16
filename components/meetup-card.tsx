"use client";

import { useState } from "react";
import Image from "next/image";
import { FeatureIcon } from "@/components/feature-icon";

type Meetup = {
  icon: string;
  title: string;
  cadence: string;
  body: string;
  image: string;
  detail: string;
};

export function MeetupCard({ meetup }: { meetup: Meetup }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onClick={() => setOpen((v) => !v)}
      className="group relative h-80 cursor-pointer overflow-hidden rounded-3xl border border-paper-line bg-white"
    >
      {/* image revealed on hover/tap */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      >
        <Image
          src={meetup.image}
          alt={meetup.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/90 via-brand-ink/55 to-brand-ink/25" />
      </div>

      <div className="relative flex h-full flex-col p-6">
        <div
          className={`transition-opacity duration-300 ${open ? "opacity-0" : "opacity-100"}`}
        >
          <FeatureIcon name={meetup.icon} />
        </div>

        <div className="mt-auto">
          <h3
            className={`text-lg font-bold transition-colors ${
              open ? "text-white" : "text-brand-ink"
            }`}
          >
            {meetup.title}
          </h3>
          <p
            className={`mt-1 text-sm font-medium ${
              open ? "text-brand-orange" : "text-brand-orange"
            }`}
          >
            {meetup.cadence}
          </p>
          <p
            className={`mt-2 text-sm leading-relaxed transition-colors ${
              open ? "text-white/90" : "text-muted"
            }`}
          >
            {open ? meetup.detail : meetup.body}
          </p>
        </div>
      </div>
    </div>
  );
}
