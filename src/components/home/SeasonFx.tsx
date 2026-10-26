"use client";

import { useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import type { SeasonAnimation } from "@/lib/season";
import {
  CONFETTI_BURST,
  LOOP_CLOUDS,
  LOOP_FIREWORK,
  LOOP_PIXELS,
  LOOP_SCANLINE,
  LOOP_DRIFT,
  LOOP_SPARKLE,
  LOOP_TWINKLE,
  PARTICLE_COUNT,
  PLANE_FLIGHT,
  seeded,
  within,
} from "@/lib/motion";

type Effect = Exclude<SeasonAnimation, "none">;

/** Travel distance in px for falling/rising particles (top bar height). */
const DISTANCE = 72;

const LIGHT_COLORS = ["#D4AF37", "#0F5132", "#FFF8E7", "#D4AF37"] as const;
const NY_COLORS = ["#E8C872", "#C0C7D1", "#FFFFFF"] as const;

const noop = () => () => {};
/** True only after hydration, so nothing here is part of the SSR markup. */
const useIsClient = () => useSyncExternalStore(noop, () => true, () => false);

const pct = (n: number) => `${(n * 100).toFixed(2)}%`;
const range = (n: number) => Array.from({ length: n }, (_, i) => i);

function Falling({ count, loop, distance, className }: {
  count: number;
  loop: readonly [number, number];
  distance: number;
  className: string;
}) {
  return range(count).map((i) => {
    const duration = within(loop, i, 2);
    const sway = 4 + seeded(i, 5) * 8;
    return (
      <motion.span
        key={i}
        className={className}
        style={{ left: pct(seeded(i, 1)), scale: 0.6 + seeded(i, 4) * 0.6 }}
        initial={{ y: -8, x: 0, opacity: 0 }}
        animate={{ y: distance, x: [0, sway, -sway, 0], opacity: [0, 1, 1, 0] }}
        transition={{ duration, delay: seeded(i, 3) * duration, repeat: Infinity, ease: "linear" }}
      />
    );
  });
}

function Pixels({ distance }: { distance: number }) {
  return (
    <>
      {range(PARTICLE_COUNT.pixels).map((i) => {
        const duration = within(LOOP_PIXELS, i, 2);
        return (
          <motion.span
            key={i}
            className={i % 2 ? "sfx-pixel sfx-pixel--alt" : "sfx-pixel"}
            style={{ left: pct(seeded(i, 1)) }}
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: -distance, opacity: [0, 1, 1, 0] }}
            transition={{ duration, delay: seeded(i, 3) * duration, repeat: Infinity, ease: "linear" }}
          />
        );
      })}
      <motion.span
        className="sfx-scanline"
        initial={{ y: 0 }}
        animate={{ y: distance }}
        transition={{ duration: LOOP_SCANLINE, repeat: Infinity, ease: "linear" }}
      />
    </>
  );
}

function Plane() {
  return (
    <>
      {range(PARTICLE_COUNT.clouds).map((i) => (
        <motion.span
          key={i}
          className="sfx-cloud"
          style={{ left: pct(0.1 + seeded(i, 1) * 0.8), top: pct(0.15 + seeded(i, 2) * 0.5) }}
          initial={{ x: -32 }}
          animate={{ x: 32 }}
          transition={{ duration: within(LOOP_CLOUDS, i, 3), repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        />
      ))}
      <motion.span
        className="sfx-trail"
        initial={{ scaleX: 0, opacity: 1 }}
        animate={{ scaleX: 1, opacity: [1, 1, 0] }}
        transition={{ scaleX: PLANE_FLIGHT, opacity: { duration: PLANE_FLIGHT.duration + 1, times: [0, 0.7, 1] } }}
      />
      <motion.span
        className="sfx-plane"
        initial={{ x: "-8vw", opacity: 1 }}
        animate={{ x: "104vw", opacity: [1, 1, 0] }}
        transition={PLANE_FLIGHT}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 21l21-9L2 3v7l15 2-15 2z" /></svg>
      </motion.span>
    </>
  );
}

function StringLights() {
  const count = PARTICLE_COUNT.lights;
  return range(count).map((i) => (
    <motion.span
      key={i}
      className="sfx-light"
      style={{ left: pct((i + 0.5) / count), backgroundColor: LIGHT_COLORS[i % LIGHT_COLORS.length] }}
      initial={{ opacity: 0.4 }}
      animate={{ opacity: [0.4, 1, 0.4] }}
      transition={{ duration: within(LOOP_TWINKLE, i, 2), delay: seeded(i, 3), repeat: Infinity, ease: "easeInOut" }}
    />
  ));
}

function Confetti() {
  return (
    <>
      {range(PARTICLE_COUNT.confetti).map((i) => (
        <motion.span
          key={`c${i}`}
          className="sfx-confetti"
          style={{ left: "50%", backgroundColor: NY_COLORS[i % NY_COLORS.length] }}
          initial={{ x: 0, y: -4, rotate: 0, opacity: 1 }}
          animate={{
            x: (seeded(i, 1) - 0.5) * 640,
            y: 24 + seeded(i, 2) * 40,
            rotate: (seeded(i, 3) - 0.5) * 540,
            opacity: [1, 1, 0],
          }}
          transition={{ duration: CONFETTI_BURST, ease: "easeOut" }}
        />
      ))}
      {range(PARTICLE_COUNT.fireworks).map((i) => (
        <motion.span
          key={`f${i}`}
          className="sfx-firework"
          style={{ left: pct(seeded(i, 4)), top: pct(0.2 + seeded(i, 5) * 0.6), backgroundColor: NY_COLORS[i % NY_COLORS.length] }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.4, 0], opacity: [0, 1, 0] }}
          transition={{
            duration: within(LOOP_FIREWORK, i, 6),
            delay: CONFETTI_BURST + seeded(i, 7) * 3,
            repeat: Infinity,
            repeatDelay: seeded(i, 8) * 2,
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  );
}

function Particles({ effect }: { effect: Effect }) {
  const distance = DISTANCE;
  switch (effect) {
    case "sparkle":
      return <Falling count={PARTICLE_COUNT.sparkle} loop={LOOP_SPARKLE} distance={distance} className="sfx-sparkle" />;
    case "lights":
      return (
        <>
          <Falling count={PARTICLE_COUNT.drift} loop={LOOP_DRIFT} distance={distance} className="sfx-star" />
          <StringLights />
        </>
      );
    case "pixels":
      return <Pixels distance={distance} />;
    case "plane":
      return <Plane />;
    case "confetti":
      return <Confetti />;
  }
}

/**
 * Decorative seasonal motion layer for the top bar (the hero has HeroSeasonLayer).
 *
 * Absolutely positioned, overflow-clipped and pointer-events:none, so it can
 * never shift layout, cause horizontal scroll or swallow a click. Particle
 * positions come from a seeded hash, and the layer only mounts after
 * hydration, so it never contributes to server markup. Reduced motion renders
 * nothing (the static seasonal palette remains).
 */
export default function SeasonFx({ effect }: { effect: SeasonAnimation }) {
  const isClient = useIsClient();
  const reduced = useReducedMotion();
  if (!isClient || reduced || effect === "none") return null;

  return (
    <span className="sfx" aria-hidden="true">
      <Particles effect={effect} />
    </span>
  );
}
