import { MY_TIMEZONE } from "./timezones";

const MINUTE = 60_000;
const DAY = 24 * 60 * MINUTE;
function partsFormatter(timeZone: string) {
  return new Intl.DateTimeFormat("en-GB", { timeZone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
}
function readParts(formatter: Intl.DateTimeFormat, date: Date | number) {
  const p = Object.fromEntries(formatter.formatToParts(date).map(({ type, value }) => [type, value]));
  return { date: `${p.year}-${p.month}-${p.day}`, minutes: Number(p.hour) * 60 + Number(p.minute), year: Number(p.year), month: Number(p.month), day: Number(p.day) };
}
export function localHour(date: Date, zone: string) {
  return Math.floor(readParts(partsFormatter(zone), date).minutes / 60);
}
export function formatTime(date: Date | number, zone: string, locale = "en-US") {
  return new Intl.DateTimeFormat(locale, { timeZone: zone, hour: "2-digit", minute: "2-digit" }).format(date);
}
export function durationLabel(minutes: number) {
  return [Math.floor(minutes / 60) ? `${Math.floor(minutes / 60)}h` : "", minutes % 60 ? `${minutes % 60}m` : ""].filter(Boolean).join(" ") || "0m";
}
export function timeDifference(now: Date, zone: string) {
  const wallClock = (timeZone: string) => {
    const p = readParts(partsFormatter(timeZone), now);
    return Date.UTC(p.year, p.month - 1, p.day, 0, p.minutes);
  };
  const difference = (wallClock(zone) - wallClock(MY_TIMEZONE)) / MINUTE;
  return difference === 0 ? "We share the same local time" : `You're ${durationLabel(Math.abs(difference))} ${difference > 0 ? "ahead of" : "behind"} me`;
}
export type Overlap = { start: number; end: number; minutes: number };

/** Compare today's full India working day. Intl resolves real instants through DST.
 * Minute resolution supports quarter-hour zones without hardcoded offsets. */
export function findOverlap(zone: string, now: Date): Overlap | null {
  const mine = partsFormatter(MY_TIMEZONE);
  const theirs = partsFormatter(zone);
  const today = readParts(mine, now).date;
  const anchor = Math.floor(now.getTime() / DAY) * DAY;
  let start: number | null = null;
  let end = 0;
  for (let t = anchor - DAY; t < anchor + DAY * 2; t += MINUTE) {
    const india = readParts(mine, t);
    if (india.date !== today || india.minutes < 600 || india.minutes >= 1140) continue;
    const client = readParts(theirs, t);
    if (client.minutes < 540 || client.minutes >= 1020) continue;
    start ??= t;
    end = t + MINUTE;
  }
  return start === null ? null : { start, end, minutes: (end - start) / MINUTE };
}
