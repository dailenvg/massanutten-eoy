"use client";

import { useEffect, useRef } from "react";
import { FROST } from "@/lib/motion";
import { createFrostRenderer } from "./frost-gl";
import { THAW_POINTS } from "./frost-shader";
import type { SceneProps } from "./scene";

/** Desktop pixel-ratio ceiling; phones render below 1x since frost is soft. */
const DPR_CAP = 1.5;
const COMPACT_SCALE = 0.75;
/*
 * The phone column is tall and narrow and its lockup, price and CTA run nearly
 * edge to edge; the band is measured in column heights, so full reach would
 * haze ~120px per side. Keep it to a thin rim behind the content.
 */
const COMPACT_REACH = 0.4;

type Thaw = { births: Float64Array; uniform: Float32Array; next: number };

function createThaw(): Thaw {
  return { births: new Float64Array(THAW_POINTS).fill(-Infinity), uniform: new Float32Array(THAW_POINTS * 3), next: 0 };
}

/** Writes each point's age into the uniform; returns true while any is still thawed. */
function ageThaw(thaw: Thaw, now: number) {
  let active = false;
  for (let i = 0; i < THAW_POINTS; i++) {
    const age = now - thaw.births[i];
    thaw.uniform[i * 3 + 2] = Math.min(age, FROST.refreeze * 2);
    if (age < FROST.refreeze) active = true;
  }
  return active;
}

/**
 * Winter hero frost: procedural ice on the hero's edges and corners that thaws
 * under the pointer and refreezes. Raw WebGL on one decorative canvas; the CSS
 * frost underneath shows until WebGL is confirmed and stays if it is not.
 * Renders only while `loop` (hero on screen, motion allowed) and the tab is
 * visible, and stops its frame loop once grown in and fully refrozen.
 */
export default function FrostGlass({ compact, loop, still }: SceneProps) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const loopRef = useRef(loop);
  const wakeRef = useRef<() => void>(undefined);

  useEffect(() => {
    loopRef.current = loop;
    wakeRef.current?.();
  }, [loop]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    /*
     * A fresh canvas per run: a disposed (lost) context cannot be reacquired
     * from the same element, which broke StrictMode's re-run and mode changes.
     */
    const canvas = document.createElement("canvas");
    canvas.className = "hsl-canvas hsl-frost__gl";
    wrap.append(canvas);
    const renderer = createFrostRenderer(canvas);
    if (!renderer) {
      canvas.remove();
      return;
    }
    wrap.classList.add("hsl-frost--gl");

    const thaw = createThaw();
    const scale = compact ? COMPACT_SCALE : Math.min(window.devicePixelRatio || 1, DPR_CAP);
    const start = performance.now() / 1000;
    let raf = 0;
    let lastSample = -Infinity;

    const seconds = () => performance.now() / 1000 - start;
    const running = () => loopRef.current && !still && !document.hidden;

    const frame = () => {
      raf = 0;
      const t = seconds();
      const grow = still ? 1 : Math.min(1, t / FROST.grow);
      const thawing = ageThaw(thaw, t);
      renderer.draw({
        width: Math.max(1, Math.round(canvas.clientWidth * scale)),
        height: Math.max(1, Math.round(canvas.clientHeight * scale)),
        grow,
        time: t,
        refreeze: FROST.refreeze,
        reach: compact ? COMPACT_REACH : 1,
        thaw: thaw.uniform,
      });
      if (running() && (grow < 1 || thawing)) raf = requestAnimationFrame(frame);
    };
    const wake = () => {
      if (!raf && (running() || still)) raf = requestAnimationFrame(frame);
    };

    const onPointer = (event: PointerEvent) => {
      const t = seconds();
      if (t - lastSample < FROST.sampleGap) return;
      const rect = canvas.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = 1 - (event.clientY - rect.top) / rect.height;
      if (x < 0 || x > 1 || y < 0 || y > 1) return;
      lastSample = t;
      const i = thaw.next;
      thaw.births[i] = t;
      thaw.uniform[i * 3] = x;
      thaw.uniform[i * 3 + 1] = y;
      thaw.next = (i + 1) % THAW_POINTS;
      wake();
    };

    const host = canvas.closest(".hero") ?? window;
    const resize = new ResizeObserver(wake);
    resize.observe(canvas);
    document.addEventListener("visibilitychange", wake);
    if (!still) host.addEventListener("pointermove", onPointer as EventListener, { passive: true });
    if (!still) host.addEventListener("pointerdown", onPointer as EventListener, { passive: true });
    wakeRef.current = wake;
    wake();

    return () => {
      wakeRef.current = undefined;
      cancelAnimationFrame(raf);
      resize.disconnect();
      document.removeEventListener("visibilitychange", wake);
      host.removeEventListener("pointermove", onPointer as EventListener);
      host.removeEventListener("pointerdown", onPointer as EventListener);
      wrap.classList.remove("hsl-frost--gl");
      renderer.dispose();
      canvas.remove();
    };
  }, [compact, still]);

  return (
    <span ref={wrapRef} className="hsl-fill hsl-frost">
      <span className="hsl-fill hsl-frost__css" />
    </span>
  );
}
