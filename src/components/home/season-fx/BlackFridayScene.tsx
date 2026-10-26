"use client";

import { motion } from "framer-motion";
import { HERO_SWEEP, TWEEN_COMPONENT, heroCount, seeded } from "@/lib/motion";
import ParticleCanvas from "./ParticleCanvas";
import { pct, range, type SceneProps } from "./scene";

/** Black Friday: darker premium vignette, slow-falling gold leaf, a gold sweep every 8s. */
export default function BlackFridayScene({ compact, loop, still }: SceneProps) {
  return (
    <>
      <motion.span
        className="hsl-vignette hsl-vignette--bf"
        initial={{ opacity: still ? 1 : 0 }}
        animate={{ opacity: 1 }}
        transition={TWEEN_COMPONENT}
      />
      {still ? null : <ParticleCanvas materials={["goldLeaf"]} compact={compact} />}
      {loop ? (
        <motion.span
          className="hsl-sweep"
          style={{ skewX: -14 }}
          initial={{ x: "-100%" }}
          animate={{ x: "500%" }}
          transition={{ ...HERO_SWEEP, repeat: Infinity }}
        />
      ) : null}
      {still
        ? range(heroCount("still", compact)).map((i) => (
            <span key={i} className="hsl-dust hsl-dust--still" style={{ left: pct(seeded(i, 76)), top: pct(0.05 + seeded(i, 77) * 0.6) }} />
          ))
        : null}
    </>
  );
}
