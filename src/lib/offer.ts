/**
 * Static offer facts and copy for the Massanutten EOY page.
 *
 * Everything here is the same in every seasonal version; the per-version copy
 * lives in `season.ts`. Destination copy is verbatim from the Massanutten
 * landing page (massanutten-2-ski-tix) — do not paraphrase.
 */

/* -------------------------------------------------------------------------- */
/* PLACEHOLDERS — ship visibly as-is until the business confirms them.         */
/* Each is a one-line swap; every consumer reads from these constants.         */
/* -------------------------------------------------------------------------- */

/** Extra Vacation add-on details (checkout upsell). */
export const EXTRA_VACATION_DETAILS = "[Extra Vacation details TBD]";
/**
 * Checkout tickets step. No Massanutten ticket product is specified, so name
 * and price stay placeholders.
 */
export const TICKETS_NAME = "[ATTRACTION TICKETS: TBD]";
export const TICKET_PRICE = "[$XX]";
/** null until confirmed: the total adds nothing rather than a made-up figure. */
export const TICKET_PRICE_NUMBER: number | null = null;
/** The source page lists no phone number. "#" keeps every call link inert until one is confirmed. */
export const PHONE_DISPLAY = "[PHONE TBD]";
export const PHONE_HREF = "#";
/** False while PHONE_HREF is the placeholder: call links render as plain text, so nothing clickable is dead. */
export const PHONE_CONFIRMED = PHONE_HREF !== "#";

/* -------------------------------------------------------------------------- */
/* Confirmed offer facts (price, retail and discount verbatim from the source) */
/* -------------------------------------------------------------------------- */

export const PRICE = "$104";
export const PRICE_NUMBER = 104;
/** Retail value shown as "<value> VALUE" (source: "Retail $748"). */
export const RETAIL_VALUE = "$748";
export const VALUE_LINE = `${RETAIL_VALUE} VALUE`;
export const PRICE_UNIT = "Per Family";
/** Percent-off tag beside the offer card price, one line per entry (source: "86% OFF!"). */
export const PERCENT_OFF_LINES = ["86%", "OFF!"] as const;
/**
 * Resort tour video: the source page's Cloudflare Stream reel, re-encoded to
 * H.264/AAC MP4 with faststart. null hides every resort-video trigger and the player.
 */
export const RESORT_VIDEO_SRC: string | null = "/videos/resort-tour.mp4";
/**
 * WebVTT captions for the tour (WCAG 2.2 AA 1.2.2 if the reel has speech or
 * meaningful sound). null renders no <track>; set e.g. "/videos/resort-tour.en.vtt".
 */
export const RESORT_VIDEO_CAPTIONS: string | null = null;

export const NIGHTS = 3;
export const NIGHTS_LABEL = "4-Days / 3-Nights";
export const NIGHTS_LABEL_TIGHT = "4-Days/3-Nights";

export const RESORT_NAME = "Massanutten Resort® Hotel";
export const RESORT_SHORT = "Massanutten Resort";
export const RESORT_UPPER = "MASSANUTTEN RESORT HOTEL";
export const DESTINATION_CITY = "Shenandoah Valley";
export const DESTINATION = `${DESTINATION_CITY}, Virginia`;
export const PACKAGE_NAME = "Massanutten Resort & Ski Getaway Package";
export const OFFER_CARD_HEADING = PACKAGE_NAME;
/** Hero lockup lines (rendered uppercase by the lockup). Winter carries `bottom`; other seasons show their badge. */
export const LOCKUP_LINES = { top: "Massanutten Resort", middle: "SHENANDOAH", bottom: "Resort Getaway" } as const;
/** Resort logo on the offer card (source offer widget art). */
export const RESORT_LOGO = { src: "/images/massanutten/massanutten-logo.webp", alt: "Massanutten Resort", width: 500, height: 242 } as const;

export const ROOM_TYPE = "Resort Hotel Room";
export const PREVIEW_MINUTES = 120;

/** Call center hours, one row per day group (phone modal). CONFIRM: carried over from the template. */
export const PHONE_HOURS_ROWS = [
  { days: "Monday-Thursday", time: "9 AM-10 PM" },
  { days: "Friday", time: "9 AM-8 PM" },
  { days: "Saturday & Sunday", time: "10 AM-6 PM" },
] as const;
export const PHONE_HOURS_ZONE = "Eastern Time.";
/** "Monday-Thursday 9 AM-10 PM, Friday 9 AM-8 PM, Saturday & Sunday 10 AM-6 PM Eastern Time." */
export const PHONE_HOURS = `${PHONE_HOURS_ROWS.map(({ days, time }) => `${days} ${time}`).join(", ")} ${PHONE_HOURS_ZONE}`;
export const CALL_MICROCOPY = "Prefer to talk? Book by phone.";

export const TRAVEL_LINE = "You'll have 12 months to travel.";

/** Add-ons. Numbers drive checkout totals; strings drive copy. */
export const ADDON_EXTRA_NIGHT = "$49";
export const ADDON_EXTRA_NIGHT_NUMBER = 49;
export const ADDON_BOOKING_PROTECTION = "$24.99";
export const ADDON_BOOKING_PROTECTION_NUMBER = 24.99;
export const ADDON_EXTRA_VACATION = "$39";
export const ADDON_EXTRA_VACATION_NUMBER = 39;
export const ADDON_LINE = `Extra nights ${ADDON_EXTRA_NIGHT} • Booking Protection ${ADDON_BOOKING_PROTECTION} • Extra Vacation ${ADDON_EXTRA_VACATION}`;

/** Bonus: 2 Ski Day Passes (source wording). */
export const BONUS_INCLUDES = "Includes: 2 Ski Day Passes";
export const SKI_PASS_TERMS =
  "Valid for one day each on the slopes. Present at the ticket window to redeem. Does not cover your full stay.";

/* -------------------------------------------------------------------------- */
/* Component B — hero                                                         */
/* -------------------------------------------------------------------------- */

/** Hero offer card and Resort Details bullets (source offer card lines). */
export const HERO_PERKS = [
  { icon: "Ticket", text: "Includes 2 Ski Day Passes valid for slope access during your stay." },
  { icon: "Mountains", text: "4-days/3 nights in a scenic Shenandoah Valley hotel room near the ski slopes." },
] as const;

export const HERO_BONUS_BANNER = {
  pillText: "INCLUDES: 2 SKI DAY PASSES, VALID FOR SLOPE ACCESS DURING YOUR STAY",
  /** The same line split for the two-line white panel. */
  lead: "INCLUDES: 2 SKI DAY PASSES",
  sub: "VALID FOR SLOPE ACCESS",
  /** Pass art on the panel: "+2 / Ski Day Passes". */
  cardPrefix: "+",
  cardAmount: "2",
  cardLabel: "Ski Day Passes",
  bigWord: "MOUNTAIN",
  bigWordSub: "Views",
  bigText: "RESORT",
  pill: "HOTEL",
} as const;

/* -------------------------------------------------------------------------- */
/* Component C — meta                                                         */
/* -------------------------------------------------------------------------- */

export const META_DESCRIPTION =
  "4-Day/3-Night Stay for $104 at Massanutten Resort in Virginia’s Shenandoah Valley. Save 86% on a family getaway with 2 Ski Day Passes.";

/** Byte-identical, do not edit. */
export const TIMESHARE_DISCLOSURE =
  "THIS ADVERTISING MATERIAL IS BEING USED FOR THE PURPOSE OF SOLICITING SALES OF TIMESHARE INTERESTS OR PLANS";

/** Footer sponsor line. Byte-identical to the source page footer, do not edit. */
export const SPONSOR_DISCLOSURE =
  "This Promotion is Sponsored by: Great Eastern Resort Corporation (Massanutten Resort® Hotel) of 3386 Holland Road, Suite 200, Virginia Beach, Virginia 23452, and Recreational Resorts, Ltd. (Presidential Resort) of 3386 Holland Road, Suite 200, Virginia Beach, Virginia 23452 (collectively referred to as the \"Sponsor\").";

/* -------------------------------------------------------------------------- */
/* Component E — What You Get & Why You Get It                                */
/* -------------------------------------------------------------------------- */

export const ACCOMMODATIONS_PARAGRAPH =
  "Stay 3-Nights in a Massanutten Resort® hotel unit, conveniently located in the heart of the resort, within walking distance of ski slopes, snow tubing, Base Camp, and the Family Adventure Center.";

export const WYG_INCLUDES = [
  "2 Ski Day Passes to use during your stay",
] as const;

export const PREVIEW_PARAGRAPH =
  "You and your family will be our guests for a fun and friendly 120-minute resort preview. During this preview, you’ll learn about the benefits of our vacation ownership program. There’s no obligation to purchase; the rest of your vacation is simply yours to enjoy!";

/* -------------------------------------------------------------------------- */
/* Component G — destination                                                  */
/* -------------------------------------------------------------------------- */

export const DESTINATION_HEADING = `Stay 3-Nights at ${RESORT_SHORT}`;

/** winter through ny. */
export const DESTINATION_PARAGRAPH_HOLIDAY =
  "Escape to your Massanutten Resort hotel unit – Your Ultimate Four-Season Adventure! The Shenandoah Valley offers year-round adventure with activities like skiing, hiking, and a spa. Experience top-tier amenities like the thrilling indoor/outdoor WaterPark and pristine golf course. Plus, explore nearby wonders like Shenandoah National Park and stunning caverns, all just a short drive away.";

/** From Jan 4 (late). The source paragraph is four-season, so it carries no holiday events to drop. */
export const DESTINATION_PARAGRAPH_LATE = DESTINATION_PARAGRAPH_HOLIDAY;

/* -------------------------------------------------------------------------- */
/* Component H — What's Included tabs                                         */
/* -------------------------------------------------------------------------- */

export const TAB_CARD_BULLETS = [
  `3-Night Stay in a ${ROOM_TYPE}`,
  BONUS_INCLUDES,
] as const;

export const TAB_ACCOM_INTRO =
  "Your getaway includes 3 nights of accommodations in a Massanutten Resort® hotel room, nestled in the scenic Shenandoah Mountains, plus 2 Ski Day Passes. A premier all-season destination offering the perfect blend of relaxation and adventure, with stunning mountain views surrounding you.";

export const ROOM_FEATURES = [
  { icon: "BedDouble", text: "Standard Room (Sleeps up to 4)" },
  { icon: "Sofa", text: "Comfortable living area" },
  { icon: "Tv", text: "TV (with cable)" },
  { icon: "DoorOpen", text: "Private balcony" },
] as const;

export const TAB_AMENITIES_INTRO =
  "Massanutten Resort delivers four seasons of fun under one roof. Whether you're chasing fresh powder on the slopes or warming up in the indoor WaterPark, there's something here for every member of the family.";

/** Tab 2, "What's Included at the Resort". */
export const RESORT_AMENITIES = [
  { id: "ski", icon: "Ski", text: "Skiing & Snowboarding" },
  { id: "indoor-water-park", icon: "Waves", text: "Indoor WaterPark" },
  { id: "tubing", icon: "Snowflake", text: "Snow Tubing" },
  { id: "outdoor-water-park", icon: "Umbrella", text: "Outdoor WaterPark" },
  { id: "ice-skating", icon: "Snowflake", text: "Ice Skating Rink" },
  { id: "spa", icon: "Spa", text: "Full-Service Spa" },
  { id: "dining", icon: "Utensils", text: "4 Onsite Restaurants" },
  { id: "golf", icon: "Golf", text: "Golf — Two Courses" },
] as const;

export const TAB_BONUS_INTRO =
  "Every Massanutten getaway comes with 2 Ski Day Passes. That's our way of making sure your trip feels like even more of a win. Hit the slopes during your stay.";

export const TAB_BONUS_ITEMS = [
  { icon: "Ticket", text: "2 Ski Day Passes" },
  { icon: "Snowflake", text: SKI_PASS_TERMS },
  { icon: "Tag", text: `Add-ons: ${ADDON_LINE}` },
] as const;

export const TAB_TODO_INTRO =
  "Massanutten sits in the heart of Virginia's Shenandoah Valley — surrounded by mountains, caverns, rivers, and small towns full of character. Your stay is just the starting point; the whole valley is yours to explore.";

const SHENANDOAH_PARK = { icon: "TreeEvergreen", text: "Shenandoah National Park" } as const;
const LURAY_CAVERNS = { icon: "Mountains", text: "Luray Caverns" } as const;
const CIVIL_WAR = { icon: "FlagTriangleRight", text: "Civil War Battlefields" } as const;
const SAFARI_PARK = { icon: "Binoculars", text: "Virginia Safari Park" } as const;
const STAUNTON = { icon: "Landmark", text: "Historic Staunton, Virginia" } as const;

/** Tab 4, "Nearby Attractions". */
export const NEARBY_ATTRACTIONS = [
  SHENANDOAH_PARK,
  LURAY_CAVERNS,
  { icon: "Car", text: "Skyline Drive — 105 Mile Scenic Route" },
  STAUNTON,
  CIVIL_WAR,
  SAFARI_PARK,
] as const;

/**
 * Tab 4 "This Winter". The source lists no dated winter events, so both
 * states show the resort's own winter activities from "What's Included at the Resort".
 */
const WINTER_ACTIVITIES = [
  "Skiing & Snowboarding",
  "Snow Tubing",
  "Ice Skating Rink",
  "Indoor WaterPark",
] as const;

/** Tab 4 "This Winter", winter through ny. */
export const THIS_WINTER_HOLIDAY = WINTER_ACTIVITIES;

/** Tab 4 "This Winter", from Jan 4 (late). */
export const THIS_WINTER_LATE = WINTER_ACTIVITIES;

/* -------------------------------------------------------------------------- */
/* Component I — More to Explore                                              */
/* -------------------------------------------------------------------------- */

export const EXPLORE_AMENITIES_TITLE = "Four Season Resort Amenities";
export const EXPLORE_ATTRACTIONS_TITLE = "Nearby Things to Do:";

export const EXPLORE_AMENITIES = [
  { icon: "Car", text: "Complimentary Parking" },
  { icon: "Snowflake", text: "Ice Skating & Snow Tubing" },
  { icon: "Waves", text: "Outdoor & Indoor Pools" },
  { icon: "Utensils", text: "4 Onsite Restaurants" },
  { icon: "Gamepad2", text: "Family Adventure Park" },
  { icon: "Golf", text: "Golf Lessons" },
  { icon: "Spa", text: "Full-Service Spa" },
  { icon: "Bike", text: "Hiking / Biking Trails" },
  { icon: "Umbrella", text: "Indoor / Outdoor WaterPark" },
  { icon: "Horse", text: "Horseback Riding" },
] as const;

/** Source "Nearby Things to Do" list; it has no holiday-only rows, so both states match. */
const EXPLORE_ATTRACTIONS = [
  SHENANDOAH_PARK,
  LURAY_CAVERNS,
  CIVIL_WAR,
  { icon: "Car", text: "Skyline Drive" },
  { icon: "Storefront", text: "Harrisonburg Farmers Market" },
  { icon: "Mountains", text: "Endless Caverns" },
  SAFARI_PARK,
  STAUNTON,
  { icon: "Wine", text: "Winery and Brewery Tours" },
  { icon: "Hike", text: "Blue Ridge Parkway" },
] as const;

export const EXPLORE_ATTRACTIONS_HOLIDAY = EXPLORE_ATTRACTIONS;
export const EXPLORE_ATTRACTIONS_LATE = EXPLORE_ATTRACTIONS;

/* -------------------------------------------------------------------------- */
/* Component J — reviews (Tripadvisor block)                                  */
/* -------------------------------------------------------------------------- */

// Rating, counts and quotes from the Massanutten source page ("Rated 4 out of 5").

export const TA_BUBBLES = 4;
export const TA_REVIEW_COUNT = "5,230 reviews";
export const TA_PURCHASED_LINE = "Over 8,239 People Have Purchased This Product";

export const REVIEWS = [
  {
    name: "Daniel M.",
    quote:
      "I thank God for allowing us to spend an excellent vacation in this place. We spent quality time enjoying the different entertainment options that the complex has as a family. It is very beautiful, with mountains, forests, lakes, swimming pools, the WaterPark, and more.",
    stars: 5,
  },
  {
    name: "Carmen Maria C.",
    quote:
      "We had a fun family winter vacation — there is always a lot to do. This is the second time we have traveled and it has always met our expectations. The facilities are in very good condition, the rooms have everything you need, and the activities are great.",
    stars: 5,
  },
  {
    name: "Armando A.",
    quote:
      "The resort is very nice and very pretty. Suitable for relaxation. They have various activities to do and there are several small towns that are very nice to visit nearby. The canoeing activity is very fun, beautiful, and relaxing.",
    stars: 5,
  },
] as const;

/* -------------------------------------------------------------------------- */
/* Component K — bonus CTA cards                                              */
/* -------------------------------------------------------------------------- */

export const BONUS_HEADING = "Included With Your Stay";
export const BONUS_SUBHEADING = "2 Ski Day Passes";
/** Mark on the seam between the two passes. */
export const BONUS_CONNECTOR = "+";

/** One card per pass: panel headline, then the pass art's label, amount unit and key line. */
export const BONUS_CARDS = [
  { heading: "SKI DAY PASS", label: "Ski Day", unit: "Pass", note: "Slope access" },
  { heading: "SKI DAY PASS", label: "Ski Day", unit: "Pass", note: "One day each" },
] as const;

/* -------------------------------------------------------------------------- */
/* Checkout — Extra Vacation upsell                                           */
/* -------------------------------------------------------------------------- */

export const EXTRA_VACATION_HEADING = `Add an Extra Vacation for ${ADDON_EXTRA_VACATION}`;
export const EXTRA_VACATION_LINE = `Add an Extra Vacation for just ${ADDON_EXTRA_VACATION}. ${EXTRA_VACATION_DETAILS}`;

/*
 * Extra Vacation step page (StepExtraVacation). DRAFT copy for the Writer pass.
 * Product specifics stay in EXTRA_VACATION_DETAILS until the business confirms
 * them; nothing below promises dates, nights or inclusions beyond the offer facts.
 */
export const EXTRA_VACATION_TITLE = "Add an Extra Vacation";
export const EXTRA_VACATION_LEAD =
  "Make room for more of the Shenandoah Valley. Add an Extra Vacation to your Massanutten Resort package.";
export const EXTRA_VACATION_PRICE_NOTE = "add-on";
export const EXTRA_VACATION_INCLUDED_LABEL = "Why add it";

export type ExtraVacationPerk = { icon: "Mountains" | "Waves" | "CalendarCheck"; title: string; text: string };

export const EXTRA_VACATION_PERKS: readonly ExtraVacationPerk[] = [
  { icon: "Mountains", title: "In the Shenandoah Valley", text: "Shenandoah National Park and stunning caverns are all just a short drive away." },
  { icon: "Waves", title: "Resort days, your way", text: "Skiing, snow tubing, a full-service spa, and the indoor WaterPark, all on site." },
  { icon: "CalendarCheck", title: "Details with your agent", text: "Add it now, and your vacation agent will go over the details with you." },
];

/**
 * Resort photos from the source page: indoor WaterPark hero, ski school and slope views beside it.
 * `focus` is each side photo's object-position in its cover crop (the snowboarder sits at x 6-18%).
 */
export const EXTRA_VACATION_PHOTOS = {
  hero: { src: "/images/massanutten/indoor-waterpark.webp", alt: "Indoor waterpark with families enjoying pool and water activities", width: 1024, height: 564 },
  side: [
    { src: "/images/massanutten/ski-instructor-young-skier.webp", alt: "Smiling ski instructor kneeling to talk with a young skier in a pink jacket", width: 1024, height: 568, focus: "50% 50%" },
    { src: "/images/massanutten/snowboarder-mountain-view.webp", alt: "Snowboarder taking in snowy mountain views from the top of a Massanutten slope", width: 1024, height: 566, focus: "0% 50%" },
  ],
} as const;

export const EXTRA_VACATION_ADDED = "Added to your package";

/** Checkout Booking Protection line. */
export const PROTECTION_LINE = `Add Booking Protection for ${ADDON_BOOKING_PROTECTION} and change your travel dates worry-free.`;

/* -------------------------------------------------------------------------- */
/* Emails: destination copy for the confirmation email and QA hub            */
/* -------------------------------------------------------------------------- */

/** Confirmation email preheader and hero alt text. */
export const CONFIRMATION_EMAIL_PREHEADER = `Your ${DESTINATION_CITY} getaway is booked. Call us to confirm your travel dates.`;
export const CONFIRMATION_EMAIL_HERO_ALT = `Resort lodge on a snowy day at ${RESORT_SHORT}, ${DESTINATION}`;

/** Email footer lines, matching components/home/Footer.tsx. */
export const COMPANY_LINE = "Sogno Tours, LLC d/b/a VacationVIP.com";
export const COMPANY_ADDRESS = "5900 Lake Ellenor Drive Suite 300, Orlando, FL 32809";

/** Subtitle in the /emails-hub QA dashboard header. */
export const EMAIL_DASHBOARD_SUBTITLE = `${RESORT_SHORT} email QA`;
