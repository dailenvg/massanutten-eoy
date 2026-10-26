/**
 * Seasonal swap system for the Massanutten EOY page.
 *
 * One URL; every seasonal component reads from the single version resolved
 * here, so a cutover changes the top bar, hero badge/H1/urgency line, sticky
 * bar label, footer sale line and meta title together.
 *
 * The season is resolved once per request on the server (page.tsx, from the
 * clock or `?season=`) and passed down as a prop, so server and client render
 * the same version and hydration cannot disagree.
 *
 *   winter  -> Nov 26 2026 11:59 PM
 *   bf      Nov 27-29
 *   cm      Nov 30
 *   tt      Dec 1
 *   hs      Dec 2-25
 *   ny      Dec 26-Jan 3 2027
 *   late    Jan 4 2027 ->  (post-holiday winter; same copy as winter)
 *
 * All cutovers are 12:00 AM Eastern (EST, UTC-5, for every boundary).
 * QA override: `?season=winter|bf|cm|tt|hs|ny|late`.
 */

export const SEASON_KEYS = ["winter", "bf", "cm", "tt", "hs", "ny", "late"] as const;

export type SeasonKey = (typeof SEASON_KEYS)[number];

/** Top-bar countdown formats. */
export type CountdownMode =
  | { kind: "none" }
  /** "Ends in [DD]d [HH]h [MM]m" */
  | { kind: "dhm"; target: string }
  /** "Ends in [HH]h [MM]m [SS]s", live ticking */
  | { kind: "hms"; target: string }
  /** "[DD] days left" */
  | { kind: "days"; target: string };

export type SeasonAnimation = "none" | "sparkle" | "pixels" | "plane" | "lights" | "confetti";

export type Season = {
  key: SeasonKey;
  /** Inclusive start / exclusive end, ISO with explicit Eastern offset. */
  start: string;
  end: string;
  topBarDesktop: string;
  topBarMobile: string;
  countdown: CountdownMode;
  badge: string;
  h1: string;
  urgency: string;
  stickyLabel: string;
  /** `stickyLabel` minus the "4-Days / 3-Nights" prefix, split for the two-line sticky bar. */
  stickyPkgLine1: string;
  stickyPkgLine2: string;
  metaTitle: string;
  animation: SeasonAnimation;
};

/** Source page title, prefixed with the version name. */
const metaTitle = (versionName: string) =>
  `${versionName}: 4-Day Massanutten Resort Getaway in Virginia’s Shenandoah Valley | $104 Stay + 2 Ski Day Passes (Save 86%)`;

const h1 = (versionName: string) =>
  `Shenandoah Valley, Virginia ${versionName}: 4-Day/3-Night Stay at Massanutten Resort`;

/** Winter base and the Jan 4+ state share every seasonal field. */
const WINTER_SHARED: Omit<Season, "key" | "start" | "end"> = {
  topBarDesktop:
    "WINTER GETAWAY • Shenandoah Valley 4-Days / 3-Nights for $104 • 2 Ski Day Passes included",
  topBarMobile: "WINTER GETAWAY: 4-Days / 3-Nights, $104 + ski passes",
  countdown: { kind: "none" },
  badge: "WINTER GETAWAY",
  h1: h1("Winter Getaway"),
  urgency: "Hurry, the best dates book up fast!",
  stickyLabel: "4-Days / 3-Nights MASSANUTTEN WINTER GETAWAY",
  /* Break after the resort name: "MASSANUTTEN WINTER" (~176px at 15px/800) overran the
     ~154px label column at 375px and wrapped to three lines. Same words, two lines. */
  stickyPkgLine1: "MASSANUTTEN",
  stickyPkgLine2: "WINTER GETAWAY",
  metaTitle: metaTitle("Winter Getaway"),
  animation: "none",
};

export const SEASONS: Season[] = [
  {
    key: "winter",
    start: "2000-01-01T00:00:00-05:00",
    end: "2026-11-27T00:00:00-05:00",
    ...WINTER_SHARED,
  },
  {
    key: "bf",
    start: "2026-11-27T00:00:00-05:00",
    end: "2026-11-30T00:00:00-05:00",
    topBarDesktop:
      "BLACK FRIDAY • Shenandoah Valley 4-Days / 3-Nights for $104 + 2 ski passes • Ends Sunday 11:59 PM ET",
    topBarMobile: "BLACK FRIDAY: $104 getaway + ski passes • Ends Sun",
    countdown: { kind: "dhm", target: "2026-11-29T23:59:59-05:00" },
    badge: "BLACK FRIDAY DEAL",
    h1: h1("Black Friday Deal"),
    urgency: "Black Friday prices end Sunday night!",
    stickyLabel: "4-Days / 3-Nights BLACK FRIDAY GETAWAY",
    stickyPkgLine1: "BLACK FRIDAY",
    stickyPkgLine2: "GETAWAY",
    metaTitle: metaTitle("Black Friday Deal"),
    animation: "sparkle",
  },
  {
    key: "cm",
    start: "2026-11-30T00:00:00-05:00",
    end: "2026-12-01T00:00:00-05:00",
    topBarDesktop:
      "CYBER MONDAY • 24 hours only • Shenandoah Valley 4-Days / 3-Nights for $104 + ski passes • Ends midnight ET",
    topBarMobile: "CYBER MONDAY: 24 hrs only • $104 + ski passes",
    countdown: { kind: "hms", target: "2026-12-01T00:00:00-05:00" },
    badge: "CYBER MONDAY DEAL",
    h1: h1("Cyber Monday Deal"),
    urgency: "Cyber Monday prices end at midnight!",
    stickyLabel: "4-Days / 3-Nights CYBER MONDAY GETAWAY",
    stickyPkgLine1: "CYBER MONDAY",
    stickyPkgLine2: "GETAWAY",
    metaTitle: metaTitle("Cyber Monday Deal"),
    animation: "pixels",
  },
  {
    key: "tt",
    start: "2026-12-01T00:00:00-05:00",
    end: "2026-12-02T00:00:00-05:00",
    topBarDesktop:
      "TRAVEL TUESDAY • Shenandoah Valley 4-Days / 3-Nights for $104 + 2 ski passes • Today only, ends midnight",
    topBarMobile: "TRAVEL TUESDAY: $104 + ski passes • Today only",
    countdown: { kind: "hms", target: "2026-12-02T00:00:00-05:00" },
    badge: "TRAVEL TUESDAY DEAL",
    h1: h1("Travel Tuesday Deal"),
    urgency: "Travel Tuesday prices end tonight!",
    stickyLabel: "4-Days / 3-Nights TRAVEL TUESDAY DEAL",
    stickyPkgLine1: "TRAVEL TUESDAY",
    stickyPkgLine2: "DEAL",
    metaTitle: metaTitle("Travel Tuesday Deal"),
    animation: "plane",
  },
  {
    key: "hs",
    start: "2026-12-02T00:00:00-05:00",
    end: "2026-12-26T00:00:00-05:00",
    topBarDesktop:
      "HOLIDAY SALE • Get a getaway your family would love! • Shenandoah Valley 4-Days / 3-Nights for $104 + 2 ski passes • Thru Dec 25",
    topBarMobile: "HOLIDAY SALE: $104 + ski passes • Thru Dec 25",
    countdown: { kind: "days", target: "2026-12-25T23:59:59-05:00" },
    badge: "HOLIDAY SALE",
    h1: h1("Holiday Sale"),
    urgency: "Holiday Sale prices end December 25!",
    stickyLabel: "4-Days / 3-Nights HOLIDAY SALE GETAWAY",
    stickyPkgLine1: "HOLIDAY SALE",
    stickyPkgLine2: "GETAWAY",
    metaTitle: metaTitle("Holiday Sale"),
    animation: "lights",
  },
  {
    key: "ny",
    start: "2026-12-26T00:00:00-05:00",
    end: "2027-01-04T00:00:00-05:00",
    topBarDesktop:
      "NEW YEAR BLOWOUT • Start 2027 with a trip booked • Shenandoah Valley 4-Days / 3-Nights, $104 • Ends Jan 3",
    topBarMobile: "NEW YEAR BLOWOUT: $104 getaway • Ends Jan 3",
    countdown: { kind: "days", target: "2027-01-03T23:59:59-05:00" },
    badge: "NEW YEAR BLOWOUT",
    h1: h1("New Year Blowout"),
    urgency: "New Year prices end January 3!",
    stickyLabel: "4-Days / 3-Nights NEW YEAR BLOWOUT DEAL",
    /* Same three-line wrap as winter at 375px; break moved, words unchanged. */
    stickyPkgLine1: "NEW YEAR",
    stickyPkgLine2: "BLOWOUT DEAL",
    metaTitle: metaTitle("New Year Blowout"),
    animation: "confetti",
  },
  {
    key: "late",
    start: "2027-01-04T00:00:00-05:00",
    end: "2100-01-01T00:00:00-05:00",
    ...WINTER_SHARED,
  },
];

/**
 * Hero photo per season. Desktop is the full source frame at its natural aspect
 * (CSS background, `cover`), so `focus` is the background-position that keeps the
 * subject in the open band between the lockup and the offer card. Mobile is a
 * 0.7 (588x840 ratio) portrait crop around the subject (<picture>).
 */
export type HeroImage = { desktop: string; mobile: string; focus: string };

const heroImage = (name: string, focus: string): HeroImage => ({
  desktop: `/images/massanutten/${name}.webp`,
  mobile: `/images/massanutten/${name}-mobile.webp`,
  focus,
});

export const HERO_IMAGES: Record<SeasonKey, HeroImage> = {
  winter: heroImage("hero-snow-tubing-family", "30% 65%"),
  late: heroImage("skier-sunset", "30% 55%"),
  bf: heroImage("skier-powder", "55% 40%"),
  cm: heroImage("snow-tubing-lane", "55% 40%"),
  tt: heroImage("resort-lodge-snow", "60% 55%"),
  /* hs and ny reuse photos: the source has five hero-sized winter photos for seven seasons. */
  hs: heroImage("hero-snow-tubing-family", "30% 65%"),
  ny: heroImage("skier-sunset", "30% 55%"),
};

const SEASON_BY_KEY = new Map(SEASONS.map((s) => [s.key, s]));

export const DEFAULT_SEASON: Season = SEASON_BY_KEY.get("winter")!;

/** QA override: `?season=<id>` where id is one of SEASON_KEYS. */
export function seasonFromParam(value: string | string[] | null | undefined): Season | null {
  if (typeof value !== "string") return null;
  return SEASON_BY_KEY.get(value as SeasonKey) ?? null;
}

/** The version live at `now` (compared in absolute time, so the viewer's zone is irrelevant). */
export function seasonForDate(now: Date = new Date()): Season {
  const t = now.getTime();
  return SEASONS.find((s) => t >= Date.parse(s.start) && t < Date.parse(s.end)) ?? DEFAULT_SEASON;
}

/** Holiday-event rows (tabs, More to Explore, destination copy) drop on Jan 4 (late). */
export function showsHolidayEvents(season: Season): boolean {
  return season.key !== "late";
}

/** Request-time resolution shared by every page: `?season=` QA override, else the clock. */
export function resolveSeason(value: string | string[] | null | undefined): Season {
  return seasonFromParam(value) ?? seasonForDate();
}

/** Appends the `?season=` QA override to an internal path so it survives the checkout flow. */
export function withSeasonParam(path: string, override: Season | null): string {
  if (!override) return path;
  return `${path}${path.includes("?") ? "&" : "?"}season=${override.key}`;
}
