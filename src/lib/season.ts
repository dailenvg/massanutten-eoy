/**
 * Seasonal swap system for the Massanutten EOY page.
 *
 * One URL; every seasonal component reads from the single version resolved
 * here, so a cutover changes the top bar, hero badge/H1/urgency line, sale
 * banner, sticky bar label, footer sale line and meta title together.
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

/** Icon export names from lib/icons used by the seasonal banner chips. */
export type BannerIcon =
  | "Tag" | "Gift" | "Sparkle" | "Laptop" | "Ticket" | "Luggage" | "Champagne" | "Snowflake" | "Mountains";

/** Seasonal sale banner (Component F): photo stage, glass panel, three chips, CTA. */
export type SeasonBanner = {
  image: string;
  /** Eyebrow heading reads "<name>: <hook>". */
  name: string;
  hook: string;
  paragraph: string;
  chips: readonly [SeasonChip, SeasonChip, SeasonChip];
  cta: string;
};

export type SeasonChip = { icon: BannerIcon; text: string };

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
  banner: SeasonBanner;
  animation: SeasonAnimation;
};

const metaTitle = (versionName: string) =>
  `Shenandoah Valley, Virginia ${versionName} | 4-Day/3-Night at Massanutten Resort, Only $99 Per Package`;

const h1 = (versionName: string) =>
  `Shenandoah Valley, Virginia ${versionName}: 4-Day/3-Night at Massanutten Resort`;

/** Snow tubing lane behind the seasonal banner (source resort-video thumbnail). */
const BANNER_IMAGE = "/images/massanutten/snow-tubing-lane.webp";
/** Holiday Season: the resort lodge on a snowy day. */
const BANNER_IMAGE_HOLIDAY = "/images/massanutten/resort-lodge-snow.webp";
/** New Year: a skier on the slopes at sunset. */
const BANNER_IMAGE_NEW_YEAR = "/images/massanutten/skier-sunset.webp";

/** Winter base and the Jan 4+ state share every seasonal field. */
const WINTER_SHARED: Omit<Season, "key" | "start" | "end"> = {
  topBarDesktop:
    "WINTER GETAWAY • Shenandoah Valley 4 Days / 3 Nights for $99 • 2 Ski Day Passes included",
  topBarMobile: "WINTER GETAWAY: 4 Days / 3 Nights, $99 + ski passes",
  countdown: { kind: "none" },
  badge: "WINTER GETAWAY",
  h1: h1("Winter Getaway"),
  urgency: "Hurry, the best dates book up fast!",
  stickyLabel: "4-Days / 3-Nights MASSANUTTEN WINTER GETAWAY",
  stickyPkgLine1: "MASSANUTTEN WINTER",
  stickyPkgLine2: "GETAWAY",
  metaTitle: metaTitle("Winter Getaway"),
  banner: {
    image: BANNER_IMAGE,
    name: "Winter Getaway",
    hook: "4 Days / 3 Nights + 2 Ski Day Passes",
    paragraph:
      "Book 4 days and 3 nights at Massanutten Resort for $99 per package, with 2 Ski Day Passes included. Come for skiing, snow tubing, ice skating and the indoor WaterPark. You'll have 12 months to travel.",
    chips: [
      { icon: "Tag", text: "$99 per package" },
      { icon: "Ticket", text: "2 Ski Day Passes included" },
      { icon: "Snowflake", text: "Skiing and snow tubing" },
    ],
    cta: "Book Winter Getaway for $99",
  },
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
      "BLACK FRIDAY • Shenandoah Valley 4 Days / 3 Nights for $99 + 2 ski passes • Ends Sunday 11:59 PM ET",
    topBarMobile: "BLACK FRIDAY: $99 getaway + ski passes • Ends Sun",
    countdown: { kind: "dhm", target: "2026-11-29T23:59:59-05:00" },
    badge: "BLACK FRIDAY DEAL",
    h1: h1("Black Friday Deal"),
    urgency: "Black Friday prices end Sunday night!",
    stickyLabel: "4-Days / 3-Nights BLACK FRIDAY GETAWAY",
    stickyPkgLine1: "BLACK FRIDAY",
    stickyPkgLine2: "GETAWAY",
    metaTitle: metaTitle("Black Friday Deal"),
    banner: {
      image: BANNER_IMAGE,
      name: "Black Friday",
      hook: "2 Ski Day Passes Included",
      paragraph:
        "This Black Friday, 4 days and 3 nights at Massanutten Resort is $99 per package, plus 2 Ski Day Passes. Shenandoah National Park and stunning caverns are all just a short drive away. Black Friday prices end Sunday night.",
      chips: [
        { icon: "Tag", text: "$99 per package, ends Sunday" },
        { icon: "Ticket", text: "2 Ski Day Passes included" },
        { icon: "Mountains", text: "In the Shenandoah Valley" },
      ],
      cta: "Book Black Friday for $99",
    },
    animation: "sparkle",
  },
  {
    key: "cm",
    start: "2026-11-30T00:00:00-05:00",
    end: "2026-12-01T00:00:00-05:00",
    topBarDesktop:
      "CYBER MONDAY • 24 hours only • Shenandoah Valley 4 Days / 3 Nights for $99 + ski passes • Ends midnight ET",
    topBarMobile: "CYBER MONDAY: 24 hrs only • $99 + ski passes",
    countdown: { kind: "hms", target: "2026-12-01T00:00:00-05:00" },
    badge: "CYBER MONDAY DEAL",
    h1: h1("Cyber Monday Deal"),
    urgency: "Cyber Monday prices end at midnight!",
    stickyLabel: "4-Days / 3-Nights CYBER MONDAY GETAWAY",
    stickyPkgLine1: "CYBER MONDAY",
    stickyPkgLine2: "GETAWAY",
    metaTitle: metaTitle("Cyber Monday Deal"),
    banner: {
      image: BANNER_IMAGE,
      name: "Cyber Monday",
      hook: "24 Hours Only, $99 + 2 Ski Day Passes",
      paragraph:
        "Today only, book 4 days and 3 nights at Massanutten Resort for $99 per package, with 2 Ski Day Passes included. You'll have 12 months to travel. Cyber Monday prices end at midnight.",
      chips: [
        { icon: "Laptop", text: "24 hours only" },
        { icon: "Luggage", text: "12 months to travel" },
        { icon: "Ticket", text: "2 Ski Day Passes included" },
      ],
      cta: "Book Cyber Monday for $99",
    },
    animation: "pixels",
  },
  {
    key: "tt",
    start: "2026-12-01T00:00:00-05:00",
    end: "2026-12-02T00:00:00-05:00",
    topBarDesktop:
      "TRAVEL TUESDAY • Shenandoah Valley 4 Days / 3 Nights for $99 + 2 ski passes • Today only, ends midnight",
    topBarMobile: "TRAVEL TUESDAY: $99 + ski passes • Today only",
    countdown: { kind: "hms", target: "2026-12-02T00:00:00-05:00" },
    badge: "TRAVEL TUESDAY DEAL",
    h1: h1("Travel Tuesday Deal"),
    urgency: "Travel Tuesday prices end tonight!",
    stickyLabel: "4-Days / 3-Nights TRAVEL TUESDAY DEAL",
    stickyPkgLine1: "TRAVEL TUESDAY",
    stickyPkgLine2: "DEAL",
    metaTitle: metaTitle("Travel Tuesday Deal"),
    banner: {
      image: BANNER_IMAGE,
      name: "Travel Tuesday",
      hook: "$99 Getaway + 2 Ski Day Passes",
      paragraph:
        "Lock in 4 days and 3 nights at Massanutten Resort for $99 per package today, then pick your dates any time in the next 12 months. 2 Ski Day Passes come with it. Travel Tuesday prices end tonight.",
      chips: [
        { icon: "Luggage", text: "Travel any time in 12 months" },
        { icon: "Ticket", text: "2 Ski Day Passes included" },
        { icon: "Mountains", text: "In the Shenandoah Valley" },
      ],
      cta: "Book Travel Tuesday for $99",
    },
    animation: "plane",
  },
  {
    key: "hs",
    start: "2026-12-02T00:00:00-05:00",
    end: "2026-12-26T00:00:00-05:00",
    topBarDesktop:
      "HOLIDAY SALE • Get a getaway your family would love! • Shenandoah Valley 4 Days / 3 Nights for $99 + 2 ski passes • Thru Dec 25",
    topBarMobile: "HOLIDAY SALE: $99 + ski passes • Thru Dec 25",
    countdown: { kind: "days", target: "2026-12-25T23:59:59-05:00" },
    badge: "HOLIDAY SALE",
    h1: h1("Holiday Sale"),
    urgency: "Holiday Sale prices end December 25!",
    stickyLabel: "4-Days / 3-Nights HOLIDAY SALE GETAWAY",
    stickyPkgLine1: "HOLIDAY SALE",
    stickyPkgLine2: "GETAWAY",
    metaTitle: metaTitle("Holiday Sale"),
    banner: {
      image: BANNER_IMAGE_HOLIDAY,
      name: "Holiday Sale",
      hook: "Give a Getaway, $99 + 2 Ski Day Passes",
      paragraph:
        "Give a getaway this year: 4 days and 3 nights at Massanutten Resort for $99 per package, with 2 Ski Day Passes. Skiing, snow tubing and the indoor WaterPark are all at the resort. Holiday Sale prices end December 25.",
      chips: [
        { icon: "Ticket", text: "2 Ski Day Passes included" },
        { icon: "Snowflake", text: "Skiing and snow tubing" },
        { icon: "Tag", text: "$99 through December 25" },
      ],
      cta: "Book Holiday Sale for $99",
    },
    animation: "lights",
  },
  {
    key: "ny",
    start: "2026-12-26T00:00:00-05:00",
    end: "2027-01-04T00:00:00-05:00",
    topBarDesktop:
      "NEW YEAR BLOWOUT • Start 2027 with a trip booked • Shenandoah Valley 4 Days / 3 Nights, $99 • Ends Jan 3",
    topBarMobile: "NEW YEAR BLOWOUT: $99 getaway • Ends Jan 3",
    countdown: { kind: "days", target: "2027-01-03T23:59:59-05:00" },
    badge: "NEW YEAR BLOWOUT",
    h1: h1("New Year Blowout"),
    urgency: "New Year prices end January 3!",
    stickyLabel: "4-Days / 3-Nights NEW YEAR BLOWOUT DEAL",
    stickyPkgLine1: "NEW YEAR BLOWOUT",
    stickyPkgLine2: "DEAL",
    metaTitle: metaTitle("New Year Blowout"),
    banner: {
      image: BANNER_IMAGE_NEW_YEAR,
      name: "New Year Blowout",
      hook: "$99 Getaway + 2 Ski Day Passes",
      paragraph:
        "Start 2027 with a trip booked: 4 days and 3 nights at Massanutten Resort for $99 per package, plus 2 Ski Day Passes. You'll have 12 months to travel. New Year prices end January 3.",
      chips: [
        { icon: "Champagne", text: "$99 per package, ends January 3" },
        { icon: "Ticket", text: "2 Ski Day Passes included" },
        { icon: "Luggage", text: "12 months to travel" },
      ],
      cta: "Book New Year Blowout for $99",
    },
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
