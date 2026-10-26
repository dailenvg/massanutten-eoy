"use client";

import { motion } from "framer-motion";
import type { SeasonKey } from "@/lib/season";
import { RAY_SPIN } from "@/lib/motion";
import ParticleCanvas from "./ParticleCanvas";
import type { MaterialKey } from "./particle-materials";

/** The hero's particle system for each season, reused at modal scale. Winter frosts instead. */
const MATERIALS: Record<Exclude<SeasonKey, "winter" | "late">, readonly MaterialKey[]> = {
  bf: ["goldLeaf"],
  cm: ["pixels"],
  tt: ["bubbles"],
  hs: ["holidayDrift"],
  ny: ["confettiCompact", "bubbles"],
};

/**
 * Seasonal accent behind the phone modal header: a slow conic light sweep in
 * the season's accent plus that season's falling (or rising) particles.
 * Winter swaps the particles for a static frosted-glass layer (frost.css).
 * Decorative only. Under reduced motion the sweep holds still and
 * ParticleCanvas renders nothing.
 */
export default function ModalSeasonFx({ season, still }: { season: SeasonKey; still: boolean }) {
  return (
    <>
      <motion.span
        className="pm-rays"
        aria-hidden="true"
        animate={still ? undefined : { rotate: 360 }}
        transition={still ? undefined : RAY_SPIN}
      />
      {season === "winter" || season === "late" ? (
        <span className="pm-frost" aria-hidden="true" />
      ) : (
        <div className="hsl pm-fx" aria-hidden="true">
          <ParticleCanvas materials={MATERIALS[season]} compact />
        </div>
      )}
    </>
  );
}
