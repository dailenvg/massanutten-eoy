/**
 * Shared motion tokens.
 *
 * Durations, easings and springs live here so every animated surface reads as
 * one system. Import these — do not inline magic numbers at the call site.
 */

/** Custom cubic-bezier for section/page-level tweens (soft out, no overshoot). */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/** Micro-interactions: 150–250ms. */
export const DUR_MICRO = 0.2;
/** Component transitions: 250–400ms. */
export const DUR_COMPONENT = 0.32;
/** Page/section transitions: 300–600ms. */
export const DUR_PAGE = 0.45;

/** Default spring for UI elements that move or resize. */
export const SPRING = {
  type: "spring",
  stiffness: 260,
  damping: 28,
  mass: 0.9,
} as const;

/** Tween for fades and reveals. */
export const TWEEN_COMPONENT = {
  duration: DUR_COMPONENT,
  ease: EASE_OUT,
} as const;

/* -------------------------------------------------------------------------- */
/* Seasonal effects (top bar, hero badge, hero snow).                          */
/* Loops are decorative and run on transform/opacity only.                     */
/* -------------------------------------------------------------------------- */

/** Particle counts per effect. */
export const PARTICLE_COUNT = {
  sparkle: 24,
  pixels: 18,
  clouds: 4,
  drift: 8,
  fireworks: 14,
  confetti: 24,
  lights: 16,
} as const;

/** Loop duration ranges in seconds, [min, max]. */
export const LOOP_SPARKLE = [6, 10] as const;
/** Holiday stars drifting down through the top bar. */
export const LOOP_DRIFT = [8, 12] as const;
export const LOOP_PIXELS = [5, 8] as const;
export const LOOP_CLOUDS = [18, 26] as const;
export const LOOP_FIREWORK = [2.4, 3.6] as const;
export const LOOP_TWINKLE = [1.6, 2.6] as const;
export const LOOP_SCANLINE = 4;

/** One-shot effects. */
export const PLANE_FLIGHT = { duration: 2.4, ease: EASE_OUT } as const;
export const CONFETTI_BURST = 2;

/** Hero badge: Black Friday shimmer sweep, repeating every 8s. */
export const SHIMMER = { duration: 1.2, repeatDelay: 6.8, ease: "easeInOut" } as const;
/** Hero badge: Cyber Monday single flicker on load. */
export const FLICKER = { duration: 0.8, times: [0, 0.2, 0.3, 0.5, 0.6, 1] };
/** Hero badge: Travel Tuesday passport-stamp entrance. */
export const STAMP_IN = { type: "spring", stiffness: 300, damping: 18 } as const;

/* -------------------------------------------------------------------------- */
/* Hero season layer (HeroSeasonLayer + season-fx/*).                          */
/* -------------------------------------------------------------------------- */

/**
 * Framer element counts as [desktop, below 768px]. Canvas particle counts and
 * tuning live in components/home/season-fx/particle-materials.ts.
 */
export const HERO_COUNT = {
  gridLines: [7, 5],
  cloudsFar: [3, 1],
  cloudsNear: [2, 1],
  contrail: [3, 2],
  lightsPerSwag: [9, 8],
  swags: [3, 2],
  bokeh: [6, 3],
  fireworks: [3, 2],
  /** Resting particles shown under reduced motion. */
  still: [10, 5],
} as const satisfies Record<string, readonly [number, number]>;

export type HeroCountKey = keyof typeof HERO_COUNT;

/** Count for the current viewport class. */
export const heroCount = (key: HeroCountKey, compact: boolean) => HERO_COUNT[key][compact ? 1 : 0];

/** Hero loop duration ranges in seconds, [min, max]. */
export const HERO_LOOP = {
  cloudsFar: [48, 64],
  cloudsNear: [30, 40],
  bokeh: [6, 9],
  glow: [22, 30],
  fireworkGap: [2.4, 4.4],
} as const;

/** Black Friday gold light sweep, once every 8s. */
export const HERO_SWEEP = { duration: 1.6, repeatDelay: 6.4, ease: "easeInOut" } as const;
/** Cyber Monday grid lines rolling toward the viewer. */
export const GRID_ROLL = 3.2;
/** Cyber Monday scanline band. */
export const SCAN_BAND = 7;
/** Cyber Monday one-off glitch on load. */
export const GLITCH = { duration: 0.6, delay: 0.35, times: [0, 0.15, 0.3, 0.45, 0.6, 1] };
/**
 * Travel Tuesday journey, as shares of one looping cycle (seconds in `cycle`):
 * the plane draws its trail until `land`, the destination pin pops and ripples,
 * everything holds, then fades out between `fade[0]` and `fade[1]` and rests.
 */
export const JOURNEY = {
  cycle: 13,
  land: 0.58,
  /** Pin pop: overshoot peak, then settle (0.45s + 0.2s). */
  pop: [0.035, 0.05],
  /** Each ripple ring's start offset after landing, and its run (0.78s). */
  ripples: [0.01, 0.055],
  ripple: 0.06,
  fade: [0.86, 0.92],
  /** Seconds each contrail sparkle trails the one ahead of it. */
  contrailLag: 0.14,
  /** Plane fades in over this share at the start of each pass. */
  enter: 0.02,
} as const;
/** Travel Tuesday reduced-motion frame: share of the route the plane rests at. */
export const JOURNEY_STILL = 0.72;
/** Travel Tuesday cloud parallax: px each layer rises over the first 800px of scroll. */
export const CLOUD_PARALLAX = { scroll: 800, far: -24, near: -64 } as const;
/** Travel Tuesday stamp lands on the badge corner after the plane sets off. */
export const STAMP_DELAY = 1.1;
/** Ink burst ring that flashes out as the stamp lands. */
export const STAMP_INK = { duration: 0.5, delay: STAMP_DELAY + 0.08, ease: EASE_OUT } as const;
/** Holiday fairy-light chase: per-bulb offset and twinkle period. */
export const LIGHT_CHASE = { step: 0.14, duration: 2.2 } as const;
/** Holiday flourish line-draw under the badge. */
export const FLOURISH_DRAW = { duration: 1.6, delay: 0.6, ease: EASE_OUT } as const;
/** New Year firework bloom. */
export const BLOOM = { duration: 2, ease: "easeOut" } as const;
/** Badge sparkle glints (Black Friday, New Year). */
export const GLINT = { duration: 1.4, repeatDelay: [1.6, 3.6] } as const;

/**
 * Deterministic pseudo-random in [0, 1) for particle `i`, so server and client
 * render identical markup (no Math.random, no hydration mismatch).
 */
export function seeded(i: number, salt = 1): number {
  let h = Math.imul(i + 1, 2654435761) ^ Math.imul(salt, 40503);
  h = Math.imul(h ^ (h >>> 15), 2246822507);
  h ^= h >>> 13;
  return ((h >>> 0) % 1000) / 1000;
}

/** Linear map of a seeded value into [min, max]. */
export function within([min, max]: readonly [number, number], i: number, salt = 1): number {
  return min + seeded(i, salt) * (max - min);
}

/* -------------------------------------------------------------------------- */
/* Seasonal top bar lockup.                                                    */
/* -------------------------------------------------------------------------- */

/** Entrance choreography: lockup pieces rise in one after another. */
export const TOPBAR_STAGGER = { staggerChildren: 0.07, delayChildren: 0.12 } as const;
/** Horizontal arrow nudge (px) on hover/focus and on press. */
export const ARROW_NUDGE = { hover: 4, tap: 8 } as const;

/* -------------------------------------------------------------------------- */
/* Hero price drop (PriceDrop).                                                */
/* -------------------------------------------------------------------------- */

/** Overshoot curve for the number landing: drops in, passes its mark, settles. */
export const EASE_OVERSHOOT = [0.2, 0.9, 0.3, 1.3] as const;

/** Price number drops from above and lands with a small bounce. */
export const PRICE_DROP = { duration: 0.6, delay: 0.35, ease: EASE_OVERSHOOT } as const;
/** Px above its resting place the number starts from. */
export const PRICE_DROP_FROM = -56;
/** Digits roll up to the final price while the number falls. */
export const PRICE_TICK = { duration: 0.7, delay: 0.3, ease: EASE_OUT } as const;
/** "$748 VALUE" then "PER FAMILY" fade in after the landing. */
export const PRICE_LABELS = { delayChildren: 0.75, staggerChildren: 0.18 } as const;

/* -------------------------------------------------------------------------- */
/* Section reveals, phone modal and CTA micro-interactions.                    */
/* -------------------------------------------------------------------------- */

/** whileInView settings for below-the-fold sections. */
export const REVEAL_VIEWPORT = { once: true, margin: "-10%" } as const;
/** Children of a revealed section rise in one after another. */
export const REVEAL_STAGGER = { staggerChildren: 0.08, delayChildren: 0.05 } as const;
/** Px a revealed element rises from. */
export const REVEAL_RISE = 16;

/** Hover / press scale for buttons and CTAs. */
export const PRESS = { hover: 1.03, tap: 0.97 } as const;

/** Phone modal panel rises from this many px below its resting place. */
export const MODAL_RISE = 24;
/** Phone modal content follows the panel in. */
export const MODAL_STAGGER = { staggerChildren: 0.06, delayChildren: 0.12 } as const;
/** Slow seasonal light sweep behind the modal header. */
export const RAY_SPIN = { duration: 28, repeat: Infinity, ease: "linear" } as const;
/** Ring that pulses out from the modal's headset mark. */
export const RING_PULSE = { duration: 2.4, repeat: Infinity, repeatDelay: 0.6, ease: "easeOut" } as const;
/** Slow light sweep across the bonus pass card. */
export const CARD_SHINE = { duration: 1.6, repeat: Infinity, repeatDelay: 3.2, ease: "easeInOut" } as const;

/* -------------------------------------------------------------------------- */
/* Winter hero frost (season-fx/FrostGlass). Seconds.                          */
/* -------------------------------------------------------------------------- */

export const FROST = {
  /** Frost creeping in from the edges on first paint. */
  grow: 1.5,
  /** A thawed patch takes this long to fully refreeze. */
  refreeze: 4,
  /** Minimum gap between recorded pointer points. */
  sampleGap: 0.03,
} as const;
