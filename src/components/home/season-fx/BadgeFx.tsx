"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import type { SeasonKey } from "@/lib/season";
import { FLOURISH_DRAW, GLINT, STAMP_DELAY, STAMP_IN, STAMP_INK, seeded, within } from "@/lib/motion";
import { useMounted } from "./use-fx-env";

const ORIGIN_CENTER = { transformBox: "fill-box", transformOrigin: "50% 50%" } as const;

const SPARKLE = "M0 -12 C1.2 -1.2 1.2 -1.2 12 0 C1.2 1.2 1.2 1.2 0 12 C-1.2 1.2 -1.2 1.2 -12 0 C-1.2 -1.2 -1.2 -1.2 0 -12Z";
/** Glint spots over the lockup letterforms. */
const GLINT_SPOTS = [[92, 64], [214, 112], [330, 58], [452, 120], [560, 70], [640, 104]] as const;

function Glints({ color, still }: { color: string; still: boolean }) {
  if (still) return null;
  return GLINT_SPOTS.map(([x, y], i) => (
    <g key={i} transform={`translate(${x} ${y}) scale(1.7)`}>
      <motion.path
        d={SPARKLE}
        fill="#fff"
        className="hsl-glint"
        style={{ ...ORIGIN_CENTER, color }}
        initial={{ scale: 0, opacity: 0, rotate: 0 }}
        animate={{ scale: [0, 1, 0], opacity: [0, 1, 0], rotate: [0, 90] }}
        transition={{ duration: GLINT.duration, delay: 0.8 + seeded(i, 141) * 3, repeat: Infinity, repeatDelay: within(GLINT.repeatDelay, i, 142) }}
      />
    </g>
  ));
}

/** Source "Shenandoah Valley, VA" sticker art (640×321), fitted inside the old passport-stamp footprint. */
const STAMP_ART = "/images/massanutten/shenandoah-valley-sticker.webp";
const STAMP_W = 104;
const STAMP_H = 40;

/** Ink ring that flashes out from under the stamp as it lands. */
function InkBurst() {
  return (
    <motion.circle
      r={40}
      className="hsl-stamp-ink"
      style={ORIGIN_CENTER}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1.4, opacity: [0, 0.7, 0] }}
      transition={STAMP_INK}
    />
  );
}

/** Passport stamp thumped onto the badge's top-right corner. */
function Stamp({ still }: { still: boolean }) {
  return (
    <g transform="translate(668 20) rotate(-14)">
      {still ? null : <InkBurst />}
      <motion.g
        className="hsl-stamp"
        style={ORIGIN_CENTER}
        initial={still ? false : { scale: 1.9, rotate: -18, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 0.94 }}
        transition={{ ...STAMP_IN, delay: STAMP_DELAY }}
      >
        <image href={STAMP_ART} x={-STAMP_W / 2} y={-STAMP_H / 2} width={STAMP_W} height={STAMP_H} />
      </motion.g>
    </g>
  );
}

const FLOURISH =
  "M196 222 C236 222 262 212 298 214 C322 216 330 230 316 234 C304 237 300 222 318 218 C338 214 344 222 351.5 222 C359 222 365 214 385 218 C403 222 399 237 387 234 C373 230 381 216 405 214 C441 212 467 222 507 222";

function Flourish({ still }: { still: boolean }) {
  return (
    <motion.path
      d={FLOURISH}
      className="hsl-flourish"
      initial={still ? false : { pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={FLOURISH_DRAW}
    />
  );
}

function Effect({ k, still }: { k: SeasonKey; still: boolean }) {
  switch (k) {
    case "bf":
      return <Glints color="#F5B300" still={still} />;
    case "ny":
      return <Glints color="#E8C872" still={still} />;
    case "tt":
      return <Stamp still={still} />;
    case "hs":
      return <Flourish still={still} />;
    default:
      return null;
  }
}

/**
 * Seasonal accents drawn on the hero badge's own grid (glints,
 * stamp, flourish). Overlays the badge exactly, never affects its layout.
 */
export default function BadgeFx({ season }: { season: SeasonKey }) {
  const mounted = useMounted();
  const reduced = useReducedMotion();
  if (!mounted) return null;
  return (
    <svg className="hsl-badge" viewBox="0 0 703 206" aria-hidden="true" focusable="false">
      <Effect k={season} still={reduced} />
    </svg>
  );
}
