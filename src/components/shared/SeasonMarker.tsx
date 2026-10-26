import type { SeasonKey } from "@/lib/season";
import PrePaintScript from "./PrePaintScript";
import SeasonRootSync from "./SeasonRootSync";

/**
 * Puts the active season on <html data-site-season>, which the site-wide accent
 * tokens in styles/season-accents.css key off. A plain attribute selector (no
 * `:has()`) works in every browser, including embedded webviews. The inline
 * script sets it before first paint; SeasonRootSync keeps it current on
 * client-side navigation. The hidden span stays as a readable marker for QA.
 */
export default function SeasonMarker({ season }: { season: SeasonKey }) {
  return (
    <>
      <span hidden data-site-season={season} />
      <PrePaintScript code={`document.documentElement.setAttribute("data-site-season",${JSON.stringify(season)})`} />
      <SeasonRootSync season={season} />
    </>
  );
}
