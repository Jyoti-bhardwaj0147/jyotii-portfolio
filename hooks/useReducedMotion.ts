"use client";

import { useSyncExternalStore } from "react";

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

function getMediaQueryList() {
  return window.matchMedia(reducedMotionQuery);
}

function subscribe(onStoreChange: () => void) {
  const mediaQueryList = getMediaQueryList();
  const handleChange = () => onStoreChange();

  if (typeof mediaQueryList.addEventListener === "function") {
    mediaQueryList.addEventListener("change", handleChange);
    return () => mediaQueryList.removeEventListener("change", handleChange);
  }

  mediaQueryList.addListener(handleChange);
  return () => mediaQueryList.removeListener(handleChange);
}

function getSnapshot() {
  return getMediaQueryList().matches;
}

function getServerSnapshot() {
  return false;
}

export default function useReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
