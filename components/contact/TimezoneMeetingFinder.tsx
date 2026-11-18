"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarClock, Globe2 } from "lucide-react";

const indiaTimeZone = "Asia/Kolkata";
const halfHour = 30 * 60 * 1000;
const timeZones = [
  { label: "London, UK", value: "Europe/London" },
  { label: "New York, USA", value: "America/New_York" },
  { label: "Los Angeles, USA", value: "America/Los_Angeles" },
  { label: "Toronto, Canada", value: "America/Toronto" },
  { label: "São Paulo, Brazil", value: "America/Sao_Paulo" },
  { label: "Berlin, Germany", value: "Europe/Berlin" },
  { label: "Dubai, UAE", value: "Asia/Dubai" },
  { label: "Singapore", value: "Asia/Singapore" },
  { label: "Tokyo, Japan", value: "Asia/Tokyo" },
  { label: "Sydney, Australia", value: "Australia/Sydney" },
  { label: "Auckland, New Zealand", value: "Pacific/Auckland" },
];

type MeetingSlot = {
  timestamp: number;
  client: string;
  india: string;
};

function getLocalParts(formatter: Intl.DateTimeFormat, date: Date) {
  const parts = Object.fromEntries(formatter.formatToParts(date).map(({ type, value }) => [type, value]));
  return {
    hour: Number(parts.hour),
    weekday: parts.weekday,
    dateKey: `${parts.year}-${parts.month}-${parts.day}`,
  };
}

function findMeetingSlots(timeZone: string, now: Date): MeetingSlot[] {
  const options: Intl.DateTimeFormatOptions = {
    timeZone,
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
  };
  const clientParts = new Intl.DateTimeFormat("en-GB", options);
  const indiaParts = new Intl.DateTimeFormat("en-GB", { ...options, timeZone: indiaTimeZone });
  const clientLabel = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
  const indiaLabel = new Intl.DateTimeFormat("en-US", {
    timeZone: indiaTimeZone,
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
  const seenDays = new Set<string>();
  const slots: MeetingSlot[] = [];
  const start = Math.ceil((now.getTime() + halfHour) / halfHour) * halfHour;

  for (let timestamp = start; timestamp < start + 7 * 24 * 60 * 60 * 1000 && slots.length < 3; timestamp += halfHour) {
    const date = new Date(timestamp);
    const client = getLocalParts(clientParts, date);
    const india = getLocalParts(indiaParts, date);
    if (
      client.weekday === "Sat" || client.weekday === "Sun" ||
      india.weekday === "Sat" || india.weekday === "Sun" ||
      client.hour < 8 || client.hour >= 21 ||
      india.hour < 8 || india.hour >= 21 ||
      seenDays.has(client.dateKey)
    ) continue;

    seenDays.add(client.dateKey);
    slots.push({
      timestamp,
      client: clientLabel.format(date),
      india: indiaLabel.format(date),
    });
  }

  return slots;
}

export default function TimezoneMeetingFinder() {
  const [timeZone, setTimeZone] = useState("Europe/London");
  const [localTimeZone, setLocalTimeZone] = useState<string | null>(null);
  const [now, setNow] = useState<Date | null>(null);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    const initial = window.setTimeout(() => {
      const detectedTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (detectedTimeZone) {
        setLocalTimeZone(detectedTimeZone);
        setTimeZone(detectedTimeZone);
      }
      setNow(new Date());
    }, 0);
    const timer = window.setInterval(() => setNow(new Date()), 60_000);
    return () => {
      window.clearTimeout(initial);
      window.clearInterval(timer);
    };
  }, []);

  const slots = useMemo(() => now ? findMeetingSlots(timeZone, now) : [], [timeZone, now]);
  const selectedSlot = slots.find((slot) => slot.timestamp === selected);

  return (
    <section aria-labelledby="meeting-finder-heading" className="grid gap-8 rounded-3xl border border-line bg-surface p-7 sm:col-span-2 sm:p-9 lg:col-span-4 lg:grid-cols-2 lg:gap-12">
      <div className="min-w-0">
        <div className="flex items-center gap-3 text-accent">
          <Globe2 aria-hidden="true" className="size-6" />
          <p className="text-xs font-semibold uppercase tracking-[0.24em]">Across time zones</p>
        </div>
        <h3 id="meeting-finder-heading" className="mt-5 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Timezone Meeting Finder
        </h3>
        <p className="mt-3 max-w-md text-base leading-7 text-secondary">
          Find a shared daytime window between your location and Una, India. All times adjust for local daylight saving time.
        </p>
        <label htmlFor="client-time-zone" className="mt-7 block text-sm font-semibold text-foreground">Your time zone</label>
        <select
          id="client-time-zone"
          value={timeZone}
          onChange={(event) => { setTimeZone(event.target.value); setSelected(null); }}
          className="mt-2 min-h-12 w-full max-w-sm rounded-xl border border-line bg-surface-elevated px-4 text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {localTimeZone && !timeZones.some(({ value }) => value === localTimeZone) && (
            <option value={localTimeZone}>Your location ({localTimeZone.replaceAll("_", " ")})</option>
          )}
          {timeZones.map(({ label, value }) => <option key={value} value={value}>{label}</option>)}
        </select>
        <p className="mt-3 text-xs leading-5 text-muted">Suggested 30-minute windows, weekdays, 8 am–9 pm in both places. Times are not bookings.</p>
      </div>

      <div className="min-w-0">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
          <CalendarClock aria-hidden="true" className="size-5 text-accent" />
          Next shared daytime slots
        </div>
        <div className="grid gap-3">
          {!now && <p className="rounded-xl border border-line bg-surface-elevated p-4 text-sm text-secondary">Finding times...</p>}
          {now && slots.length === 0 && <p className="rounded-xl border border-line bg-surface-elevated p-4 text-sm text-secondary">No shared daytime slots in the next seven days.</p>}
          {slots.map((slot) => (
            <button
              key={slot.timestamp}
              type="button"
              aria-pressed={selected === slot.timestamp}
              onClick={() => setSelected(slot.timestamp)}
              className={`w-full rounded-xl border p-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${selected === slot.timestamp ? "border-accent bg-surface-soft-accent" : "border-line bg-surface-elevated hover:border-accent"}`}
            >
              <span className="block text-sm font-semibold text-foreground">{slot.client} <span className="font-normal text-muted">your time</span></span>
              <span className="mt-1 block text-sm text-secondary">{slot.india} <span className="text-muted">in Una</span></span>
            </button>
          ))}
        </div>
        {selectedSlot && (
          <p className="mt-4 text-sm text-secondary" role="status">
            Selected: {selectedSlot.client} for you, {selectedSlot.india} in Una.
          </p>
        )}
      </div>
    </section>
  );
}
