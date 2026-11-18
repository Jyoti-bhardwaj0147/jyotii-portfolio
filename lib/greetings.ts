type Greeting = { language: string; morning: string; afternoon: string; evening: string };
const natural = (language: string, text: string): Greeting => ({ language, morning: text, afternoon: text, evening: text });

export const countryGreetings: Record<string, Greeting> = {
  FR: { language: "fr", morning: "Bonjour", afternoon: "Bonjour", evening: "Bonsoir" },
  DE: { language: "de", morning: "Guten Morgen", afternoon: "Guten Tag", evening: "Guten Abend" },
  ES: { language: "es", morning: "Buenos d\u00edas", afternoon: "Buenas tardes", evening: "Buenas noches" },
  IT: { language: "it", morning: "Buongiorno", afternoon: "Buon pomeriggio", evening: "Buonasera" },
  GB: { language: "en", morning: "Good morning", afternoon: "Good afternoon", evening: "Good evening" },
  US: { language: "en", morning: "Good morning", afternoon: "Good afternoon", evening: "Good evening" },
  TH: natural("th", "\u0e2a\u0e27\u0e31\u0e2a\u0e14\u0e35"),
  KR: natural("ko", "\uc548\ub155\ud558\uc138\uc694"),
  JP: natural("ja", "\u3053\u3093\u306b\u3061\u306f"),
  IN: natural("hi", "Namaste"),
};

export function getGreeting(locale: string | undefined, country: string | undefined, hour: number) {
  let language: string | undefined;
  try { language = locale ? new Intl.Locale(locale).language : undefined; } catch { /* Use country fallback. */ }
  // Explicit browser language takes precedence, even when absent from our dictionary.
  const config = language
    ? Object.values(countryGreetings).find((item) => item.language === language)
    : countryGreetings[country ?? ""];
  return { text: config?.[hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening"] ?? "Hello", language: config?.language ?? "en" };
}
