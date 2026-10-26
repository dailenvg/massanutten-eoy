"use client";

import { useSyncExternalStore } from "react";
import { useReducedMotion as useFramerReducedMotion } from "framer-motion";

const noop = () => () => {};

/**
 * Hydration-safe reduced-motion flag. Use this instead of framer-motion's
 * `useReducedMotion` everywhere.
 *
 * The server cannot know the visitor's preference, so it renders the
 * no-preference markup. Framer's hook reads `matchMedia` on the client's very
 * first render, so any `initial`/variant chosen from it made the hydrated
 * markup differ from the server's. This returns false until hydration has
 * finished, then the real preference, so the first client render always
 * matches the server and reduced motion takes over one commit later.
 */
export function useReducedMotion(): boolean {
  const prefersReduced = useFramerReducedMotion();
  const hydrated = useSyncExternalStore(noop, () => true, () => false);
  return hydrated && Boolean(prefersReduced);
}
