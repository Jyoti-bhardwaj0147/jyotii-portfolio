import type { Visitor } from "../types/visitor";
import { clientLocations } from "./timezones";

export function getVisitorBackground(visitor: Visitor): string | undefined {
  if (visitor.timezone === "Asia/Kolkata" || visitor.timezone === "Asia/Calcutta") {
    return "/images/locations/india.jpg";
  }
  const location = clientLocations.find((location) => location.zone === visitor.timezone);
  if (location) return location.background;
  if (visitor.country === "IN") return "/images/locations/india.jpg";
  return clientLocations.find((location) => location.country === visitor.country)?.background;
}

export function detectVisitor(locale: string, timezone: string): Visitor {
  // A timezone reference city is not a claim of precise physical location.
  const known = clientLocations.find((location) => location.zone === timezone);
  let region: string | undefined;
  try { region = new Intl.Locale(locale).region; } catch { locale = "en"; }
  const india = timezone === "Asia/Kolkata" || timezone === "Asia/Calcutta";
  const country = known?.country ?? (india ? "IN" : region);
  return { locale, timezone, country, city: timezone.includes("/") ? timezone.split("/").at(-1)?.replaceAll("_", " ") : undefined };
}
