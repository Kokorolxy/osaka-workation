import type { Locale } from "./config";
import type { Dictionary } from "./dictionaries/en";
import { en } from "./dictionaries/en";
import { ja } from "./dictionaries/ja";

const dictionaries: Record<Locale, Dictionary> = { en, ja };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? en;
}
