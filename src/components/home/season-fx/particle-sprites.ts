/**
 * Particle sprites for the hero canvas (ParticleCanvas).
 *
 * Every particle look is painted once into an offscreen canvas, then stamped
 * each frame with drawImage, so per-frame cost stays flat. Each sprite carries
 * a front and back face (shown as the particle tumbles), downsampled soft and
 * bokeh copies for depth of field, and optional shadow / glint silhouettes.
 *
 * Painters draw in unit space: the sprite spans -1..1 on both axes.
 */

type Ctx = CanvasRenderingContext2D;
type Painter = (ctx: Ctx, back: boolean) => void;

export type Faces = {
  sharp: HTMLCanvasElement;
  /** ÷3 downsample: far band, slightly out of focus. */
  soft: HTMLCanvasElement;
  /** ÷9 downsample: near band, close to the lens. */
  bokeh: HTMLCanvasElement;
};

export type Sprite = {
  /** Edge length of the sharp sprite in px; draw scale is size / edge. */
  edge: number;
  front: Faces;
  back: Faces;
  /** Soft dark silhouette drawn offset under mid and near particles. */
  shadow: HTMLCanvasElement;
  /** Bright silhouette added on top when the face turns into the light. */
  glint: HTMLCanvasElement;
};

const TAU = Math.PI * 2;

/** Deterministic generator so a sprite set looks the same every load. */
export function seededRandom(seed: number) {
  let s = seed % 2147483647 || 1;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function canvas(edge: number) {
  const c = document.createElement("canvas");
  c.width = c.height = edge;
  return c;
}

function paint(edge: number, painter: Painter, back: boolean) {
  const c = canvas(edge);
  const ctx = c.getContext("2d");
  if (!ctx) return c;
  ctx.translate(edge / 2, edge / 2);
  ctx.scale(edge / 2, edge / 2);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  painter(ctx, back);
  return c;
}

/**
 * Depth of field without canvas filters (missing in some Safari versions):
 * shrink the sprite, then let image smoothing blur it back up when drawn.
 */
function softened(src: HTMLCanvasElement, factor: number) {
  const c = canvas(Math.max(4, Math.round(src.width / factor)));
  const ctx = c.getContext("2d");
  if (!ctx) return c;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(src, 0, 0, c.width, c.height);
  return c;
}

function silhouette(src: HTMLCanvasElement, color: string, blur: number) {
  const c = canvas(src.width);
  const ctx = c.getContext("2d");
  if (!ctx) return c;
  ctx.drawImage(src, 0, 0);
  ctx.globalCompositeOperation = "source-in";
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, c.width, c.height);
  return softened(c, blur);
}

function faces(sharp: HTMLCanvasElement): Faces {
  return { sharp, soft: softened(sharp, 3), bokeh: softened(sharp, 9) };
}

export function buildSprite(edge: number, painter: Painter, shadowColor = "#0b1220"): Sprite {
  const front = paint(edge, painter, false);
  const back = paint(edge, painter, true);
  return {
    edge,
    front: faces(front),
    back: faces(back),
    shadow: silhouette(front, shadowColor, 6),
    glint: silhouette(front, "#fff4cc", 2),
  };
}

/* -------------------------------------------------------------------------- */
/* Snow                                                                       */
/* -------------------------------------------------------------------------- */

/** Soft round flake: dense core, feathered edge, faint cold rim. */
export function snowDisc(density: number): Painter {
  return (ctx) => {
    const g = ctx.createRadialGradient(-0.12, -0.12, 0, 0, 0, 1);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.32 * density, "rgba(255,255,255,0.95)");
    g.addColorStop(0.62, "rgba(236,244,255,0.45)");
    g.addColorStop(1, "rgba(220,234,255,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, 1, 0, TAU);
    ctx.fill();
  };
}

/** Six-armed crystal with side branches, over a faint glow so it reads on bright sky. */
export function snowCrystal(seed: number): Painter {
  return (ctx) => {
    const rand = seededRandom(seed);
    const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
    glow.addColorStop(0, "rgba(255,255,255,0.55)");
    glow.addColorStop(0.5, "rgba(230,242,255,0.18)");
    glow.addColorStop(1, "rgba(230,242,255,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(-1, -1, 2, 2);

    const arm = 0.78;
    const branches = 2 + Math.floor(rand() * 2);
    const spread = 0.18 + rand() * 0.12;
    ctx.strokeStyle = "rgba(255,255,255,0.97)";
    for (let a = 0; a < 6; a++) {
      ctx.save();
      ctx.rotate((a / 6) * TAU);
      ctx.lineWidth = 0.09;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -arm);
      ctx.stroke();
      ctx.lineWidth = 0.06;
      for (let b = 1; b <= branches; b++) {
        const y = -arm * (b / (branches + 1)) - 0.08;
        const len = spread * (1.1 - b / (branches + 2));
        ctx.beginPath();
        ctx.moveTo(-len, y - len);
        ctx.lineTo(0, y);
        ctx.lineTo(len, y - len);
        ctx.stroke();
      }
      ctx.restore();
    }
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    for (let a = 0; a < 6; a++) {
      const t = (a / 6) * TAU;
      ctx.lineTo(Math.sin(t) * 0.16, -Math.cos(t) * 0.16);
    }
    ctx.closePath();
    ctx.fill();
  };
}

/* -------------------------------------------------------------------------- */
/* Black Friday gold leaf                                                     */
/* -------------------------------------------------------------------------- */

/** Irregular hammered foil shard: bright gold front, darker bronze back, a specular streak. */
export function goldLeaf(seed: number): Painter {
  return (ctx, back) => {
    const rand = seededRandom(seed);
    const n = 6 + Math.floor(rand() * 4);
    const pts: [number, number][] = [];
    const stretch = 0.55 + rand() * 0.35;
    for (let i = 0; i < n; i++) {
      const t = (i / n) * TAU + (rand() - 0.5) * 0.5;
      const r = 0.55 + rand() * 0.4;
      pts.push([Math.sin(t) * r * stretch, -Math.cos(t) * r]);
    }
    const trace = () => {
      ctx.beginPath();
      pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      ctx.closePath();
    };

    trace();
    const g = ctx.createLinearGradient(-0.8, -1, 0.8, 1);
    if (back) {
      g.addColorStop(0, "#9a6a22");
      g.addColorStop(0.5, "#6e4614");
      g.addColorStop(1, "#4a2e0c");
    } else {
      g.addColorStop(0, "#fff0b0");
      g.addColorStop(0.3, "#f5c542");
      g.addColorStop(0.65, "#d49a1c");
      g.addColorStop(1, "#8c5c10");
    }
    ctx.fillStyle = g;
    ctx.fill();

    ctx.save();
    trace();
    ctx.clip();
    /* Crinkles: thin creases, one side lit, the other in shade. */
    for (let i = 0; i < 5; i++) {
      const x0 = (rand() - 0.5) * 1.6;
      const y0 = (rand() - 0.5) * 2;
      const x1 = x0 + (rand() - 0.5) * 1.2;
      const y1 = y0 + (rand() - 0.5) * 1.2;
      ctx.lineWidth = 0.035;
      ctx.strokeStyle = back ? "rgba(255,210,140,0.18)" : "rgba(255,250,220,0.55)";
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();
      ctx.strokeStyle = "rgba(70,40,0,0.3)";
      ctx.beginPath();
      ctx.moveTo(x0 + 0.04, y0 + 0.04);
      ctx.lineTo(x1 + 0.04, y1 + 0.04);
      ctx.stroke();
    }
    if (!back) {
      const s = ctx.createLinearGradient(-1, -0.4, 1, 0.4);
      s.addColorStop(0.3, "rgba(255,255,255,0)");
      s.addColorStop(0.46, "rgba(255,255,255,0.75)");
      s.addColorStop(0.56, "rgba(255,255,255,0)");
      ctx.fillStyle = s;
      ctx.fillRect(-1, -1, 2, 2);
    }
    ctx.restore();

    trace();
    ctx.lineWidth = 0.03;
    ctx.strokeStyle = back ? "rgba(40,20,0,0.5)" : "rgba(120,74,8,0.6)";
    ctx.stroke();
  };
}

/* -------------------------------------------------------------------------- */
/* New Year confetti and bubbles                                              */
/* -------------------------------------------------------------------------- */

export type ConfettiShape = "rect" | "dot" | "streamer";

/** Mix a #rrggbb colour toward black by `k` (0–1). */
function shade(hex: string, k: number) {
  const n = parseInt(hex.slice(1), 16);
  const f = (v: number) => Math.round(v * (1 - k));
  return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`;
}

/** Two-sided paper confetti: front in the colour with a soft sheen, back a darker shade. */
export function confetti(shape: ConfettiShape, color: string, seed: number): Painter {
  return (ctx, back) => {
    const rand = seededRandom(seed);
    const fill = back ? shade(color, 0.32) : color;
    ctx.fillStyle = fill;
    ctx.strokeStyle = fill;
    if (shape === "rect") {
      const w = 0.42 + rand() * 0.18;
      ctx.fillRect(-w, -0.9, w * 2, 1.8);
    } else if (shape === "dot") {
      ctx.beginPath();
      ctx.arc(0, 0, 0.62, 0, TAU);
      ctx.fill();
    } else {
      const turns = 2 + rand() * 1.5;
      ctx.lineWidth = 0.22;
      ctx.beginPath();
      for (let i = 0; i <= 40; i++) {
        const t = i / 40;
        const x = Math.sin(t * turns * TAU) * 0.42;
        const y = -0.88 + t * 1.76;
        if (i) ctx.lineTo(x, y);
        else ctx.moveTo(x, y);
      }
      ctx.stroke();
    }
    if (!back) {
      ctx.globalCompositeOperation = "source-atop";
      const sheen = ctx.createLinearGradient(-1, -1, 1, 1);
      sheen.addColorStop(0, "rgba(255,255,255,0.45)");
      sheen.addColorStop(0.5, "rgba(255,255,255,0)");
      sheen.addColorStop(1, "rgba(0,0,0,0.12)");
      ctx.fillStyle = sheen;
      ctx.fillRect(-1, -1, 2, 2);
    }
  };
}

/** Champagne bubble: thin warm rim, bright catch-light, near-clear body. */
export const bubble: Painter = (ctx) => {
  const body = ctx.createRadialGradient(0, 0, 0.5, 0, 0, 0.92);
  body.addColorStop(0, "rgba(255,246,220,0.05)");
  body.addColorStop(0.8, "rgba(255,236,180,0.22)");
  body.addColorStop(1, "rgba(255,236,180,0)");
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.arc(0, 0, 0.92, 0, TAU);
  ctx.fill();
  ctx.lineWidth = 0.1;
  ctx.strokeStyle = "rgba(245,224,170,0.9)";
  ctx.beginPath();
  ctx.arc(0, 0, 0.8, 0, TAU);
  ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.beginPath();
  ctx.ellipse(-0.3, -0.34, 0.18, 0.11, -0.7, 0, TAU);
  ctx.fill();
};

/* -------------------------------------------------------------------------- */
/* Cyber Monday pixels                                                        */
/* -------------------------------------------------------------------------- */

/** Square neon pixel with a bright core and a wide glow halo (drawn additively). */
export function neonPixel(color: string): Painter {
  return (ctx) => {
    const halo = ctx.createRadialGradient(0, 0, 0.1, 0, 0, 1);
    halo.addColorStop(0, color);
    halo.addColorStop(0.35, `${color}66`);
    halo.addColorStop(1, `${color}00`);
    ctx.fillStyle = halo;
    ctx.fillRect(-1, -1, 2, 2);
    ctx.fillStyle = color;
    ctx.fillRect(-0.24, -0.24, 0.48, 0.48);
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.fillRect(-0.12, -0.12, 0.24, 0.24);
  };
}

/* -------------------------------------------------------------------------- */
/* Holiday drift: stars, gifts and ornaments                                  */
/* -------------------------------------------------------------------------- */

/** Five-point star with a warm glow halo; the back face is a deeper gold. */
export function holidayStar(color: string): Painter {
  return (ctx, back) => {
    const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
    glow.addColorStop(0, `${color}88`);
    glow.addColorStop(1, `${color}00`);
    ctx.fillStyle = glow;
    ctx.fillRect(-1, -1, 2, 2);
    ctx.fillStyle = back ? shade(color, 0.25) : color;
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const r = i % 2 ? 0.3 : 0.72;
      const t = (i / 10) * TAU;
      ctx.lineTo(Math.sin(t) * r, -Math.cos(t) * r);
    }
    ctx.closePath();
    ctx.fill();
  };
}

/** Small wrapped box with a ribbon cross and bow. */
export function holidayGift(box: string, ribbon: string): Painter {
  return (ctx, back) => {
    ctx.fillStyle = back ? shade(box, 0.3) : box;
    ctx.fillRect(-0.62, -0.42, 1.24, 1.08);
    ctx.fillStyle = ribbon;
    ctx.fillRect(-0.12, -0.42, 0.24, 1.08);
    ctx.fillRect(-0.62, 0.02, 1.24, 0.2);
    ctx.lineWidth = 0.14;
    ctx.strokeStyle = ribbon;
    ctx.beginPath();
    ctx.ellipse(-0.22, -0.6, 0.22, 0.14, -0.4, 0, TAU);
    ctx.ellipse(0.22, -0.6, 0.22, 0.14, 0.4, 0, TAU);
    ctx.stroke();
  };
}

/** Glass bauble with a gold cap and a catch-light. */
export function holidayOrnament(color: string): Painter {
  return (ctx, back) => {
    const g = ctx.createRadialGradient(-0.25, -0.05, 0.05, 0, 0.15, 0.75);
    g.addColorStop(0, back ? shade(color, 0.1) : "#ffffff");
    g.addColorStop(0.25, color);
    g.addColorStop(1, shade(color, 0.45));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0.18, 0.7, 0, TAU);
    ctx.fill();
    ctx.fillStyle = "#d4af37";
    ctx.fillRect(-0.18, -0.68, 0.36, 0.22);
    ctx.lineWidth = 0.08;
    ctx.strokeStyle = "#d4af37";
    ctx.beginPath();
    ctx.arc(0, -0.8, 0.12, 0, TAU);
    ctx.stroke();
  };
}
