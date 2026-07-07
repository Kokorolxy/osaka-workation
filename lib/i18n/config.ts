export const locales = ["en", "ja"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

// Display names for the language switcher (in their own language).
export const localeNames: Record<Locale, string> = {
  en: "English",
  ja: "日本語",
};

// Short labels shown in the switcher button.
export const localeShort: Record<Locale, string> = {
  en: "EN",
  ja: "日本語",
};

// hreflang codes.
export const localeHreflang: Record<Locale, string> = {
  en: "en",
  ja: "ja",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
