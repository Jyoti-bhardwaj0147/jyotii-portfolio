"use client";

import { useSyncExternalStore } from "react";

const themeChangeEvent = "jyotii-theme-change";

function subscribe(onStoreChange: () => void) {
  window.addEventListener(themeChangeEvent, onStoreChange);
  return () => window.removeEventListener(themeChangeEvent, onStoreChange);
}

function getSnapshot() {
  return document.documentElement.dataset.theme !== "light";
}

function getServerSnapshot() {
  return true;
}

export default function ThemeToggle() {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggleTheme() {
    const nextTheme = isDark ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem("jyotii-theme", nextTheme);
    window.dispatchEvent(new Event(themeChangeEvent));
  }

  return (
    <button type="button" onClick={toggleTheme} aria-label={`Switch to ${isDark ? "light" : "dark"} theme`} className="grid size-10 place-items-center rounded-full border border-line text-lg text-foreground hover:border-accent-hover hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent">
      <span aria-hidden="true">{isDark ? "☼" : "◐"}</span>
    </button>
  );
}