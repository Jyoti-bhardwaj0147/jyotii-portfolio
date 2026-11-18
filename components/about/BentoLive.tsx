"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import Image from "next/image";
import { Clock3, MapPin, Sun, ThermometerSnowflake, ThermometerSun } from "lucide-react";

import { motion, useReducedMotion } from "motion/react";
import { CLOCK_LOCATION, getSolarDate, getSolarTimes, getDaylightProgress, getSunPosition, type SolarTimes } from "@/lib/solar";

const CLOCK_BACKGROUND = "/images/about/clock-bg.webp";

type Weather = {
  temperature: number;
  high: number;
  low: number;
  code: number;
  isDay: boolean;
};

function weatherCondition(code: number, isDay: boolean) {
  if (code === 0 || code === 1) return { label: isDay ? "Clear skies" : "Clear night", icon: isDay ? "clear-day" : "clear-night" };
  if (code === 2) return { label: "Partly cloudy", icon: isDay ? "partly-cloudy-day" : "partly-cloudy-night" };
  if (code === 3) return { label: "Cloudy", icon: "overcast" };
  if (code === 45 || code === 48) return { label: "Foggy", icon: "fog" };
  if (code >= 51 && code <= 57) return { label: "Rain or drizzle", icon: "drizzle" };
  if (code >= 61 && code <= 67) return { label: "Rain or drizzle", icon: "rain" };
  if (code >= 71 && code <= 77) return { label: "Snowy", icon: "snow" };
  if (code >= 80 && code <= 82) return { label: "Rain showers", icon: "rain" };
  if (code >= 85 && code <= 86) return { label: "Snow showers", icon: "snow" };
  if (code >= 95) return { label: "Thunderstorms", icon: isDay ? "thunderstorms-day-rain" : "thunderstorms-night-rain" };
  return { label: "Current conditions", icon: isDay ? "partly-cloudy-day" : "partly-cloudy-night" };
}

export function ClockCard() {
  const [now, setNow] = useState<Date | null>(null);
  const [daylight, setDaylight] = useState<{ times: SolarTimes; progress: number; isDay: boolean } | null>(null);
  const reduceMotion = useReducedMotion();
  const gradientId = useId();

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let solarDate = "";
    let times: SolarTimes | null = null;
    const update = () => {
      const current = new Date();
      const date = getSolarDate(current);
      if (date !== solarDate) {
        solarDate = date;
        times = getSolarTimes(current);
      }
      setDaylight(times ? {
        times,
        progress: getDaylightProgress(current, times),
        isDay: current >= times.sunrise && current <= times.sunset,
      } : null);
    };
    update();
    const timer = window.setInterval(update, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const formatter = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: CLOCK_LOCATION.timezone,
  });
  const time = now ? formatter.format(now) : "--:--";
  const sun = daylight ? getSunPosition(daylight.progress) : null;

  return (
    <motion.article initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} whileHover={reduceMotion ? undefined : { y: -3 }} transition={{ duration: reduceMotion ? 0 : 0.25 }} className="relative isolate flex min-h-48 flex-col justify-between overflow-hidden rounded-3xl border border-line bg-surface p-7">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20 bg-cover bg-center" style={{ backgroundImage: CLOCK_BACKGROUND ? `url("${CLOCK_BACKGROUND}")` : undefined }} />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(155deg,var(--surface)_15%,rgba(8,7,12,0.75)_50%,rgba(8,7,12,0.5)),radial-gradient(ellipse_at_top_right,var(--accent),transparent_75%)]" />

      
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="font-display text-4xl font-bold tabular-nums text-foreground sm:text-5xl" aria-live="off">{time}</p>
        {daylight && (
          <div className="ml-auto mt-auto grid w-full max-w-44 grid-cols-2 items-start gap-y-1 pt-1 text-xs leading-tight text-secondary" aria-label={`Sunrise and sunset in ${CLOCK_LOCATION.city}, India Standard Time`}>
            {sun && (
              <svg aria-hidden="true" viewBox="0 0 200 110" className="pointer-events-none col-span-2 block w-[55.556%] justify-self-center overflow-visible" style={{ opacity: daylight.isDay ? 0.65 : 0.25 }}>
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
                    <stop stopColor="#fbbf24" />
                    <stop offset="1" stopColor="var(--accent)" />
                  </linearGradient>
                </defs>
                <path d="M 10 100 A 90 90 0 0 1 190 100" fill="none" stroke={`url(#${gradientId})`} strokeWidth="3" />
                <motion.g initial={false} animate={{ x: sun.x - 14, y: sun.y - 14, opacity: daylight.isDay ? 1 : 0 }} transition={{ duration: reduceMotion ? 0 : 0.8, ease: "easeOut" }}>
                  <Sun width={30} height={30} fill="#f9b11a" stroke="#f9b11a" className="text-amber-300 drop-shadow-[0_0_4px_rgba(251,191,36,0.4)]" />
                </motion.g>
              </svg>
            )}
            <span className="grid min-w-0 grid-cols-[1rem_auto] items-start justify-self-center gap-x-1.5">
              <Image src="/images/meteocons/animated/sunrise.svg" alt="" aria-hidden="true" width={30} height={30} unoptimized className="size-4 shrink-0" />
              <span className="flex flex-col gap-1">
                <span className="whitespace-nowrap font-medium tabular-nums text-foreground">{formatter.format(daylight.times.sunrise)}</span>
                <span>Sunrise</span>
              </span>
            </span>
            <span className="grid min-w-0 grid-cols-[1rem_auto] items-start justify-self-center gap-x-1.5">
              <Image src="/images/meteocons/animated/sunset.svg" alt="" aria-hidden="true" width={40} height={40} unoptimized className="size-4 shrink-0" />
              <span className="flex flex-col gap-1">
                <span className="whitespace-nowrap font-medium tabular-nums text-foreground">{formatter.format(daylight.times.sunset)}</span>
                <span>Sunset</span>
              </span>
            </span>
          </div>
        )}
      </div>
    </motion.article>
  );
}

export function WeatherCard() {
  const [weather, setWeather] = useState<Weather | "unavailable" | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const controller = new AbortController();
    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.searchParams.set("latitude", "31.46493");
    url.searchParams.set("longitude", "76.26914");
    url.searchParams.set("current", "temperature_2m,weather_code,is_day");
    url.searchParams.set("daily", "temperature_2m_max,temperature_2m_min");
    url.searchParams.set("timezone", "Asia/Kolkata");
    url.searchParams.set("forecast_days", "1");

    fetch(url, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Weather request failed");
        return response.json();
      })
      .then((data) => {
        const current = data.current;
        const daily = data.daily;
        if (
          typeof current?.temperature_2m !== "number" ||
          typeof current?.weather_code !== "number" ||
          typeof current?.is_day !== "number" ||
          typeof daily?.temperature_2m_max?.[0] !== "number" ||
          typeof daily?.temperature_2m_min?.[0] !== "number"
        ) {
          throw new Error("Weather response incomplete");
        }
        setWeather({
          temperature: current.temperature_2m,
          high: daily.temperature_2m_max[0],
          low: daily.temperature_2m_min[0],
          code: current.weather_code,
          isDay: current.is_day === 1,
        });
      })
      .catch(() => {
        if (!controller.signal.aborted) setWeather("unavailable");
      });

    return () => controller.abort();
  }, []);

  const condition = weather && weather !== "unavailable"
    ? weatherCondition(weather.code, weather.isDay)
    : { label: "", icon: "partly-cloudy-day" };

  return (
    <motion.article initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} whileHover={reduceMotion ? undefined : { y: -3 }} transition={{ duration: reduceMotion ? 0 : 0.25 }} className="flex min-h-48 flex-col justify-between rounded-3xl border border-line bg-surface-soft-accent p-7">
      <div className="flex items-start justify-between">
        <div aria-live="polite">
        {weather === null && <p className="text-base text-secondary">Loading weather...</p>}
        {weather === "unavailable" && <p className="text-base text-secondary">Weather unavailable right now.</p>}
        {weather && weather !== "unavailable" && (
          <>
            <p className="font-display text-4xl font-bold tabular-nums text-foreground sm:text-5xl">{Math.round(weather.temperature)}°C</p>
            <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-secondary"><span className="inline-flex items-center gap-1"><ThermometerSun aria-hidden="true" className="size-4" />{Math.round(weather.high)}°</span><span aria-hidden="true">/</span><span className="inline-flex items-center gap-1"><ThermometerSnowflake aria-hidden="true" className="size-4" />{Math.round(weather.low)}°</span></p>
            
          </>
        )}
      </div>
        <picture className="block size-16 shrink-0 sm:size-18">
          <source media="(prefers-reduced-motion: reduce)" srcSet={`/images/meteocons/static/${condition.icon}.svg`} />
          <Image src={`/images/meteocons/animated/${condition.icon}.svg`} alt="" aria-hidden="true" width={64} height={64} unoptimized className="size-full" />
        </picture>
      </div>
      <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-secondary"><MapPin aria-hidden="true" className="size-4" />Una, HP, India</p>
    </motion.article>
  );
}

export function GithubCardLink({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.a href="https://github.com/Jyoti-bhardwaj0147" target="_blank" rel="noopener noreferrer" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} whileHover={reduceMotion ? undefined : { y: -3 }} transition={{ duration: reduceMotion ? 0 : 0.25 }} className="group flex min-h-60 flex-col justify-between rounded-3xl border border-line bg-surface-elevated p-7 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:col-span-2 sm:p-9">
      {children}
    </motion.a>
  );
}
