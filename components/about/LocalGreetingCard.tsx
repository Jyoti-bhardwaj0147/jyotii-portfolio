"use client";

import { useEffect, useState } from "react";
import { Globe2 } from "lucide-react";
import ToolCard from "./ToolCard";
import { detectVisitor } from "@/lib/visitor";
import { getGreeting } from "@/lib/greetings";
import { formatTime, localHour, timeDifference } from "@/lib/time-utils";
import type { Visitor } from "@/types/visitor";

export default function LocalGreetingCard() {
  const [data, setData] = useState<{ visitor: Visitor | null; now: Date } | null>(null);
  useEffect(() => {
    const update = () => {
      try {
        setData({ visitor: detectVisitor(navigator.language, Intl.DateTimeFormat().resolvedOptions().timeZone), now: new Date() });
      } catch { setData({ visitor: null, now: new Date() }); }
    };
    const initial = window.setTimeout(update, 0);
    const timer = window.setInterval(update, 60_000);
    return () => { window.clearTimeout(initial); window.clearInterval(timer); };
  }, []);
  const visitor = data?.visitor;
  const hour = visitor && data ? localHour(data.now, visitor.timezone) : 12;
  const greeting = getGreeting(visitor?.locale, visitor?.country, hour);
  const country = visitor?.country ? new Intl.DisplayNames(["en"], { type: "region" }).of(visitor.country) : undefined;
  const late = hour >= 23 || hour < 5;

  return (
    <ToolCard label="Your local greeting" locationBackground>
      <div className="flex items-center justify-between gap-3 text-secondary"><p className="font-mono text-xs uppercase tracking-widest">A world of possibilities</p><Globe2 aria-hidden="true" className="size-5 shrink-0 text-accent" /></div>
      <div className="flex min-h-64 flex-col justify-center py-8">
        {!data ? <div role="status" className="space-y-4"><span className="sr-only">Finding your local time</span><div className="h-8 w-3/4 rounded bg-surface-elevated motion-safe:animate-pulse" /><div className="h-4 w-1/2 rounded bg-surface-elevated motion-safe:animate-pulse" /></div> : <>
          <h3 className="break-words font-playfair   text-3xl font-bold leading-snug text-foreground">
            {!visitor ? "Hello from your corner of the world \u{1f44b}" : late ? `Working late${visitor.city ? ` in ${visitor.city}` : ""}? \u{1f319}` : <><span lang={greeting.language}>{greeting.text}</span>{country ? `, ${country}` : ""} {"\u{1f44b}"}</>}
          </h3>
          {visitor && <><p className="mt-4 text-lg tabular-nums text-foreground">{formatTime(data.now, visitor.timezone, visitor.locale)}{visitor.city ? ` in ${visitor.city}` : " local time"}</p><p className="mt-2 text-sm text-secondary">{timeDifference(data.now, visitor.timezone)}</p></>}
        </>}
      </div>
      
    </ToolCard>
  );
}
