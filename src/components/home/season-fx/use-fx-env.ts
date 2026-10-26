"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** True only after hydration, so seasonal motion never enters SSR markup. */
export function useMounted() {
  return useSyncExternalStore(noop, () => true, () => false);
}

const COMPACT_QUERY = "(max-width: 767px)";

function subscribeCompact(onChange: () => void) {
  const mql = window.matchMedia(COMPACT_QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

/** Below 768px: fewer particles, and the layer moves into the photo column. */
export function useCompact() {
  return useSyncExternalStore(subscribeCompact, () => window.matchMedia(COMPACT_QUERY).matches, () => false);
}
