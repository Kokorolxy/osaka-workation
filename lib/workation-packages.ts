/**
 * Workation tickets — edit prices & limits here (development).
 *
 * Sync DB `event_options.price_jpy` after price changes (migration or Studio).
 * Stripe Checkout reads amounts from `event_options`.
 */

export type TicketDuration = "week1" | "week2";
export type PricingTier = "general" | "early_bird" | "referral";

export type WorkationPackage = {
  key: string;
  name: string;
  tagline: string;
  description: string;
  priceJpy: number;
  duration: TicketDuration;
  pricingTier: PricingTier;
  features: string[];
  excluded: string[];
  sortOrder: number;
  popular?: boolean;
};

/** ─── EDIT PRICES (JPY) ─────────────────────────────────────────────────── */
export const WORKATION_TICKET_PRICES = {
  week2: {
    general: 65_000,
    /** 10% off — Early bird or referral */
    discounted: 58_500,
  },
  week1: {
    general: 38_500,
    discounted: 34_650,
  },
} as const;

/** ─── EDIT LIMITS ───────────────────────────────────────────────────────── */
export const EARLY_BIRD_LIMIT = 20;
export const DISCOUNT_PERCENT = 10;

export const TICKET_INCLUDES = [
  "Coworking space access",
  "Workation t-shirt",
  "Community access",
  "Welcome party with meals",
  "Farewell party with meals",
  "2 tour guides (recommendations, company & travel expense help)",
  "Cultural experiences with guides",
  "1 daytime + 1 nighttime community event per day (included)",
] as const;

export const TICKET_EXCLUDES = [
  "Random day/night pop-up events not included in price",
  "Weekend city day-tour transportation not included",
  "Other weekend tour expenses not included",
] as const;

const SHARED_DESCRIPTION =
  "Coworking, community, welcome & farewell parties with meals, two guides for cultural experiences and travel tips, plus one day and one night community event each day. Weekend city tours are guided (plan only); transport and other expenses are extra. Random pop-up events are not included.";

function priceFor(duration: TicketDuration, tier: PricingTier): number {
  const table = WORKATION_TICKET_PRICES[duration];
  return tier === "general" ? table.general : table.discounted;
}

function packageKey(duration: TicketDuration, tier: PricingTier): string {
  return `${duration}_${tier}`;
}

function durationLabel(duration: TicketDuration): string {
  return duration === "week1" ? "1 week" : "2 weeks";
}

function tierLabel(tier: PricingTier): string {
  switch (tier) {
    case "general":
      return "General";
    case "early_bird":
      return "Early bird";
    case "referral":
      return "Referral";
  }
}

function buildPackage(
  duration: TicketDuration,
  tier: PricingTier,
  sortOrder: number,
  popular?: boolean,
): WorkationPackage {
  const weeks = durationLabel(duration);
  return {
    key: packageKey(duration, tier),
    name: `${weeks} · ${tierLabel(tier)}`,
    tagline:
      tier === "general"
        ? `Full ticket · ${weeks}`
        : `${DISCOUNT_PERCENT}% off · ${weeks}`,
    description: SHARED_DESCRIPTION,
    priceJpy: priceFor(duration, tier),
    duration,
    pricingTier: tier,
    features: [...TICKET_INCLUDES],
    excluded: [...TICKET_EXCLUDES],
    sortOrder,
    popular,
  };
}

/**
 * All sellable ticket SKUs (duration × pricing path).
 * Early bird & referral share the same discounted price; they differ by eligibility rules.
 */
export const WORKATION_PACKAGES: WorkationPackage[] = [
  buildPackage("week2", "general", 1, true),
  buildPackage("week2", "early_bird", 2),
  buildPackage("week2", "referral", 3),
  buildPackage("week1", "general", 4),
  buildPackage("week1", "early_bird", 5),
  buildPackage("week1", "referral", 6),
];

export type WorkationPackageKey = (typeof WORKATION_PACKAGES)[number]["key"];

export function getWorkationPackage(key: string): WorkationPackage | undefined {
  return WORKATION_PACKAGES.find((p) => p.key === key);
}

export function resolvePackageKey(
  duration: TicketDuration,
  tier: PricingTier,
): string {
  return packageKey(duration, tier);
}

export function formatPackagePriceJpy(priceJpy: number): string {
  return `¥${priceJpy.toLocaleString("en-US")}`;
}

/** Marketing / Join duration cards */
export const WORKATION_DURATIONS: {
  key: TicketDuration;
  name: string;
  generalPriceJpy: number;
  discountedPriceJpy: number;
}[] = [
  {
    key: "week2",
    name: "2 weeks",
    generalPriceJpy: WORKATION_TICKET_PRICES.week2.general,
    discountedPriceJpy: WORKATION_TICKET_PRICES.week2.discounted,
  },
  {
    key: "week1",
    name: "1 week",
    generalPriceJpy: WORKATION_TICKET_PRICES.week1.general,
    discountedPriceJpy: WORKATION_TICKET_PRICES.week1.discounted,
  },
];

/** @deprecated Housing is no longer part of tickets */
export const PACKAGES_WITH_HOUSING = new Set<string>();

export function stayKeyForPackage(_packageKey: string): string | null {
  return null;
}
