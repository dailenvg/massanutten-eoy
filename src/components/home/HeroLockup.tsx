"use client";

import { useId, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import { Montserrat } from "next/font/google";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import type { TargetAndTransition, Transition } from "framer-motion";
import type { Season, SeasonKey } from "@/lib/season";
import { LOCKUP_LINES } from "@/lib/offer";
import { FLICKER, SHIMMER, STAMP_IN, TWEEN_COMPONENT, seeded } from "@/lib/motion";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["500", "800"], display: "swap" });

/* Grid of the V2 raster (orlando-hero-badge.webp): 703×206, 5px frame. */
const W = 703;
const CX = W / 2;
const FRAME_L = 2;
const FRAME_R = 700;
const FRAME_T = 13;
const FRAME_B = 190;
const STROKE = 5;
const BASELINE = 203;
/** Bottom line: cap height ≈ 25px, centered on the bottom frame edge. */
const LINE_SIZE = 36;
const LINE_MID = 191;
/** Space between the bottom line and the frame ends, holding one icon. */
const ICON_GAP = 52;
/** Space between the bottom line and the frame ends when no icon flanks it. */
const TEXT_GAP = 16;
/** Flanking icons are drawn on a ~24px grid and scaled up to sit with the 36px line. */
const ICON_SCALE = 1.4;
/**
 * Backing plate around the bottom line. Caps span ~178 to BASELINE (203); the
 * plate runs 175 to the viewBox floor (206) for an even ~3px pad top and bottom.
 * It sits inside the frame gap horizontally, so it never overlaps the frame.
 */
const BACKING_TOP = 175;
const BACKING_BOTTOM = 206;
const BACKING_PAD_X = 12;

type Look = {
  frame: string;
  text: string;
  /** Optional outer glow on the frame (Cyber Monday). */
  glow?: string;
  /** Optional plate behind the bottom line so its text clears 4.5:1 over any photo. */
  backing?: string;
  icon: (x: number, y: number, flip: boolean) => ReactNode;
};

/* ---------------------------------------------------------------- icons -- */

const Sparkle = ({ x, y, r = 10, c }: { x: number; y: number; r?: number; c: string }) => (
  <path
    transform={`translate(${x} ${y})`}
    d={`M0 -${r} C${r * 0.12} -${r * 0.12} ${r * 0.12} -${r * 0.12} ${r} 0 C${r * 0.12} ${r * 0.12} ${r * 0.12} ${r * 0.12} 0 ${r} C-${r * 0.12} ${r * 0.12} -${r * 0.12} ${r * 0.12} -${r} 0 C-${r * 0.12} -${r * 0.12} -${r * 0.12} -${r * 0.12} 0 -${r}Z`}
    fill={c}
  />
);

const PriceTag = ({ x, y, c, flip }: { x: number; y: number; c: string; flip: boolean }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1) rotate(-20)`}>
    <path d="M-12 -8 H6 L14 0 L6 8 H-12 Z" fill={c} />
    <circle cx={5} cy={0} r={2.4} fill="#0b0b0f" />
  </g>
);

const Cursor = ({ x, y, c }: { x: number; y: number; c: string }) => (
  <path transform={`translate(${x - 6} ${y - 12})`} d="M0 0 L0 22 L6 16 L10 25 L14 23 L10 14 L18 14 Z" fill={c} stroke="#070b2b" strokeWidth={1.5} strokeLinejoin="round" />
);

const Plane = ({ x, y, c, flip }: { x: number; y: number; c: string; flip: boolean }) => (
  <path transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`} d="M-13 -1 L13 -10 L4 11 L0 3 Z M0 3 L13 -10" fill={c} stroke={c} strokeWidth={1.2} strokeLinejoin="round" />
);

const Holly = ({ x, y, flip }: { x: number; y: number; flip: boolean }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`}>
    <path d="M0 0 C-6 -4 -12 -2 -15 -8 C-10 -9 -6 -13 -2 -10 C-2 -6 -1 -3 0 0Z" fill="#1f8a4c" />
    <path d="M0 0 C6 -4 12 -2 15 -8 C10 -9 6 -13 2 -10 C2 -6 1 -3 0 0Z" fill="#1f8a4c" />
    <circle cx={-3} cy={2} r={3.2} fill="#e0243f" />
    <circle cx={3} cy={2} r={3.2} fill="#e0243f" />
    <circle cx={0} cy={-2.5} r={3.2} fill="#e0243f" />
  </g>
);

const Star = ({ x, y, r = 11, c }: { x: number; y: number; r?: number; c: string }) => {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const rr = i % 2 ? r * 0.45 : r;
    return `${(Math.cos(a) * rr).toFixed(2)},${(Math.sin(a) * rr).toFixed(2)}`;
  }).join(" ");
  return <polygon transform={`translate(${x} ${y})`} points={pts} fill={c} />;
};

/* --------------------------------------------------------------- looks -- */

const WINTER: Look = {
  frame: "#2C92D6",
  text: "#FFFFFF",
  icon: () => null,
};

const LOOKS: Record<SeasonKey, Look> = {
  winter: WINTER,
  late: WINTER,
  bf: { frame: "#F5B300", text: "#F5B300", icon: (x, y, f) => <PriceTag x={x} y={y} c="#F5B300" flip={f} /> },
  cm: { frame: "#22D3EE", text: "#22D3EE", glow: "#7C3AED", icon: (x, y) => <Cursor x={x} y={y} c="#22D3EE" /> },
  tt: { frame: "#FE5925", text: "#F4E6C8", backing: "rgba(8, 45, 85, 0.9)", icon: (x, y, f) => <Plane x={x} y={y} c="#F4E6C8" flip={f} /> },
  hs: { frame: "#D4AF37", text: "#FFF8E7", icon: (x, y, f) => <Holly x={x} y={y} flip={f} /> },
  ny: { frame: "#E8C872", text: "#E8C872", icon: (x, y) => <Star x={x} y={y} c="#E8C872" /> },
};

/** Bottom-line width: Montserrat 800 at 36px runs ≈ 24.5px per character. */
const lineWidth = (text: string) => Math.min(Math.round(text.length * 24.5), 470);

/**
 * Top line box. "MASSANUTTEN RESORT" runs ≈ 531px natural at 44px; 456 keeps the
 * same ~86% horizontal compression the 16-character template line had, and still
 * clears the frame ends at 94 / 600 by ~30 / ~20px.
 */
const TOP_LENGTH = 456;
/**
 * Middle line box. "SHENANDOAH" runs ≈ 700px natural at 94px, so the old
 * spacing-only fit into 620 pulled the glyphs into each other. Glyph scaling
 * into 640 (≈ 91%), centred, keeps clear letter gaps and ~24px inside the frame.
 */
const MIDDLE_LENGTH = 640;

/** "SHENANDOAH" -> "Shenandoah", so screen readers say the word instead of spelling it. */
const spoken = (text: string) => text.charAt(0) + text.slice(1).toLowerCase();

/* ----------------------------------------------------- bottom-line motion -- */

type Entrance = { initial: TargetAndTransition; animate: TargetAndTransition; transition: Transition };

const ENTRANCE: Partial<Record<SeasonKey, Entrance>> = {
  cm: { initial: { opacity: 1 }, animate: { opacity: [1, 0.25, 1, 0.25, 1, 1] }, transition: FLICKER },
  tt: { initial: { opacity: 0, scale: 1.3, rotate: -6 }, animate: { opacity: 1, scale: 1, rotate: 0 }, transition: STAMP_IN },
};
const FADE_UP: Entrance = { initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, transition: TWEEN_COMPONENT };
const FINAL = { opacity: 1, y: 0, scale: 1, rotate: 0 };
const STATIC = { duration: 0 } as const;

/* ------------------------------------------------------ ambient elements -- */

/** Looping decoration around the frame. Renders nothing under reduced motion. */
function Ambient({ k, look }: { k: SeasonKey; look: Look }) {
  switch (k) {
    case "bf":
    case "ny":
      return (
        <>
          {[
            [FRAME_L, FRAME_T],
            [FRAME_R, FRAME_T],
            [FRAME_L, FRAME_B + 4],
            [FRAME_R, FRAME_B + 4],
            [96, FRAME_T + 2],
            [598, FRAME_T + 2],
          ].map(([x, y], i) => (
            <motion.g
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1, 0], opacity: [0, 1, 0], rotate: [0, 45] }}
              transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 1.2 + seeded(i, 2) * 2, delay: seeded(i, 4) * 2 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              <Sparkle x={x} y={y} r={i < 4 ? 12 : 8} c={k === "ny" && i % 2 ? "#C0C7D1" : look.frame} />
            </motion.g>
          ))}
          {k === "ny"
            ? [
                [60, -24, "#E8C872"],
                [640, -20, "#C0C7D1"],
              ].map(([x, y, c], i) => (
                <motion.g
                  key={`fw${i}`}
                  initial={{ scale: 0.2, opacity: 0 }}
                  animate={{ scale: [0.2, 1.1], opacity: [0, 1, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 1.4, delay: i * 1.5, ease: "easeOut" }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                >
                  <g transform={`translate(${x} ${y})`} stroke={c as string} strokeWidth={2.2} strokeLinecap="round">
                    {Array.from({ length: 10 }, (_, j) => {
                      const a = (Math.PI / 5) * j;
                      return <line key={j} x1={Math.cos(a) * 7} y1={Math.sin(a) * 7} x2={Math.cos(a) * 18} y2={Math.sin(a) * 18} />;
                    })}
                  </g>
                </motion.g>
              ))
            : null}
        </>
      );
    case "cm":
      return (
        <>
          {Array.from({ length: 12 }, (_, i) => {
            const x = seeded(i, 11) < 0.5 ? 6 + seeded(i, 13) * 80 : 610 + seeded(i, 13) * 86;
            return (
              <motion.rect
                key={i}
                x={x}
                y={FRAME_B}
                width={5}
                height={5}
                fill={i % 3 ? "#22D3EE" : "#A78BFA"}
                initial={{ y: 0, opacity: 0 }}
                animate={{ y: [0, -70], opacity: [0, 1, 0] }}
                transition={{ duration: 3 + seeded(i, 17) * 2, repeat: Infinity, delay: seeded(i, 19) * 3, ease: "linear" }}
              />
            );
          })}
        </>
      );
    case "tt":
      return (
        <>
          <motion.path
            d={`M-10 -6 C 150 -40, 300 30, 470 -14 S 680 -30, 712 -4`}
            fill="none"
            stroke="#F4E6C8"
            strokeWidth={2.2}
            strokeDasharray="2 8"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0, 0.9, 0.9, 0] }}
            transition={{ duration: 2.4, ease: "easeOut", times: [0, 0.1, 0.8, 1] }}
          />
          <motion.g
            initial={{ x: -30, y: -6, opacity: 0 }}
            animate={{ x: [-30, 700], y: [-6, -26, 10, -14, -4], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 2.4, ease: "easeOut" }}
          >
            <Plane x={0} y={0} c="#FFFFFF" flip={false} />
          </motion.g>
        </>
      );
    case "hs":
      return (
        <>
          {[...Array.from({ length: 6 }, (_, i) => 10 + i * 14), ...Array.from({ length: 7 }, (_, i) => 606 + i * 14)].map((x, i) => (
            <g key={i}>
              <line x1={x} y1={FRAME_T + STROKE} x2={x} y2={FRAME_T + 9} stroke="#0F5132" strokeWidth={1.5} />
              <motion.ellipse
                cx={x}
                cy={FRAME_T + 13}
                rx={3.4}
                ry={4.8}
                fill={["#FF4D5E", "#FFD45A", "#3DDC84"][i % 3]}
                initial={{ opacity: 1 }}
                animate={{ opacity: [1, 0.35, 1] }}
                transition={{ duration: 1.6 + seeded(i, 23), repeat: Infinity, delay: seeded(i, 29) * 1.6 }}
              />
            </g>
          ))}
        </>
      );
    default:
      return null;
  }
}

/* ---------------------------------------------------------------- badge -- */

/**
 * Hero lockup: MASSANUTTEN RESORT / SHENANDOAH on the 703×206 grid of the V2
 * raster, with the bottom line carrying the season name in place of FAMILY
 * VACATION. Frame, icons and motion take the season palette (Section 2).
 * Reduced motion renders the final frame with static decoration only.
 */
const noop = () => () => {};

export default function HeroLockup({ season }: { season: Season }) {
  const reduced = useReducedMotion();
  /** Loops mount client-side only, once reduced motion is known (no SSR mismatch). */
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const loops = mounted && !reduced;
  const uid = useId().replace(/:/g, "");
  const look = LOOKS[season.key];
  const winter = season.key === "winter" || season.key === "late";
  const label = (winter ? LOCKUP_LINES.bottom : season.badge).toUpperCase();
  const top = LOCKUP_LINES.top.toUpperCase();
  const tl = lineWidth(label);
  const gap = winter ? TEXT_GAP : ICON_GAP;
  const gapL = CX - tl / 2 - gap;
  const gapR = CX + tl / 2 + gap;
  const entrance = ENTRANCE[season.key] ?? FADE_UP;

  return (
    <svg
      className={`hero-lockup ${montserrat.className}`}
      data-season={season.key}
      viewBox={`0 0 ${W} 206`}
      width={W}
      height={206}
      role="img"
      aria-label={`${LOCKUP_LINES.top}, ${spoken(LOCKUP_LINES.middle)}, ${winter ? LOCKUP_LINES.bottom : season.badge}`}
    >
      <defs>
        <filter id={`${uid}-shadow`} x="-5%" y="-10%" width="110%" height="130%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.5" />
        </filter>
        {look.glow ? (
          <filter id={`${uid}-glow`} x="-5%" y="-10%" width="110%" height="130%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={look.glow} floodOpacity="0.9" />
          </filter>
        ) : null}
        <clipPath id={`${uid}-line`}>
          <text x={CX} y={BASELINE} textAnchor="middle" fontSize={LINE_SIZE} fontWeight={800} textLength={tl} lengthAdjust="spacingAndGlyphs">
            {label}
          </text>
        </clipPath>
        <linearGradient id={`${uid}-shine`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.95" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Frame, broken around the top line and the seasonal bottom line. */}
      <g fill={look.frame} filter={look.glow ? `url(#${uid}-glow)` : undefined}>
        <rect x={FRAME_L} y={FRAME_T} width={92} height={STROKE} />
        <rect x={600} y={FRAME_T} width={FRAME_R - 600} height={STROKE} />
        <rect x={FRAME_L} y={FRAME_T} width={STROKE} height={FRAME_B - FRAME_T + STROKE} />
        <rect x={FRAME_R - STROKE} y={FRAME_T} width={STROKE} height={FRAME_B - FRAME_T + STROKE} />
        <rect x={FRAME_L} y={FRAME_B} width={gapL - FRAME_L} height={STROKE} />
        <rect x={gapR} y={FRAME_B} width={FRAME_R - gapR} height={STROKE} />
      </g>

      <g fill="#fff" filter={`url(#${uid}-shadow)`}>
        <text x={CX} y={33} textAnchor="middle" fontSize={44} fontWeight={800} textLength={TOP_LENGTH} lengthAdjust="spacingAndGlyphs">
          {top}
        </text>
        <text x={CX} y={134} textAnchor="middle" fontSize={94} fontWeight={800} textLength={MIDDLE_LENGTH} lengthAdjust="spacingAndGlyphs">
          {LOCKUP_LINES.middle}
        </text>
      </g>

      {/* Seasonal bottom line + flanking icons. */}
      <motion.g
        initial={entrance.initial}
        animate={reduced ? FINAL : entrance.animate}
        transition={reduced ? STATIC : entrance.transition}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      >
        {look.backing ? (
          <rect
            x={CX - tl / 2 - BACKING_PAD_X}
            y={BACKING_TOP}
            width={tl + BACKING_PAD_X * 2}
            height={BACKING_BOTTOM - BACKING_TOP}
            rx={6}
            fill={look.backing}
          />
        ) : null}
        <g filter={`url(#${uid}-shadow)`}>
          {winter ? null : [gapL + ICON_GAP / 2, gapR - ICON_GAP / 2].map((x, i) => (
            <g key={x} transform={`translate(${x} ${LINE_MID}) scale(${ICON_SCALE}) translate(${-x} ${-LINE_MID})`}>
              {look.icon(x, LINE_MID, i === 1)}
            </g>
          ))}
          <text
            x={CX}
            y={BASELINE}
            textAnchor="middle"
            fontSize={LINE_SIZE}
            fontWeight={800}
            textLength={tl}
            lengthAdjust="spacingAndGlyphs"
            fill={look.text}
          >
            {label}
          </text>
        </g>
        {season.key === "bf" && loops ? (
          <g clipPath={`url(#${uid}-line)`}>
            <motion.rect
              y={170}
              width={120}
              height={40}
              fill={`url(#${uid}-shine)`}
              initial={{ x: CX - tl / 2 - 140 }}
              animate={{ x: CX + tl / 2 + 20 }}
              transition={{ ...SHIMMER, repeat: Infinity }}
            />
          </g>
        ) : null}
      </motion.g>

      {loops ? (
        <g aria-hidden="true" pointerEvents="none">
          <Ambient k={season.key} look={look} />
        </g>
      ) : null}
    </svg>
  );
}
