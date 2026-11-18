import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import ts from "typescript";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const requireDependency = createRequire(import.meta.url);

// Compile only the local modules under test using the project's existing TypeScript.
const cache = new Map();
function load(relative) {
  const filename = path.resolve(__dirname, "..", relative);
  if (cache.has(filename)) return cache.get(filename).exports;
  const compiledModule = { exports: {} };
  cache.set(filename, compiledModule);
  const source = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2020 },
    fileName: filename,
  }).outputText;
  const localRequire = (name) => {
    if (!name.startsWith(".") && !name.startsWith("@/")) return requireDependency(name);
    const base = name.startsWith("@/") ? path.resolve(__dirname, "..", name.slice(2)) : path.resolve(path.dirname(filename), name);
    const file = [base, `${base}.ts`, `${base}.tsx`].find((file) => fs.existsSync(file) && fs.statSync(file).isFile());
    return load(path.relative(path.resolve(__dirname, ".."), file));
  };
  vm.runInThisContext(`(function(require, module, exports) { ${source}\n})`, { filename })(localRequire, compiledModule, compiledModule.exports);
  return compiledModule.exports;
}
const { findOverlap, timeDifference, durationLabel } = load("lib/time-utils.ts");
const { getGreeting } = load("lib/greetings.ts");
const { detectVisitor, getVisitorBackground } = load("lib/visitor.ts");
const { clientLocations } = load("lib/timezones.ts");
const at = (day) => new Date(`${day}T12:00:00Z`);

test("visitor backgrounds match supplied assets, Indian aliases, and safe fallbacks", () => {
  for (const location of clientLocations) {
    const background = getVisitorBackground(detectVisitor("en-IN", location.zone));
    assert.equal(background, location.background);
    assert.ok(fs.existsSync(path.resolve(__dirname, "../public", background.slice(1))));
  }
  for (const zone of ["Asia/Kolkata", "Asia/Calcutta"]) {
    assert.equal(getVisitorBackground(detectVisitor("en-US", zone)), "/images/locations/india.jpg");
  }
  assert.ok(fs.existsSync(path.resolve(__dirname, "../public/images/locations/india.jpg")));
  assert.equal(getVisitorBackground(detectVisitor("en-CA", "America/Winnipeg")), "/images/locations/toronto.jpg");
  assert.equal(getVisitorBackground(detectVisitor("en", "UTC")), undefined);
});

test("London follows DST and stays within 10-19 India hours", () => {
  const winter = findOverlap("Europe/London", at("2026-01-15"));
  const summer = findOverlap("Europe/London", at("2026-07-15"));
  assert.equal(winter.minutes, 270);
  assert.equal(summer.minutes, 330);
  assert.equal(new Date(winter.end).toISOString(), "2026-01-15T13:30:00.000Z");
  assert.equal(findOverlap("Europe/London", at("2026-03-28")).minutes, 270);
  assert.equal(findOverlap("Europe/London", at("2026-03-29")).minutes, 330);
  assert.equal(findOverlap("Europe/London", at("2026-10-25")).minutes, 270);
});
test("short, empty, southern DST, and quarter-hour overlaps", () => {
  assert.equal(findOverlap("America/New_York", at("2026-01-15")), null);
  assert.equal(findOverlap("America/New_York", at("2026-07-15")).minutes, 30);
  assert.equal(findOverlap("America/Los_Angeles", at("2026-07-15")), null);
  assert.equal(findOverlap("Australia/Sydney", at("2026-01-15")).minutes, 90);
  assert.equal(findOverlap("Australia/Sydney", at("2026-07-15")).minutes, 150);
  assert.equal(findOverlap("Asia/Kathmandu", at("2026-07-15")).minutes, 405);
});
test("every listed city stays inside both working windows across DST seasons", () => {
  const minutes = (t, zone) => {
    const parts = Object.fromEntries(new Intl.DateTimeFormat("en-GB", { timeZone: zone, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(t).map((p) => [p.type, p.value]));
    return Number(parts.hour) * 60 + Number(parts.minute);
  };
  for (const day of ["2026-01-15", "2026-03-08", "2026-03-29", "2026-04-05", "2026-07-15", "2026-10-04", "2026-10-25", "2026-11-01"]) {
    for (const { zone } of clientLocations) {
      const overlap = findOverlap(zone, at(day));
      if (!overlap) continue;
      for (const t of [overlap.start, overlap.end - 60_000]) {
        assert.ok(minutes(t, zone) >= 540 && minutes(t, zone) < 1020, zone);
        assert.ok(minutes(t, "Asia/Kolkata") >= 600 && minutes(t, "Asia/Kolkata") < 1140, zone);
      }
      assert.equal(overlap.minutes, (overlap.end - overlap.start) / 60_000);
    }
  }
});
test("differences handle date boundaries and fractional hours", () => {
  assert.equal(timeDifference(at("2026-01-15"), "Europe/London"), "You're 5h 30m behind me");
  assert.equal(timeDifference(new Date("2026-01-15T23:00:00Z"), "Asia/Tokyo"), "You're 3h 30m ahead of me");
  assert.equal(timeDifference(at("2026-01-15"), "Asia/Kolkata"), "We share the same local time");
  assert.equal(durationLabel(30), "30m");
});
test("browser language wins; country and unknown languages have safe defaults", () => {
  assert.equal(getGreeting("en-US", "FR", 9).text, "Good morning");
  assert.equal(getGreeting("fr-FR", "US", 19).text, "Bonsoir");
  assert.equal(getGreeting(undefined, "IN", 9).text, "Namaste");
  assert.equal(getGreeting("pt-BR", "FR", 9).text, "Hello");
  assert.equal(getGreeting(undefined, undefined, 9).text, "Hello");
  assert.equal(detectVisitor("en-US", "Asia/Calcutta").country, "IN");
  assert.equal(detectVisitor("en-US", "America/Los_Angeles").city, "Los Angeles");
});
test("server and initial client renders use stable loading states", () => {
  const React = requireDependency("react");
  const { renderToString } = requireDependency("react-dom/server");
  for (const name of ["LocalGreetingCard", "TimeOverlapCard"]) {
    const Component = load(`components/about/${name}.tsx`).default;
    const first = renderToString(React.createElement(Component));
    assert.equal(first, renderToString(React.createElement(Component)));
    assert.match(first, /Finding your/);
    assert.doesNotMatch(first, /NaN|Invalid Date/);
  }
});

const { getSolarDate, getSolarTimes, getDaylightProgress, getSunPosition } = load("lib/solar.ts");
test("Una solar times follow the India date across UTC midnight and seasons", () => {
  assert.equal(getSolarDate(new Date("2026-09-30T20:00:00Z")), "2026-10-01");
  const first = getSolarTimes(new Date("2026-09-30T20:00:00Z"));
  const later = getSolarTimes(new Date("2026-10-01T12:00:00Z"));
  assert.deepEqual(first, later);
  assert.equal(getSolarDate(first.sunrise), "2026-10-01");
  assert.equal(getSolarDate(first.sunset), "2026-10-01");
  const summer = getSolarTimes(at("2026-06-21"));
  const winter = getSolarTimes(at("2026-12-21"));
  assert.ok(summer.sunset - summer.sunrise > winter.sunset - winter.sunrise);
  assert.equal(getSolarTimes(new Date(NaN)), null);
});
test("sun follows the daylight arc and clamps outside daylight", () => {
  const times = getSolarTimes(at("2026-10-01"));
  assert.equal(getDaylightProgress(new Date(times.sunrise.getTime() - 1000), times), 0);
  assert.equal(getDaylightProgress(new Date(times.sunset.getTime() + 1000), times), 1);
  assert.ok(Math.abs(getDaylightProgress(new Date((times.sunrise.getTime() + times.sunset.getTime()) / 2), times) - 0.5) < 0.000001);
  assert.ok(Math.abs(getSunPosition(0).x - 10) < 0.001);
  assert.equal(getSunPosition(0.5).y, 10);
  assert.equal(getSunPosition(1).x, 190);
});
test("ClockCard has a stable initial render before client time resolves", () => {
  const React = requireDependency("react");
  const { renderToString } = requireDependency("react-dom/server");
  const { ClockCard } = load("components/about/BentoLive.tsx");
  const html = renderToString(React.createElement(ClockCard));
  assert.match(html, /--:--/);
  assert.doesNotMatch(html, /NaN|Invalid Date/);
  assert.equal(html, renderToString(React.createElement(ClockCard)));
});
