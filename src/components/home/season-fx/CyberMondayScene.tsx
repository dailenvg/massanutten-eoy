"use client";

import { motion } from "framer-motion";
import { GLITCH, GRID_ROLL, SCAN_BAND, heroCount, seeded } from "@/lib/motion";
import ParticleCanvas from "./ParticleCanvas";
import { pct, range, type SceneProps } from "./scene";

/** Vertical grid rays from the vanishing point, as bottom-edge x positions (viewBox 0–100). */
const RAYS = [-110, -60, -25, 0, 18, 34, 50, 66, 82, 100, 125, 160, 210];
/** Resting horizontal lines for the static frame, eased toward the horizon. */
const STILL_ROWS = [6, 16, 30, 48, 72];

function NeonGrid({ rows, loop, still }: { rows: number; loop: boolean; still: boolean }) {
  return (
    <span className="hsl-grid">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none">
        <g className="hsl-grid-rays">
          {RAYS.map((x) => (
            <line key={x} x1={50} y1={0} x2={x} y2={100} vectorEffect="non-scaling-stroke" />
          ))}
        </g>
        <g className="hsl-grid-rows">
          {loop
            ? range(rows).map((i) => (
                <motion.line
                  key={i}
                  x1={-10}
                  x2={110}
                  y1={0}
                  y2={0}
                  vectorEffect="non-scaling-stroke"
                  initial={{ y: 0, opacity: 0 }}
                  animate={{ y: 100, opacity: [0, 1, 1] }}
                  transition={{ duration: GRID_ROLL, delay: (-i / rows) * GRID_ROLL, repeat: Infinity, ease: "easeIn" }}
                />
              ))
            : null}
          {still ? STILL_ROWS.map((y) => <line key={y} x1={-10} x2={110} y1={y} y2={y} vectorEffect="non-scaling-stroke" />) : null}
        </g>
      </svg>
      <span className="hsl-horizon" />
    </span>
  );
}

/** One glitch on load: offset neon slices flash twice and clear. */
function Glitch() {
  return range(3).map((i) => (
    <motion.span
      key={i}
      className={`hsl-glitch hsl-glitch--${i % 2 ? "violet" : "cyan"}`}
      style={{ top: pct(0.08 + seeded(i, 85) * 0.6), height: pct(0.02 + seeded(i, 86) * 0.04) }}
      initial={{ opacity: 0, x: 0 }}
      animate={{ opacity: [0, 0.9, 0, 0.7, 0, 0], x: [0, -24, 16, -8, 0, 0] }}
      transition={GLITCH}
    />
  ));
}

/** Cyber Monday: neon perspective grid on the horizon, scanlines, rising pixels, a load glitch. */
export default function CyberMondayScene({ compact, loop, still }: SceneProps) {
  return (
    <>
      <span className="hsl-tint--cm" />
      <span className="hsl-scanlines" />
      <NeonGrid rows={heroCount("gridLines", compact)} loop={loop} still={still} />
      {loop ? (
        <motion.span className="hsl-track hsl-track--band" initial={{ y: "0%" }} animate={{ y: "100%" }} transition={{ duration: SCAN_BAND, repeat: Infinity, ease: "linear" }}>
          <span className="hsl-scanband" />
        </motion.span>
      ) : null}
      {still ? null : (
        <>
          <ParticleCanvas materials={["pixels"]} compact={compact} />
          <Glitch />
        </>
      )}
    </>
  );
}
