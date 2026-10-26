"use client";

import { motion } from "framer-motion";
import { BLOOM, HERO_LOOP, within } from "@/lib/motion";
import ParticleCanvas from "./ParticleCanvas";
import { pct, range, type SceneProps } from "./scene";

const BLOOM_COLORS = ["#E8C872", "#C0C7D1", "#F4A6B8"] as const;
const RAYS = 14;

/** Firework bloom spots in the sky, per layout. */
const STAGE = {
  wide: { blooms: [[0.07, 0.15], [0.55, 0.09], [0.93, 0.1]] },
  compact: { blooms: [[0.1, 0.5], [0.9, 0.44]] },
} as const;

function Bloom({ i, at, loop }: { i: number; at: readonly [number, number]; loop: boolean }) {
  const color = BLOOM_COLORS[i % BLOOM_COLORS.length];
  return (
    <motion.span
      className="hsl-bloom"
      style={{ left: pct(at[0]), top: pct(at[1]), color }}
      initial={{ scale: loop ? 0.2 : 1, opacity: loop ? 0 : 0.45 }}
      animate={loop ? { scale: [0.2, 1, 1.08], opacity: [0, 1, 0] } : undefined}
      transition={{ ...BLOOM, delay: 1.2 + i * 1.3, repeat: Infinity, repeatDelay: within(HERO_LOOP.fireworkGap, i, 115) }}
    >
      <svg viewBox="-50 -50 100 100">
        {range(RAYS).map((r) => {
          const a = (r / RAYS) * Math.PI * 2;
          const [c, s] = [Math.cos(a), Math.sin(a)];
          return <line key={r} x1={c * 14} y1={s * 14} x2={c * 44} y2={s * 44} />;
        })}
        {range(RAYS).map((r) => {
          const a = ((r + 0.5) / RAYS) * Math.PI * 2;
          return <circle key={r} cx={Math.cos(a) * 34} cy={Math.sin(a) * 34} r={1.8} />;
        })}
      </svg>
    </motion.span>
  );
}

/** New Year: confetti burst on load, slow firework blooms, champagne bubbles. */
export default function NewYearScene({ compact, loop, still }: SceneProps) {
  const { blooms } = STAGE[compact ? "compact" : "wide"];
  return (
    <>
      {loop || still ? blooms.map((at, i) => <Bloom key={i} i={i} at={at} loop={loop} />) : null}
      {still ? null : <ParticleCanvas materials={compact ? ["confettiCompact", "bubbles"] : ["confetti", "bubbles"]} compact={compact} burst />}
    </>
  );
}
