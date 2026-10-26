"use client";

import { useId } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { CLOUD_PARALLAX, HERO_LOOP, JOURNEY, JOURNEY_STILL, heroCount, seeded, within } from "@/lib/motion";
import type { Journey } from "./flight-route";
import { pct, range, type SceneProps } from "./scene";
import { useJourney } from "./use-journey";

const { cycle, land, pop, ripples, ripple, fade, enter, contrailLag } = JOURNEY;
const LOOP = { duration: cycle, repeat: Infinity, ease: "linear" } as const;
/** Flight keyframes end at `land`, then hold until the cycle ends. */
const flightTimes = (j: Journey) => [...j.times.map((t) => t * land), 1];
const hold = <T,>(values: T[]) => [...values, values[values.length - 1]];
/** Keyframe the plane rests on in the reduced-motion frame. */
const stillIndex = (j: Journey) => j.progress.findIndex((p) => p >= JOURNEY_STILL);

/** Shows on arrival, holds, then fades out with the trail. */
const SHOWN_TIMES = [0, enter, land - 0.005, land + 0.02, 1];

function Jet() {
  return (
    <svg viewBox="0 0 40 40" className="hsl-jet-svg">
      <path d="M20 18 L13 4 L17.5 4 L28 18 Z M20 22 L13 36 L17.5 36 L28 22 Z" fill="#f4e6c8" />
      <path d="M5 18 L2 11 L5.5 11 L10.5 18 Z M5 22 L2 29 L5.5 29 L10.5 22 Z" fill="#fe5925" />
      <path d="M4 20 C4 18.6 6 18 9 18 L31 18 C35 18 38 19 38 20 C38 21 35 22 31 22 L9 22 C6 22 4 21.4 4 20 Z" fill="#ffffff" />
      <path d="M33 18.6 C35 18.8 36.6 19.3 36.8 20 L33 20 Z" fill="#0b2a4a" />
    </svg>
  );
}

function Trail({ j, loop }: { j: Journey; loop: boolean }) {
  const mask = useId();
  const times = flightTimes(j);
  return (
    <motion.svg
      className="hsl-trail"
      viewBox={`0 0 ${j.width} ${j.height}`}
      initial={{ opacity: 1 }}
      animate={loop ? { opacity: [0, 1, 1, 0, 0] } : undefined}
      transition={{ ...LOOP, times: [0, enter, ...fade, 1] }}
    >
      <mask id={mask} maskUnits="userSpaceOnUse" x={-64} y={-64} width={j.width + 128} height={j.height + 128}>
        <motion.path
          d={j.d}
          className="hsl-trail-mask"
          initial={{ pathLength: 1 }}
          animate={loop ? { pathLength: hold(j.progress) } : undefined}
          transition={{ ...LOOP, times }}
        />
      </mask>
      <g mask={`url(#${mask})`}>
        <path d={j.d} className="hsl-trail-glow" />
        <path d={j.d} className="hsl-trail-dash" />
      </g>
    </motion.svg>
  );
}

function Plane({ j, loop }: { j: Journey; loop: boolean }) {
  const s = stillIndex(j);
  const times = flightTimes(j);
  return (
    <motion.span
      className="hsl-jet"
      initial={{ x: j.x[s], y: j.y[s], rotate: j.rotate[s], opacity: 1, scale: 1 }}
      animate={loop ? { x: hold(j.x), y: hold(j.y), rotate: hold(j.rotate), opacity: [0, 1, 1, 0, 0], scale: [1, 1, 1, 0.3, 0.3] } : undefined}
      transition={{ ...LOOP, times, opacity: { ...LOOP, times: SHOWN_TIMES }, scale: { ...LOOP, times: SHOWN_TIMES } }}
    >
      <Jet />
    </motion.span>
  );
}

/** Sparkles trailing the plane, each a beat behind the one ahead. */
function Contrail({ j, count }: { j: Journey; count: number }) {
  const times = flightTimes(j);
  return range(count).map((i) => (
    <motion.span
      key={i}
      className="hsl-spark"
      style={{ scale: 1 - i * 0.22 }}
      initial={{ opacity: 0 }}
      animate={{ x: hold(j.x), y: hold(j.y), opacity: [0, 0.9 - i * 0.2, 0.9 - i * 0.2, 0, 0] }}
      transition={{ ...LOOP, times, delay: (i + 1) * contrailLag, opacity: { ...LOOP, times: SHOWN_TIMES, delay: (i + 1) * contrailLag } }}
    />
  ));
}

function Waypoints({ j, loop }: { j: Journey; loop: boolean }) {
  return j.waypoints.map(({ x, y, at }, i) => {
    const t = at * land;
    return (
      <motion.span
        key={i}
        className="hsl-waypoint"
        style={{ left: x, top: y }}
        initial={{ opacity: 1, scale: 1 }}
        animate={loop ? { opacity: [0, 0, 1, 1, 0, 0], scale: [0, 0, 1, 1, 1, 1] } : undefined}
        transition={{ ...LOOP, times: [0, t, t + 0.02, ...fade, 1] }}
      />
    );
  });
}

const PIN_TIMES = [0, land, land + pop[0], land + pop[1], ...fade, 1];

function DestinationPin({ j, loop }: { j: Journey; loop: boolean }) {
  return (
    <span className="hsl-pin-anchor" style={{ left: j.pin.x, top: j.pin.y }}>
      {loop
        ? ripples.map((offset, i) => {
            const start = land + offset;
            return (
              <motion.span
                key={i}
                className="hsl-ripple"
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: [0, 0, 0.9, 0, 0], scale: [0.3, 0.3, 0.3, 1.9, 1.9] }}
                transition={{ ...LOOP, times: [0, start, start + 0.004, start + ripple, 1] }}
              />
            );
          })
        : null}
      <motion.span
        className="hsl-pin"
        initial={{ opacity: 1, scale: 1 }}
        animate={loop ? { opacity: [0, 0, 1, 1, 1, 0, 0], scale: [0, 0, 1.18, 1, 1, 0.85, 0] } : undefined}
        transition={{ ...LOOP, times: PIN_TIMES }}
      >
        <svg viewBox="0 0 32 40">
          <ellipse cx="16" cy="38.5" rx="7" ry="1.5" fill="rgba(4, 18, 34, 0.35)" />
          <path d="M16 38 C16 38 4 25 4 15 A12 12 0 0 1 28 15 C28 25 16 38 16 38 Z" fill="#fe5925" stroke="#f4e6c8" strokeWidth="2" />
          <circle cx="16" cy="15" r="5.5" fill="#f4e6c8" />
          <circle cx="16" cy="15" r="2.5" fill="#0c3b6e" />
        </svg>
      </motion.span>
    </span>
  );
}

type Depth = "far" | "near";

function Clouds({ depth, count, loop, rise }: { depth: Depth; count: number; loop: boolean; rise: MotionValue<number> }) {
  const salt = depth === "far" ? 90 : 95;
  const top = depth === "far" ? [0.01, 0.18] : [0.03, 0.1];
  return range(count).map((i) => (
    <motion.span
      key={i}
      className={`hsl-cloud hsl-cloud--${depth}`}
      style={{
        left: pct(-0.06 + (i / count) * 0.9 + seeded(i, salt) * 0.1),
        top: pct(top[0] + seeded(i, salt + 1) * (top[1] - top[0])),
        scale: 0.75 + seeded(i, salt + 2) * 0.5,
        y: rise,
      }}
      initial={{ x: 0 }}
      animate={loop ? { x: [0, depth === "far" ? 48 : 96, 0] } : undefined}
      transition={{ duration: within(depth === "far" ? HERO_LOOP.cloudsFar : HERO_LOOP.cloudsNear, i, salt + 3), repeat: Infinity, ease: "easeInOut" }}
    />
  ));
}

function useCloudRise(depth: Depth, loop: boolean) {
  const { scrollY } = useScroll();
  const rise = useTransform(scrollY, [0, CLOUD_PARALLAX.scroll], [0, CLOUD_PARALLAX[depth]], { clamp: true });
  const still = useTransform(scrollY, () => 0);
  return loop ? rise : still;
}

/**
 * Travel Tuesday journey: layered clouds drift with scroll parallax while a
 * jet draws a dashed route from the left edge, lights up its stops and lands
 * beside the price circle, where the destination pin pops in with a ripple. One
 * calm 13s loop; reduced motion gets the arrived frame, trail fully drawn.
 */
export default function TravelScene({ compact, loop }: SceneProps) {
  const { ref, journey } = useJourney();
  const far = useCloudRise("far", loop);
  const near = useCloudRise("near", loop);
  return (
    <>
      <span ref={ref} className="hsl-fill" />
      <Clouds depth="far" count={heroCount("cloudsFar", compact)} loop={loop} rise={far} />
      <Clouds depth="near" count={heroCount("cloudsNear", compact)} loop={loop} rise={near} />
      {journey ? (
        <>
          <Trail j={journey} loop={loop} />
          <Waypoints j={journey} loop={loop} />
          <DestinationPin j={journey} loop={loop} />
          {loop ? <Contrail j={journey} count={heroCount("contrail", compact)} /> : null}
          <Plane j={journey} loop={loop} />
        </>
      ) : null}
    </>
  );
}
