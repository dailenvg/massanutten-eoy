"use client";

import { motion } from "framer-motion";
import { HERO_LOOP, LIGHT_CHASE, heroCount, seeded, within } from "@/lib/motion";
import ParticleCanvas from "./ParticleCanvas";
import { pct, range, type SceneProps } from "./scene";

const BULB_COLORS = ["#FF4D5E", "#FFD45A", "#3DDC84", "#5AB8FF", "#FFF3D6"] as const;
const BOKEH_COLORS = ["#FFB547", "#FF6B6B", "#FFE08A"] as const;
/** Wire sag as a share of the lights strip height (control point of a quadratic). */
const SAG = 1.4;

/** Point on swag `k` of `n` at parameter t, in percent of the lights strip. */
const swagPoint = (k: number, n: number, t: number) => ({
  x: ((k + t) / n) * 100,
  y: 2 * t * (1 - t) * SAG * 100,
});

function FairyLights({ swags, perSwag, loop }: { swags: number; perSwag: number; loop: boolean }) {
  const wire = range(swags)
    .map((k) => `M${(k / swags) * 100} 0 Q${((k + 0.5) / swags) * 100} ${SAG * 100} ${((k + 1) / swags) * 100} 0`)
    .join(" ");
  return (
    <span className="hsl-lights">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" overflow="visible">
        <path d={wire} vectorEffect="non-scaling-stroke" />
      </svg>
      {range(swags).flatMap((k) =>
        range(perSwag).map((j) => {
          const i = k * perSwag + j;
          const { x, y } = swagPoint(k, swags, (j + 0.5) / perSwag);
          const color = BULB_COLORS[i % BULB_COLORS.length];
          return (
            <motion.span
              key={i}
              className="hsl-bulb"
              style={{ left: `${x}%`, top: `${y}%`, color, backgroundColor: color }}
              initial={{ opacity: 1 }}
              animate={loop ? { opacity: [1, 0.3, 1] } : undefined}
              transition={{ duration: LIGHT_CHASE.duration, delay: i * LIGHT_CHASE.step, repeat: Infinity, repeatDelay: LIGHT_CHASE.step * swags * perSwag - LIGHT_CHASE.duration, ease: "easeInOut" }}
            />
          );
        }),
      )}
    </span>
  );
}

function Bokeh({ count, loop }: { count: number; loop: boolean }) {
  return range(count).map((i) => {
    const side = i % 2 ? 0.86 : 0;
    return (
      <motion.span
        key={i}
        className="hsl-bokeh"
        style={{
          left: pct(side + seeded(i, 101) * 0.12),
          top: pct(0.12 + seeded(i, 102) * 0.7),
          scale: 0.6 + seeded(i, 103) * 0.8,
          color: BOKEH_COLORS[i % BOKEH_COLORS.length],
        }}
        initial={{ opacity: 0.5 }}
        animate={loop ? { opacity: [0.5, 0.9, 0.5] } : undefined}
        transition={{ duration: within(HERO_LOOP.bokeh, i, 104), repeat: Infinity, ease: "easeInOut" }}
      />
    );
  });
}

/**
 * Holiday: twinkling string lights draped from the bar edge, warm bokeh and a
 * few drifting stars, gifts and ornaments (25 max). Reduced motion keeps the
 * lights lit and still, with no drift.
 */
export default function HolidayScene({ compact, loop, still }: SceneProps) {
  const perSwag = heroCount("lightsPerSwag", compact);
  const swags = heroCount("swags", compact);
  return (
    <>
      <Bokeh count={heroCount("bokeh", compact)} loop={loop} />
      {still ? null : <ParticleCanvas materials={["holidayDrift"]} compact={compact} />}
      <FairyLights swags={swags} perSwag={perSwag} loop={loop} />
    </>
  );
}
