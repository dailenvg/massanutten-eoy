import type { SeasonKey } from "@/lib/season";
import { TOP_BAR_ICONS } from "./seasonal-top-bar-icons";

/** Small seasonal glyph for the top bar lockup. Decorative. */
export default function SeasonalTopBarMark({ season }: { season: SeasonKey }) {
  const Mark = TOP_BAR_ICONS[season][0];
  return <Mark className="stb-mark" aria-hidden="true" />;
}
