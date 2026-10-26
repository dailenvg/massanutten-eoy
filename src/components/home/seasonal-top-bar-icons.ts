import type { ComponentType } from "react";
import {
  Airplane,
  Champagne,
  Confetti,
  Gift,
  Lightning,
  MapPin,
  MousePointerClick,
  ShoppingBag,
  Snowflake,
  Sparkle,
  Star,
  Sun,
  Tag,
  TreeEvergreen,
  type IconProps,
} from "@/lib/icons";
import type { SeasonKey } from "@/lib/season";

type Icon = ComponentType<IconProps>;

const WINTER: readonly Icon[] = [Snowflake, Sun];

/** Seasonal top bar glyphs. The first is the lockup mark; all of them tile the pattern panel. */
export const TOP_BAR_ICONS: Record<SeasonKey, readonly Icon[]> = {
  winter: WINTER,
  late: WINTER,
  bf: [Tag, ShoppingBag],
  cm: [Lightning, MousePointerClick],
  tt: [Airplane, MapPin],
  hs: [Gift, Star, TreeEvergreen],
  ny: [Sparkle, Confetti, Champagne],
};
