/**
 * Smaller renditions exported next to some photos, for slots that render far
 * smaller than the photo's largest use (gallery strip vs lightbox, checkout
 * thumbnail vs offer band). Each variant sits beside its full file as
 * `<name>-<width>w.webp`. `width` is the full file's own pixel width.
 *
 * Keep in sync with the image export job list (variants are re-exported with it).
 */
type VariantSet = { width: number; variants: readonly number[] };

const VARIANTS: Readonly<Record<string, VariantSet>> = {
  "/images/massanutten/skier-powder.webp": { width: 1200, variants: [600] },
  "/images/massanutten/skier-sunset.webp": { width: 1440, variants: [960] },
  "/images/massanutten/snow-tubing-lane.webp": { width: 1280, variants: [640, 960] },
  "/images/massanutten/resort-lodge-snow.webp": { width: 1200, variants: [480] },
  "/images/massanutten/indoor-waterpark-dome.webp": { width: 1024, variants: [640] },
  "/images/massanutten/indoor-waterpark.webp": { width: 1024, variants: [640] },
  "/images/massanutten/ski-instructor-young-skier.webp": { width: 1024, variants: [640] },
  "/images/massanutten/snowboarder-mountain-view.webp": { width: 1024, variants: [640] },
  "/images/massanutten/suite-fireplace.webp": { width: 1024, variants: [640] },
  "/images/massanutten/guestroom-two-beds.webp": { width: 1024, variants: [640] },
};

/** `srcset` for a photo with exported variants, or undefined when it ships as a single file. */
export function srcSetFor(src: string): string | undefined {
  const set = VARIANTS[src];
  if (!set) return undefined;
  const base = src.replace(/\.webp$/, "");
  return [...set.variants.map((w) => `${base}-${w}w.webp ${w}w`), `${src} ${set.width}w`].join(", ");
}
