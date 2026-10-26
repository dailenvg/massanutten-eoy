import type { Viewport } from "next";
import { resolveSeason, type SeasonKey } from "@/lib/season";

/** Browser chrome colour per version: the season's --band (styles/season-accents.css). */
export const SEASON_THEME_COLOR: Record<SeasonKey, string> = {
  winter: "#0b2a4a",
  late: "#0b2a4a",
  bf: "#0b0b0f",
  cm: "#1a0b3d",
  tt: "#0c3b6e",
  hs: "#b3122e",
  ny: "#1b1446",
};

/** Shared `generateViewport` for every (site) page; honours the `?season=` QA override. */
export async function generateSeasonViewport({
  searchParams,
}: {
  searchParams: Promise<{ season?: string }>;
}): Promise<Viewport> {
  const { season } = await searchParams;
  return { themeColor: SEASON_THEME_COLOR[resolveSeason(season).key] };
}
