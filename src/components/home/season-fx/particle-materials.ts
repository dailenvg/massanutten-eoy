/**
 * Canvas particle materials for the hero season layer.
 *
 * A material is everything the engine needs to know about one kind of
 * particle: how its sprites are painted, how big each depth band draws, how
 * fast it falls (or rises), how much it tumbles, and how many to show for a
 * given layer area. Values are tuned against a 1440px-wide hero.
 */

import {
  bubble,
  buildSprite,
  confetti,
  goldLeaf,
  holidayGift,
  holidayOrnament,
  holidayStar,
  neonPixel,
  snowCrystal,
  snowDisc,
  type ConfettiShape,
  type Sprite,
} from "./particle-sprites";

export type Band = "far" | "mid" | "near";
type Range = readonly [number, number];

export type Material = {
  /** Sprites per band, painted once on first use. */
  sprites: () => Record<Band, Sprite[]>;
  /** Share of particles in the far and mid bands; the rest are near. */
  share: { far: number; mid: number };
  /** Drawn sprite edge in CSS px per band. */
  size: Record<Band, Range>;
  alpha: Record<Band, Range>;
  /** Px/s along the travel direction, scaled up for nearer particles. */
  speed: Range;
  /** 1 falls, -1 rises. */
  gravity: 1 | -1;
  /** Tumble rate in rad/s about the long axis; [0, 0] = flat, rotation only. */
  tumble: Range;
  /** Max in-plane spin in rad/s. */
  spin: number;
  /** Sideways sway amplitude in px/s. */
  sway: Range;
  /** Multiplier on the shared wind. */
  wind: number;
  /** Area in px² per particle, and the count clamp. */
  density: { area: number; min: number; max: number };
  /** Near-band particles spawn only outside this horizontal span (share of width), keeping the content zone light. */
  nearClear?: readonly [number, number];
  /** Drop shadow strength for mid/near (0 = none). */
  shadow: number;
  /** Specular flash strength as a face turns into the light (0 = none). */
  glint: number;
  /** Twinkle depth for glowing particles (0 = steady). */
  flicker: number;
  composite: GlobalCompositeOperation;
};

export type MaterialKey = "snow" | "snowCompact" | "holidayDrift" | "goldLeaf" | "confetti" | "confettiCompact" | "bubbles" | "pixels";

const memo = <T>(make: () => T) => {
  let value: T | undefined;
  return () => (value ??= make());
};

/* Sprite sets --------------------------------------------------------------- */

const snowSprites = memo(() => {
  const discs = [1, 0.8, 0.6].map((d) => buildSprite(48, snowDisc(d), "#1c2c44"));
  const crystals = [3, 17, 29, 41].map((s) => buildSprite(96, snowCrystal(s), "#1c2c44"));
  return { far: discs, mid: [...discs, ...discs, ...crystals], near: [...discs, ...crystals] };
});

const HOLIDAY_GOLD = "#FFD45A";
const HOLIDAY_RED = "#E23B4E";
const HOLIDAY_GREEN = "#2FA866";

const holidaySprites = memo(() => {
  const all = [
    buildSprite(64, holidayStar(HOLIDAY_GOLD), "#1a0f00"),
    buildSprite(64, holidayStar("#FFF3D6"), "#1a0f00"),
    buildSprite(64, holidayGift(HOLIDAY_RED, HOLIDAY_GOLD), "#1a0f00"),
    buildSprite(64, holidayGift(HOLIDAY_GREEN, "#FFF3D6"), "#1a0f00"),
    buildSprite(64, holidayOrnament(HOLIDAY_RED), "#1a0f00"),
    buildSprite(64, holidayOrnament(HOLIDAY_GREEN), "#1a0f00"),
  ];
  return { far: all, mid: all, near: all };
});

const goldSprites = memo(() => {
  const all = [5, 11, 23, 37, 53, 71, 89, 97].map((s) => buildSprite(96, goldLeaf(s), "#120a00"));
  return { far: all, mid: all, near: all };
});

const CONFETTI_COLORS = ["#E8C872", "#C0C7D1", "#FFFFFF"] as const;
const CONFETTI_SHAPES: readonly ConfettiShape[] = ["rect", "rect", "dot", "streamer"];

const confettiSprites = memo(() => {
  const all = CONFETTI_SHAPES.flatMap((shape, i) =>
    CONFETTI_COLORS.map((color, j) => buildSprite(64, confetti(shape, color, 7 + i * 13 + j), "#0a0d18")),
  );
  return { far: all, mid: all, near: all };
});

/*
 * Below 768px the confetti sits over the bright daytime sky, where white and
 * silver pieces vanish. Same shapes, palette biased to champagne and deeper
 * gold, with one muted silver kept for variety.
 */
const CONFETTI_COLORS_COMPACT = ["#C9A13B", "#B08A2E", "#E8C872", "#8E97A6"] as const;

const confettiCompactSprites = memo(() => {
  const all = CONFETTI_SHAPES.flatMap((shape, i) =>
    CONFETTI_COLORS_COMPACT.map((color, j) => buildSprite(64, confetti(shape, color, 7 + i * 13 + j), "#0a0d18")),
  );
  return { far: all, mid: all, near: all };
});

const bubbleSprites = memo(() => {
  const all = [buildSprite(48, bubble)];
  return { far: all, mid: all, near: all };
});

const pixelSprites = memo(() => {
  const all = ["#22D3EE", "#22D3EE", "#7C3AED"].map((c) => buildSprite(48, neonPixel(c)));
  return { far: all, mid: all, near: all };
});

/* Materials ------------------------------------------------------------------ */

const SNOW: Material = {
  sprites: snowSprites,
  share: { far: 0.5, mid: 0.43 },
  size: { far: [6, 10], mid: [11, 20], near: [28, 44] },
  alpha: { far: [0.55, 0.75], mid: [0.85, 1], near: [0.6, 0.8] },
  speed: [26, 42],
  gravity: 1,
  tumble: [0, 0],
  spin: 0.8,
  sway: [8, 26],
  wind: 0.55,
  density: { area: 9000, min: 30, max: 150 },
  /* Large near flakes stay off the centered offer card / CTA column. */
  nearClear: [0.2, 0.8],
  shadow: 0.18,
  glint: 0,
  flicker: 0,
  composite: "source-over",
};

export const MATERIALS: Record<MaterialKey, Material> = {
  snow: SNOW,
  /* Phones: the photo column runs edge to edge, so no near band (28-44px flakes) over the headline and CTAs. */
  snowCompact: { ...SNOW, share: { far: 0.55, mid: 0.45 } },
  /* Holiday: a few slow stars, gifts and ornaments under the string lights (25 at most). */
  holidayDrift: {
    sprites: holidaySprites,
    share: { far: 0.45, mid: 0.5 },
    size: { far: [10, 14], mid: [16, 24], near: [28, 36] },
    alpha: { far: [0.55, 0.7], mid: [0.85, 1], near: [0.7, 0.85] },
    speed: [14, 24],
    gravity: 1,
    tumble: [0, 0],
    spin: 0.5,
    sway: [6, 18],
    wind: 0.3,
    density: { area: 48000, min: 8, max: 25 },
    nearClear: [0.2, 0.8],
    shadow: 0.25,
    glint: 0,
    flicker: 0.25,
    composite: "source-over",
  },
  goldLeaf: {
    sprites: goldSprites,
    share: { far: 0.4, mid: 0.5 },
    size: { far: [10, 16], mid: [22, 42], near: [60, 90] },
    alpha: { far: [0.6, 0.8], mid: [0.95, 1], near: [0.75, 0.9] },
    speed: [16, 28],
    gravity: 1,
    tumble: [1.6, 4],
    spin: 1.2,
    sway: [10, 30],
    wind: 0.5,
    density: { area: 14000, min: 24, max: 100 },
    nearClear: [0.18, 0.82],
    shadow: 0.35,
    glint: 1.6,
    flicker: 0,
    composite: "source-over",
  },
  confetti: {
    sprites: confettiSprites,
    share: { far: 0.45, mid: 0.47 },
    size: { far: [9, 14], mid: [15, 24], near: [28, 38] },
    alpha: { far: [0.6, 0.8], mid: [0.95, 1], near: [0.8, 0.9] },
    speed: [30, 52],
    gravity: 1,
    tumble: [3, 7],
    spin: 2.4,
    sway: [12, 34],
    wind: 0.8,
    density: { area: 18000, min: 20, max: 72 },
    nearClear: [0.2, 0.8],
    shadow: 0.3,
    glint: 0.35,
    flicker: 0,
    composite: "source-over",
  },
  get confettiCompact(): Material {
    return {
      ...MATERIALS.confetti,
      sprites: confettiCompactSprites,
      /* Fully opaque mid/near and a heavier shadow so pieces read on the daytime sky. */
      alpha: { far: [0.75, 0.9], mid: [1, 1], near: [0.95, 1] },
      shadow: 0.55,
      glint: 0.2,
    };
  },
  bubbles: {
    sprites: bubbleSprites,
    share: { far: 0.5, mid: 0.5 },
    size: { far: [5, 8], mid: [9, 14], near: [9, 14] },
    alpha: { far: [0.45, 0.6], mid: [0.7, 0.9], near: [0.7, 0.9] },
    speed: [24, 40],
    gravity: -1,
    tumble: [0, 0],
    spin: 0,
    sway: [6, 14],
    wind: 0.1,
    density: { area: 60000, min: 6, max: 20 },
    shadow: 0,
    glint: 0,
    flicker: 0,
    composite: "source-over",
  },
  pixels: {
    sprites: pixelSprites,
    share: { far: 0.5, mid: 0.42 },
    size: { far: [12, 16], mid: [18, 26], near: [32, 42] },
    alpha: { far: [0.6, 0.8], mid: [0.9, 1], near: [0.6, 0.75] },
    speed: [22, 40],
    gravity: -1,
    tumble: [0, 0],
    spin: 0,
    sway: [0, 4],
    wind: 0.1,
    density: { area: 30000, min: 12, max: 40 },
    shadow: 0,
    glint: 0,
    flicker: 0.45,
    composite: "lighter",
  },
};

/** New Year one-shot burst from behind the badge, before the light continuous fall. */
export const CONFETTI_BURST = {
  count: { wide: 110, compact: 64 },
  /** Launch speed range in px/s (scaled by layer width / 1440, min `minScale`). */
  minScale: 0.85,
  speed: [560, 1050],
  /** Spread of the launch cone around straight up, in radians. */
  cone: 1.35,
  /** Vertical launch share: keeps the fan around the badge instead of leaving the clipped layer. */
  lift: 0.42,
  /** Downward acceleration while in flight, px/s². */
  gravity: 680,
  /** Velocity damping per second while in flight. */
  drag: 1.4,
} as const;

/** Shared breeze: slow drift plus a gust every 6–12 s, tuned at 1440px wide. */
export const WIND = {
  gustEvery: [6, 12],
  firstGust: [3, 6],
  gustLength: 2.6,
  gustStrength: [45, 90],
} as const;

/** Device pixel ratio cap and frame-step clamp (seconds). */
export const CANVAS = { maxDpr: 2, maxStep: 0.05 } as const;
