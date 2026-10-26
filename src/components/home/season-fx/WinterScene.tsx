"use client";

import { motion } from "framer-motion";
import { HERO_LOOP, within } from "@/lib/motion";
import ParticleCanvas from "./ParticleCanvas";
import type { SceneProps } from "./scene";

/**
 * Winter (and post-holiday `late`): two faint cold glows across the sky band,
 * falling snow on the canvas. Snow count follows the
 * layer area (SNOW density), so phones get fewer flakes; reduced motion gets none.
 */
export default function WinterScene({ loop, still, compact }: SceneProps) {
  const glows = [0, 1].map((i) => (
    <motion.span
      key={i}
      className={`hsl-glow hsl-glow--winter hsl-glow--${i ? "right" : "left"}`}
      initial={{ x: 0, opacity: 0.7 }}
      animate={loop ? { x: [0, i ? -64 : 64, 0], opacity: [0.7, 1, 0.7] } : undefined}
      transition={{ duration: within(HERO_LOOP.glow, i, 3), repeat: Infinity, ease: "easeInOut" }}
    />
  ));
  return (
    <>
      {glows}
      {still ? null : <ParticleCanvas materials={[compact ? "snowCompact" : "snow"]} compact={compact} />}
    </>
  );
}
