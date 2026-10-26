/**
 * Travel Tuesday journey, in px of the hero season layer.
 *
 * The route is anchored to the hero price circle so the plane always lands
 * beside the deal, whatever the layout: it enters from the left edge, swings
 * under the circle and climbs to the destination pin on its right. The spline is
 * sampled densely so the plane's x/y/rotate keyframes sit exactly on the drawn
 * trail, and keyframe times follow true arc length through an ease, so the
 * trail's pathLength (fed the same samples) draws in lockstep with the plane.
 */

type Pt = readonly [number, number];

/** Price circle centre and radius, in px of the layer. */
export type JourneyAnchor = { cx: number; cy: number; r: number };

export type Journey = {
  width: number;
  height: number;
  d: string;
  x: number[];
  y: number[];
  rotate: number[];
  /** Arc-length share reached at each keyframe, 0..1 (drives pathLength). */
  progress: number[];
  /** Share of the flight time at each keyframe, 0..1 (eased). */
  times: number[];
  pin: { x: number; y: number };
  /** Route stops that light up as the trail reaches them. */
  waypoints: { x: number; y: number; at: number }[];
};

/** Route in circle radii from the circle centre (x clamped into the layer). */
const ROUTE: Pt[] = [
  [-99, -1.6],
  [-2.6, -0.4],
  [-1.4, 1.5],
  [0.6, 1.85],
  [1.85, 0.9],
  [1.5, -0.05],
];
/** Route points (by index) that carry a waypoint dot. */
const WAYPOINTS = [1, 3] as const;
const SAMPLES_PER_SEGMENT = 10;
/** Px the plane starts beyond the left edge. */
const ENTRY_OFFSET = 48;
/** Smallest gap kept between route points and the layer's side edges. */
const EDGE = 24;

const r1 = (n: number) => Math.round(n * 10) / 10;

function place([dx, dy]: Pt, { cx, cy, r }: JourneyAnchor, width: number): Pt {
  const x = dx < -50 ? -ENTRY_OFFSET : Math.min(Math.max(cx + dx * r, EDGE), width - EDGE);
  return [x, cy + dy * r];
}

/** Catmull-Rom control points for the segment from p[i] to p[i + 1]. */
function controls(p: Pt[], i: number) {
  const [p0, p1, p2, p3] = [p[i - 1] ?? p[i], p[i], p[i + 1], p[i + 2] ?? p[i + 1]];
  const c1: Pt = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
  const c2: Pt = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
  return { p1, c1, c2, p2 };
}

function bezier(a: Pt, b: Pt, c: Pt, d: Pt, t: number): Pt {
  const u = 1 - t;
  const [w0, w1, w2, w3] = [u * u * u, 3 * u * u * t, 3 * u * t * t, t * t * t];
  return [w0 * a[0] + w1 * b[0] + w2 * c[0] + w3 * d[0], w0 * a[1] + w1 * b[1] + w2 * c[1] + w3 * d[1]];
}

/** Time share at which an ease-in-out-sine flight reaches arc share `s`. */
const easedTime = (s: number) => Math.acos(1 - 2 * s) / Math.PI;

function unwrap(angles: number[]) {
  for (let i = 1; i < angles.length; i++) {
    while (angles[i] - angles[i - 1] > 180) angles[i] -= 360;
    while (angles[i] - angles[i - 1] < -180) angles[i] += 360;
  }
  return angles;
}

export function buildJourney(width: number, height: number, anchor: JourneyAnchor): Journey {
  const pts = ROUTE.map((p) => place(p, anchor, width));
  let d = `M${r1(pts[0][0])} ${r1(pts[0][1])}`;
  const samples: Pt[] = [pts[0]];
  const pointIndex = [0];
  for (let i = 0; i < pts.length - 1; i++) {
    const { p1, c1, c2, p2 } = controls(pts, i);
    d += ` C${r1(c1[0])} ${r1(c1[1])} ${r1(c2[0])} ${r1(c2[1])} ${r1(p2[0])} ${r1(p2[1])}`;
    for (let k = 1; k <= SAMPLES_PER_SEGMENT; k++) samples.push(bezier(p1, c1, c2, p2, k / SAMPLES_PER_SEGMENT));
    pointIndex.push(samples.length - 1);
  }

  let acc = 0;
  const lengths = [0, ...samples.slice(1).map(([x, y], i) => (acc += Math.hypot(x - samples[i][0], y - samples[i][1])))];
  const progress = lengths.map((l) => l / acc);
  const angle = (i: number) => {
    const [a, b] = [samples[Math.max(i - 1, 0)], samples[Math.min(i + 1, samples.length - 1)]];
    return Math.round((Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI);
  };
  const end = pts[pts.length - 1];

  return {
    width,
    height,
    d,
    x: samples.map(([x]) => r1(x)),
    y: samples.map(([, y]) => r1(y)),
    rotate: unwrap(samples.map((_, i) => angle(i))),
    progress,
    times: progress.map(easedTime),
    pin: { x: r1(end[0]), y: r1(end[1]) },
    waypoints: WAYPOINTS.map((i) => ({ x: pts[i][0], y: pts[i][1], at: easedTime(progress[pointIndex[i]]) })),
  };
}
