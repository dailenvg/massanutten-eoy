"use client";

import { useEffect, useRef, useState } from "react";
import { buildJourney, type Journey, type JourneyAnchor } from "./flight-route";

/** Anchor used when the price circle can't be found, as shares of the layer. */
const FALLBACK = { cx: 0.5, cy: 0.4, r: 0.06 };

/**
 * Rects come back in zoomed px (desktop sets `body { zoom: 0.9 }`, and
 * browsers disagree on whether rects include it), while the layer's children
 * are laid out in its own CSS px. Dividing by the measured ratio covers both.
 */
function measure(layer: HTMLElement): Journey | null {
  const box = layer.getBoundingClientRect();
  const { clientWidth: width, clientHeight: height } = layer;
  if (!width || !height || !box.width) return null;
  const k = box.width / width;
  const circle = layer.closest(".hero")?.querySelector(".pb-circle")?.getBoundingClientRect();
  const anchor: JourneyAnchor = circle?.width
    ? { cx: (circle.left + circle.width / 2 - box.left) / k, cy: (circle.top + circle.height / 2 - box.top) / k, r: circle.width / 2 / k }
    : { cx: width * FALLBACK.cx, cy: height * FALLBACK.cy, r: width * FALLBACK.r };
  return buildJourney(width, height, anchor);
}

/**
 * Measures the season layer and the hero price circle, and rebuilds the
 * journey whenever either resizes. Returns null until the first measurement.
 */
export function useJourney() {
  const ref = useRef<HTMLSpanElement>(null);
  const [journey, setJourney] = useState<Journey | null>(null);

  useEffect(() => {
    const layer = ref.current?.parentElement;
    if (!layer) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setJourney(measure(layer)));
    };
    const ro = new ResizeObserver(update);
    ro.observe(layer);
    const circle = layer.closest(".hero")?.querySelector(".pb-circle");
    if (circle) ro.observe(circle);
    update();
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
    };
  }, []);

  return { ref, journey };
}
