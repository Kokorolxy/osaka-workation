import Link from "next/link";

export function SectionHeading({
  eyebrow,
  title,
  body,
  align = "left",
  className = "",
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={`${align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"} ${className}`}
    >
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-brand-cream sm:text-4xl">
        {title}
      </h2>
      {body && (
        <p className="mt-4 text-base leading-relaxed text-white/60">{body}</p>
      )}
    </div>
  );
}

const MARQUEE_ITEMS = [
  ["Work from Osaka", "大阪で働く"],
  ["Join the community", "コミュニティに参加"],
  ["Live like a local", "地元のように暮らす"],
  ["Explore Japan", "日本を探検"],
  ["Meet fellow nomads", "仲間と出会う"],
];

export function Marquee() {
  const row = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="relative flex overflow-hidden border-y border-ink-border bg-ink-800 py-4">
      <div className="flex shrink-0 animate-marquee items-center gap-8 pr-8">
        {row.map((item, i) => (
          <span key={i} className="flex items-center gap-8 whitespace-nowrap">
            <span className="text-sm font-semibold text-white">{item[0]}</span>
            <span className="text-sm text-white/40">{item[1]}</span>
            <span className="text-brand-orange">◦</span>
          </span>
        ))}
      </div>
      <div
        className="flex shrink-0 animate-marquee items-center gap-8 pr-8"
        aria-hidden
      >
        {row.map((item, i) => (
          <span key={i} className="flex items-center gap-8 whitespace-nowrap">
            <span className="text-sm font-semibold text-white">{item[0]}</span>
            <span className="text-sm text-white/40">{item[1]}</span>
            <span className="text-brand-orange">◦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function CTAStrip({
  title,
  body,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: {
  title: string;
  body: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <section className="container-page py-20">
      <div className="relative overflow-hidden rounded-3xl border border-brand-orange/30 bg-gradient-to-br from-brand-orange/20 via-ink-700 to-ink-800 px-8 py-14 text-center sm:px-14">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-orange/30 blur-3xl" />
        <h2 className="relative text-3xl font-extrabold tracking-tight text-brand-cream sm:text-4xl">
          {title}
        </h2>
        <p className="relative mx-auto mt-4 max-w-xl text-white/70">{body}</p>
        <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href={primaryHref} className="btn-primary">
            {primaryLabel}
          </Link>
          {secondaryHref && secondaryLabel && (
            <Link href={secondaryHref} className="btn-ghost">
              {secondaryLabel}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
