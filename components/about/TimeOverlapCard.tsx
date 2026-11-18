"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowDownUp, CalendarClock, Check } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import ToolCard from "./ToolCard";
import { MY_TIMEZONE } from "@/lib/timezones";
import { durationLabel, findOverlap, formatTime } from "@/lib/time-utils";
import { detectVisitor } from "@/lib/visitor";

export default function TimeOverlapCard() {
  const reduce = useReducedMotion();
  const [zone, setZone] = useState<string | null>(null);
  const [country, setCountry] = useState<string | null>(null);
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const initial = window.setTimeout(() => {
      try {
        const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (detected) {
          setZone(detected);
          const visitor = detectVisitor(navigator.language, detected);
          if (visitor.country) {
            setCountry(
              new Intl.DisplayNames(["en"], { type: "region" }).of(
                visitor.country,
              ) ?? null,
            );
          }
        }
      } catch {
        /* Keep the local-time fallback if detection is unavailable. */
      }
      setNow(new Date());
    }, 0);
    const timer = window.setInterval(() => setNow(new Date()), 60_000);
    return () => {
      window.clearTimeout(initial);
      window.clearInterval(timer);
    };
  }, []);
  const overlap = useMemo(
    () => (now && zone ? findOverlap(zone, now) : null),
    [now, zone],
  );
  const date = now
    ? new Intl.DateTimeFormat("en-US", {
        timeZone: MY_TIMEZONE,
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(now)
    : null;
  const range = (timezone: string) =>
    overlap
      ? `${formatTime(overlap.start, timezone)} \u2013 ${formatTime(overlap.end, timezone)}`
      : "";
  return (
    <ToolCard label="Best time to connect">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-xl font-bold text-foreground">
          Best time to connect
        </h3>
        <CalendarClock
          aria-hidden="true"
          className="size-5 shrink-0 text-accent"
        />
      </div>
      <div role="status" aria-atomic="true" className="min-h-48 py-5">
        {!now ? (
          <p className="text-sm text-secondary">Finding your shared hours...</p>
        ) : (
          <motion.div
            key={`${zone}-${date}`}
            initial={reduce ? false : { opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.2 }}
          >
            <p className="font-mono text-xs text-secondary break-words">
              Your time &middot; {country ?? "Your location"}
            </p>
            {!zone ? (
              <p className="py-8 text-lg text-foreground">
                Your timezone is unavailable right now.
              </p>
            ) : overlap ? (
              <>
                <p className="mt-1 text-lg font-semibold tabular-nums text-foreground">
                  {range(zone)}
                </p>
                <ArrowDownUp
                  aria-hidden="true"
                  className="my-3 size-4 text-accent"
                />
                <p className="font-mono text-xs text-secondary">
                  My time &middot; India
                </p>
                <p className="mt-1 text-lg font-semibold tabular-nums text-foreground">
                  {range(MY_TIMEZONE)}
                </p>
                <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-foreground">
                  <span>{durationLabel(overlap.minutes)} overlap</span>
                  {/* <span className="flex items-center gap-1">
                    {overlap.minutes >= 120 ? (
                      <>
                        <Check
                          aria-hidden="true"
                          className="size-4 text-accent"
                        />
                        Great overlap
                      </>
                    ) : (
                      "Limited overlap"
                    )}
                  </span> */}
                </p>
              </>
            ) : (
              <p className="py-8 text-lg text-foreground">
                No direct overlap &mdash; async works too
              </p>
            )}
          </motion.div>
        )}
      </div>
    </ToolCard>
  );
}
