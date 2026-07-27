/**
 * Workation packages — single place to edit names, copy, and prices in development.
 *
 * Prices are JPY integers (no decimals). Stripe Checkout uses these via `event_options.price_jpy`
 * after you apply / re-seed the migration that syncs from this file’s keys.
 *
 * After changing prices here:
 * 1. Update `supabase/migrations/*_workation_packages.sql` seed values (or run a new migration)
 * 2. Or update rows in Studio: `update event_options set price_jpy = … where key = '…'`
 * 3. Restart / refresh Join so Stripe charges the new amount
 */

export type HousingMode = "none" | "singular" | "shared";

export type WorkationPackage = {
  /** Stable key stored on `event_registrations.package_key` / `event_options.key` */
  key: string;
  name: string;
  /** Short line under the name on Join */
  tagline: string;
  description: string;
  /** EDIT ME — price in Japanese yen */
  priceJpy: number;
  housing: HousingMode;
  includesTransport: boolean;
  /** Shown as bullets on Join / marketing */
  features: string[];
  sortOrder: number;
  popular?: boolean;
};

/**
 * ─── EDIT PACKAGE PRICES HERE ─────────────────────────────────────────────
 * Change only the numbers. Keys must stay in sync with WORKATION_PACKAGES below.
 */
export const WORKATION_PACKAGE_PRICES = {
  coworking_no_transport: 35_000,
  coworking_with_transport: 45_000,
  singular_housing_no_transport: 75_000,
  shared_housing_no_transport: 65_000,
  singular_housing_with_transport: 85_000,
  shared_housing_with_transport: 75_000,
} as const satisfies Record<string, number>;

export type WorkationPackageKey = keyof typeof WORKATION_PACKAGE_PRICES;

/**
 * Flagship November Workation packages.
 * Coworking = shared workspace ~2 days/week + weekend group activities.
 * Transport = activity / weekend trip transportation as an add-on option.
 */
export const WORKATION_PACKAGES: WorkationPackage[] = [
  {
    key: "coworking_no_transport",
    name: "Coworking + weekends",
    tagline: "No housing · no transport",
    description:
      "Access to the shared coworking space (~2 days/week) and weekend group activities. Activity tickets included; transportation not included.",
    priceJpy: WORKATION_PACKAGE_PRICES.coworking_no_transport,
    housing: "none",
    includesTransport: false,
    features: [
      "Coworking access (~2 days/week)",
      "Weekend group activities",
      "Activity tickets included",
      "Transportation not included",
      "Housing not included",
    ],
    sortOrder: 1,
  },
  {
    key: "coworking_with_transport",
    name: "Coworking + weekends + transport",
    tagline: "No housing · with transport",
    description:
      "Same coworking and weekend activities, with transportation to group activities included.",
    priceJpy: WORKATION_PACKAGE_PRICES.coworking_with_transport,
    housing: "none",
    includesTransport: true,
    features: [
      "Coworking access (~2 days/week)",
      "Weekend group activities",
      "Activity tickets included",
      "Transportation included",
      "Housing not included",
    ],
    sortOrder: 2,
  },
  {
    key: "singular_housing_no_transport",
    name: "Private housing + coworking",
    tagline: "Singular housing · no transport",
    description:
      "Your own (non-shared) housing for the Workation, plus coworking and weekend activities without transportation.",
    priceJpy: WORKATION_PACKAGE_PRICES.singular_housing_no_transport,
    housing: "singular",
    includesTransport: false,
    features: [
      "Singular (private) housing",
      "Coworking access (~2 days/week)",
      "Weekend group activities",
      "Activity tickets included",
      "Transportation not included",
    ],
    sortOrder: 3,
    popular: true,
  },
  {
    key: "shared_housing_no_transport",
    name: "Shared housing + coworking",
    tagline: "Shared with participants · no transport",
    description:
      "Housing shared with other participants, plus coworking and weekend activities without transportation.",
    priceJpy: WORKATION_PACKAGE_PRICES.shared_housing_no_transport,
    housing: "shared",
    includesTransport: false,
    features: [
      "Shared housing with participants",
      "Coworking access (~2 days/week)",
      "Weekend group activities",
      "Activity tickets included",
      "Transportation not included",
    ],
    sortOrder: 4,
  },
  {
    key: "singular_housing_with_transport",
    name: "Private housing + transport",
    tagline: "Singular housing · with transport",
    description:
      "Private housing, coworking, weekend activities, and transportation to group activities.",
    priceJpy: WORKATION_PACKAGE_PRICES.singular_housing_with_transport,
    housing: "singular",
    includesTransport: true,
    features: [
      "Singular (private) housing",
      "Coworking access (~2 days/week)",
      "Weekend group activities",
      "Activity tickets included",
      "Transportation included",
    ],
    sortOrder: 5,
  },
  {
    key: "shared_housing_with_transport",
    name: "Shared housing + transport",
    tagline: "Shared with participants · with transport",
    description:
      "Shared housing with other participants, coworking, weekend activities, and transportation.",
    priceJpy: WORKATION_PACKAGE_PRICES.shared_housing_with_transport,
    housing: "shared",
    includesTransport: true,
    features: [
      "Shared housing with participants",
      "Coworking access (~2 days/week)",
      "Weekend group activities",
      "Activity tickets included",
      "Transportation included",
    ],
    sortOrder: 6,
  },
];

export function getWorkationPackage(key: string): WorkationPackage | undefined {
  return WORKATION_PACKAGES.find((p) => p.key === key);
}

/** Packages that include housing (singular or shared) — no separate stay picker needed. */
export const PACKAGES_WITH_HOUSING = new Set(
  WORKATION_PACKAGES.filter((p) => p.housing !== "none").map((p) => p.key),
);

export function stayKeyForPackage(packageKey: string): string | null {
  const pkg = getWorkationPackage(packageKey);
  if (!pkg || pkg.housing === "none") return null;
  return pkg.housing;
}

export function formatPackagePriceJpy(priceJpy: number): string {
  return `¥${priceJpy.toLocaleString("en-US")}`;
}
