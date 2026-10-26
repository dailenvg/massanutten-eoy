"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { createEngine } from "./particle-engine";
import type { MaterialKey } from "./particle-materials";

type ParticleCanvasProps = {
  /** Particle systems, drawn in this order (first is underneath). */
  materials: readonly MaterialKey[];
  /** Below 768px: smaller one-shot burst. */
  compact: boolean;
  /** Launch the first material from behind the hero badge once per page load. */
  burst?: boolean;
};

/** Burst origin when the badge can't be measured, as a share of the layer. */
const FALLBACK_ORIGIN = { x: 0.4, y: 0.15 };
let burstFired = false;

function badgeCenter(layer: HTMLElement) {
  const badge = layer.closest(".hero")?.querySelector(".ob-sticker");
  const box = layer.getBoundingClientRect();
  if (!badge) return { x: box.width * FALLBACK_ORIGIN.x, y: box.height * FALLBACK_ORIGIN.y };
  const b = badge.getBoundingClientRect();
  return { x: b.left + b.width / 2 - box.left, y: b.top + b.height / 2 - box.top };
}

/**
 * Canvas particle layer inside a HeroSeasonLayer. Fills its parent, never
 * takes pointer events, pauses while off screen or the tab is hidden, and
 * does not run at all under reduced motion (scenes render a still frame).
 */
export default function ParticleCanvas({ materials, compact, burst = false }: ParticleCanvasProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const key = materials.join(",");

  useEffect(() => {
    const canvas = ref.current;
    const layer = canvas?.parentElement;
    if (reduced || !canvas || !layer || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const engine = createEngine(canvas, key.split(",") as MaterialKey[]);
    let onScreen = true;
    const sync = () => engine.setRunning(onScreen && !document.hidden);

    const fit = () => engine.resize(layer.clientWidth, layer.clientHeight);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(layer);
    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    });
    io.observe(layer);
    document.addEventListener("visibilitychange", sync);

    /*
     * Fired on the first frame and only from a displayed layer, so neither a
     * Strict Mode teardown nor the hidden placement (briefly mounted while
     * hydration settles the viewport class) uses up the burst.
     */
    const launch = requestAnimationFrame(() => {
      if (!burst || burstFired || layer.clientWidth === 0) return;
      burstFired = true;
      const { x, y } = badgeCenter(layer);
      engine.burst(x, y, compact);
    });
    sync();

    return () => {
      cancelAnimationFrame(launch);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
      engine.destroy();
    };
  }, [key, compact, burst, reduced]);

  if (reduced) return null;
  return <canvas ref={ref} className="hsl-canvas" aria-hidden="true" />;
}
