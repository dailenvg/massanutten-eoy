"use client";

import { useRef } from "react";
import type { ComponentType } from "react";
import { useInView } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import type { SeasonKey } from "@/lib/season";
import BlackFridayScene from "./season-fx/BlackFridayScene";
import CyberMondayScene from "./season-fx/CyberMondayScene";
import HolidayScene from "./season-fx/HolidayScene";
import NewYearScene from "./season-fx/NewYearScene";
import TravelScene from "./season-fx/TravelScene";
import WinterScene from "./season-fx/WinterScene";
import type { SceneProps } from "./season-fx/scene";
import { useCompact, useMounted } from "./season-fx/use-fx-env";

const SCENES: Record<SeasonKey, ComponentType<SceneProps>> = {
  winter: WinterScene,
  late: WinterScene,
  bf: BlackFridayScene,
  cm: CyberMondayScene,
  tt: TravelScene,
  hs: HolidayScene,
  ny: NewYearScene,
};

/**
 * `stage`: spans the whole hero photo (768px and up).
 * `column`: spans the photo column on phones, ending above the bonus banner.
 * CSS shows exactly one; each only renders its scene when its viewport matches.
 */
type Placement = "stage" | "column";

/**
 * Seasonal motion layer over the hero photo, under the badge, CTAs and offer
 * card. Decorative only: aria-hidden, pointer-events none, overflow clipped.
 * Scenes mount after hydration (seeded positions, no SSR markup), loops pause
 * while the hero is off screen, and reduced motion gets a static frame.
 */
export default function HeroSeasonLayer({ season, placement }: { season: SeasonKey; placement: Placement }) {
  const ref = useRef<HTMLDivElement>(null);
  const mounted = useMounted();
  const compact = useCompact();
  const reduced = useReducedMotion();
  const seen = useInView(ref, { once: true });
  const visible = useInView(ref);
  const active = mounted && seen && compact === (placement === "column");
  const Scene = SCENES[season];

  return (
    <div ref={ref} className={`hsl hsl--${placement}`} data-season={season} aria-hidden="true">
      {active ? <Scene compact={compact} loop={visible && !reduced} still={reduced} /> : null}
    </div>
  );
}
