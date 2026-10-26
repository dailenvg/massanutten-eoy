/**
 * Canvas particle engine behind ParticleCanvas.
 *
 * Each particle has a depth z (far: small, soft, slow; near: large, bokeh,
 * fast), an in-plane spin, a tumble about its long axis (seen as the sprite
 * narrowing and flipping to its back face), its own sway, and rides a shared
 * wind with occasional gusts. Particles are z-sorted and stamped from
 * prebuilt sprites, so a frame is only drawImage calls.
 */

import { CANVAS, CONFETTI_BURST, MATERIALS, WIND, type Band, type Material, type MaterialKey } from "./particle-materials";
import type { Sprite } from "./particle-sprites";

type Particle = {
  band: Band;
  z: number;
  size: number;
  sprite: Sprite;
  x: number;
  y: number;
  speed: number;
  spin: number;
  spinRate: number;
  tumble: number;
  tumbleRate: number;
  swayAmp: number;
  swayRate: number;
  phase: number;
  alpha: number;
  /** In-flight launch velocity (New Year burst); null once it settles into the fall. */
  launch: { vx: number; vy: number; age: number } | null;
  /** Burst extras are dropped, not recycled, when they leave the layer. */
  extra: boolean;
};

type System = {
  material: Material;
  sprites: Record<Band, Sprite[]>;
  particles: Particle[];
};

const REFERENCE_WIDTH = 1440;
const Z: Record<Band, readonly [number, number]> = { far: [0, 0.33], mid: [0.36, 0.8], near: [0.86, 1] };

const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T>(list: readonly T[]) => list[Math.floor(Math.random() * list.length)];
const byDepth = (a: Particle, b: Particle) => a.z - b.z;

export type Engine = {
  resize: (width: number, height: number) => void;
  /** Fire the one-shot launch from (x, y) in layer px. */
  burst: (x: number, y: number, compact: boolean) => void;
  setRunning: (running: boolean) => void;
  destroy: () => void;
};

export function createEngine(canvas: HTMLCanvasElement, keys: readonly MaterialKey[]): Engine {
  const ctx = canvas.getContext("2d");
  const systems: System[] = keys.map((k) => ({ material: MATERIALS[k], sprites: MATERIALS[k].sprites(), particles: [] }));
  let width = 1;
  let height = 1;
  let dpr = 1;
  let running = false;
  let raf = 0;
  let last = 0;
  let clock = 0;
  let nextGust = rnd(...WIND.firstGust);
  let gustStart = -100;
  let gustStrength = 0;

  const scale = () => Math.min(1.15, Math.max(0.7, width / REFERENCE_WIDTH));

  function make(sys: System, anywhere: boolean): Particle {
    const m = sys.material;
    const r = Math.random();
    const band: Band = r < m.share.far ? "far" : r < m.share.far + m.share.mid ? "mid" : "near";
    const z = rnd(...Z[band]);
    const size = rnd(...m.size[band]) * scale();
    const enter = -size - rnd(0, height * 0.3);
    const clear = band === "near" ? m.nearClear : undefined;
    const x = clear ? (Math.random() < 0.5 ? rnd(-0.1, clear[0]) : rnd(clear[1], 1.1)) : rnd(-0.1, 1.1);
    return {
      band,
      z,
      size,
      sprite: pick(sys.sprites[band]),
      x: x * width,
      y: anywhere ? rnd(-0.05, 1) * height : m.gravity > 0 ? enter : height - enter,
      speed: rnd(...m.speed) * (0.6 + z * 1.1),
      spin: rnd(0, Math.PI * 2),
      spinRate: rnd(-m.spin, m.spin),
      tumble: m.tumble[1] ? rnd(0, Math.PI * 2) : 0,
      tumbleRate: rnd(...m.tumble) * (Math.random() < 0.5 ? -1 : 1),
      swayAmp: rnd(...m.sway),
      swayRate: rnd(0.6, 1.4),
      phase: rnd(0, Math.PI * 2),
      alpha: rnd(...m.alpha[band]),
      launch: null,
      extra: false,
    };
  }

  function populate() {
    for (const sys of systems) {
      const { area, min, max } = sys.material.density;
      const target = Math.round(Math.min(max, Math.max(min, (width * height) / area)));
      const steady = sys.particles.filter((p) => !p.extra);
      while (steady.length < target) steady.push(make(sys, true));
      steady.length = target;
      sys.particles = [...steady, ...sys.particles.filter((p) => p.extra)].sort(byDepth);
    }
  }

  function wind(t: number) {
    if (t > nextGust) {
      gustStart = t;
      gustStrength = rnd(...WIND.gustStrength) * (Math.random() < 0.75 ? 1 : -1);
      nextGust = t + rnd(...WIND.gustEvery);
    }
    const g = t - gustStart;
    const gust = g >= 0 && g < WIND.gustLength ? Math.sin((g / WIND.gustLength) * Math.PI) * gustStrength : 0;
    return (10 + 16 * Math.sin(t * 0.13) + 10 * Math.sin(t * 0.37 + 1.3) + gust) * (width / REFERENCE_WIDTH);
  }

  function move(p: Particle, m: Material, w: number, dt: number) {
    p.tumble += p.tumbleRate * dt;
    p.spin += p.spinRate * dt * (1 + Math.abs(w) / 120);
    if (p.launch) {
      const l = p.launch;
      l.age += dt;
      l.vy += CONFETTI_BURST.gravity * dt;
      const damp = Math.max(0, 1 - CONFETTI_BURST.drag * dt);
      l.vx *= damp;
      l.vy *= damp;
      p.x += l.vx * dt;
      p.y += l.vy * dt;
      if (l.age > 0.4 && l.vy >= p.speed) p.launch = null;
      return;
    }
    /* Edge-on particles slice through the air faster than flat ones. */
    const flat = m.tumble[1] ? Math.abs(Math.cos(p.tumble)) : 1;
    const drop = m.tumble[1] ? 1.25 - 0.45 * flat : 1;
    p.y += m.gravity * p.speed * drop * dt;
    p.x += (w * m.wind * (0.45 + p.z * 0.9) + Math.sin(clock * p.swayRate + p.phase) * p.swayAmp) * dt;
  }

  function outside(p: Particle, m: Material) {
    const margin = p.size * 1.5;
    const pastEnd = m.gravity > 0 ? p.y > height + margin : p.y < -margin;
    return pastEnd || p.x < -width * 0.25 - margin || p.x > width * 1.25 + margin;
  }

  function step(dt: number) {
    clock += dt;
    const w = wind(clock);
    for (const sys of systems) {
      const m = sys.material;
      let resort = false;
      const kept: Particle[] = [];
      for (const p of sys.particles) {
        move(p, m, w, dt);
        if (!outside(p, m) || p.launch) {
          kept.push(p);
          continue;
        }
        if (p.extra) continue;
        const fresh = make(sys, false);
        /* Re-enter on the upwind side so gusts never empty the frame (near shards keep to the edges). */
        const gust = w * m.wind;
        const edgeOnly = fresh.band === "near" && m.nearClear;
        if (!edgeOnly && gust > 20) fresh.x = rnd(-0.3, 0.7) * width;
        else if (!edgeOnly && gust < -20) fresh.x = rnd(0.3, 1.3) * width;
        kept.push(fresh);
        resort = true;
      }
      sys.particles = resort ? kept.sort(byDepth) : kept;
    }
  }

  function stamp(c: CanvasRenderingContext2D, p: Particle, img: CanvasImageSource, edge: number, k: number, sx: number, skew: number, dx = 0, dy = 0) {
    c.setTransform(1, 0, 0, 1, p.x * dpr + dx, p.y * dpr + dy);
    c.rotate(p.spin);
    c.transform(sx * k, skew * k * 0.3, 0, k, 0, 0);
    c.drawImage(img, -edge / 2, -edge / 2, edge, edge);
  }

  function draw() {
    if (!ctx) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = true;
    for (const { material: m, particles } of systems) {
      for (const p of particles) {
        const c = Math.cos(p.tumble);
        const faces = c >= 0 ? p.sprite.front : p.sprite.back;
        const img = p.band === "far" ? faces.soft : p.band === "near" ? faces.bokeh : faces.sharp;
        const edge = p.sprite.edge;
        const k = (p.size * dpr) / edge;
        /* Edge-on particles still show a sliver rather than vanishing. */
        const sx = Math.max(0.12, Math.abs(c));
        const skew = m.tumble[1] ? Math.sin(p.tumble * 0.5) * 0.25 : 0;
        const twinkle = m.flicker ? 1 - m.flicker * (0.5 + 0.5 * Math.sin(clock * (3 + p.swayRate * 4) + p.phase)) : 1;

        ctx.globalCompositeOperation = "source-over";
        if (m.shadow && p.band !== "far") {
          const off = p.size * (0.12 + p.z * 0.1) * dpr;
          ctx.globalAlpha = m.shadow * (p.band === "near" ? 0.7 : 1) * (0.6 + 0.4 * sx);
          stamp(ctx, p, p.sprite.shadow, edge, k * 1.08, sx, skew, off, off * 1.3);
        }
        ctx.globalCompositeOperation = m.composite;
        ctx.globalAlpha = p.alpha * (0.8 + 0.2 * sx) * twinkle;
        stamp(ctx, p, img, edge, k, sx, skew);
        if (m.glint && c > 0.75) {
          ctx.globalCompositeOperation = "lighter";
          ctx.globalAlpha = m.glint * p.alpha * Math.pow(c, 10);
          stamp(ctx, p, p.sprite.glint, edge, k, sx, skew);
        }
      }
    }
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
  }

  function frame(now: number) {
    if (!running) return;
    const dt = last ? Math.min(CANVAS.maxStep, (now - last) / 1000) : 1 / 60;
    last = now;
    step(dt);
    draw();
    raf = requestAnimationFrame(frame);
  }

  return {
    resize(w, h) {
      width = Math.max(1, Math.round(w));
      height = Math.max(1, Math.round(h));
      dpr = Math.min(CANVAS.maxDpr, window.devicePixelRatio || 1);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      populate();
      if (!running) draw();
    },
    burst(x, y, compact) {
      const sys = systems[0];
      const boost = Math.max(CONFETTI_BURST.minScale, width / REFERENCE_WIDTH);
      const count = CONFETTI_BURST.count[compact ? "compact" : "wide"];
      for (let i = 0; i < count; i++) {
        const p = make(sys, false);
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * 2 * CONFETTI_BURST.cone;
        const v = rnd(...CONFETTI_BURST.speed) * boost;
        p.x = x + rnd(-24, 24);
        p.y = y + rnd(-8, 8);
        p.launch = { vx: Math.cos(angle) * v, vy: Math.sin(angle) * v * CONFETTI_BURST.lift, age: 0 };
        p.extra = true;
        sys.particles.push(p);
      }
      sys.particles.sort(byDepth);
    },
    setRunning(next) {
      if (next === running) return;
      running = next;
      if (running) {
        last = 0;
        raf = requestAnimationFrame(frame);
      } else {
        cancelAnimationFrame(raf);
      }
    },
    destroy() {
      running = false;
      cancelAnimationFrame(raf);
    },
  };
}
