import { getTimes } from "suncalc";

export const CLOCK_LOCATION = {
  city: "Una",
  state: "HP",
  country: "India",
  latitude: 31.4685,
  longitude: 76.2708,
  timezone: "Asia/Kolkata",
} as const;

export type SolarTimes = { sunrise: Date; sunset: Date };

export function getSolarDate(now: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: CLOCK_LOCATION.timezone,
    year: "numeric", month: "2-digit", day: "2-digit",
  }).format(now);
}

export function getSolarTimes(now: Date): SolarTimes | null {
  try {
    // Anchor at noon in India so visitors in other zones use the correct solar day.
    const day = new Date(`${getSolarDate(now)}T12:00:00+05:30`);
    const { sunrise, sunset } = getTimes(day, CLOCK_LOCATION.latitude, CLOCK_LOCATION.longitude);
    if (!sunrise || !sunset || !Number.isFinite(sunrise.getTime()) || !Number.isFinite(sunset.getTime()) || sunset <= sunrise) return null;
    return { sunrise, sunset };
  } catch {
    return null;
  }
}

export function getDaylightProgress(now: Date, times: SolarTimes): number {
  const progress = (now.getTime() - times.sunrise.getTime()) / (times.sunset.getTime() - times.sunrise.getTime());
  return Number.isFinite(progress) ? Math.min(1, Math.max(0, progress)) : 0;
}

export function getSunPosition(progress: number): { x: number; y: number } {
  const angle = Math.PI * (1 - Math.min(1, Math.max(0, progress)));
  return { x: 100 + 90 * Math.cos(angle), y: 100 - 90 * Math.sin(angle) };
}
