"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Reactive `matchMedia`.
 *
 * The server snapshot is `false`, so the desktop tree is what gets rendered into
 * the HTML — crawlers and no-JS clients see the full markup, and phones swap to
 * the narrow tree on hydration.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
