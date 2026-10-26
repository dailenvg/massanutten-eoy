/** Shared props for every hero season scene. */
export type SceneProps = {
  /** Below 768px: fewer particles. */
  compact: boolean;
  /** Hero is on screen and motion is allowed: run loops. */
  loop: boolean;
  /** Reduced motion: render a static decorative frame only. */
  still: boolean;
};

export const range = (n: number) => Array.from({ length: n }, (_, i) => i);
export const pct = (n: number) => `${(n * 100).toFixed(2)}%`;
