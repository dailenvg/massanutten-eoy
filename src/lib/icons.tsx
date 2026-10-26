/**
 * Icon system — Phosphor.
 *
 * Every icon on the site comes from here, so the family, weight and defaults
 * are decided in one place rather than per component. Exports keep the names
 * the app already used, so a glyph swap is a one-line change in this file
 * instead of a find-and-replace across components.
 *
 * Weight is "bold" across the board: Phosphor's "regular" is visibly lighter
 * than the 2px strokes this design was drawn with, and mixing weights is the
 * fastest way to make an icon set look accidental.
 *
 * Imported from `/dist/ssr` so the icons render in server components too —
 * the default entry is client-only.
 */
import type { ComponentProps, ComponentType, CSSProperties } from "react";
import {
  Baby as PhBaby,
  Bank as PhBank,
  Buildings as PhBuildings,
  EnvelopeSimple as PhEnvelopeSimple,
  Moon as PhMoon,
  Receipt as PhReceipt,
  User as PhUser,
  Users as PhUsers,
  ArrowsClockwise as PhArrowsClockwise,
  CalendarBlank as PhCalendarBlank,
  CalendarDots as PhCalendarDots,
  Clock as PhClock,
  Headset as PhHeadset,
  Barbell as PhBarbell,
  Basket as PhBasket,
  Bed as PhBed,
  BeerStein as PhBeerStein,
  Boat as PhBoat,
  CalendarCheck as PhCalendarCheck,
  ClockCountdown as PhClockCountdown,
  CaretLeft as PhCaretLeft,
  CaretRight as PhCaretRight,
  CreditCard as PhCreditCard,
  Check as PhCheck,
  CheckCircle as PhCheckCircle,
  CursorClick as PhCursorClick,
  DoorOpen as PhDoorOpen,
  Fish as PhFish,
  FlagPennant as PhFlagPennant,
  Flame as PhFlame,
  Footprints as PhFootprints,
  ForkKnife as PhForkKnife,
  GameController as PhGameController,
  Gift as PhGift,
  Info as PhInfo,
  Lightning as PhLightning,
  LockKey as PhLockKey,
  Lifebuoy as PhLifebuoy,
  Martini as PhMartini,
  MapPin as PhMapPin,
  MusicNotes as PhMusicNotes,
  PencilSimple as PhPencilSimple,
  Phone as PhPhone,
  Pinwheel as PhPinwheel,
  Pizza as PhPizza,
  Play as PhPlay,
  PlayCircle as PhPlayCircle,
  SealCheck as PhSealCheck,
  ShieldCheck as PhShieldCheck,
  ShieldWarning as PhShieldWarning,
  Snowflake as PhSnowflake,
  Sparkle as PhSparkle,
  Star as PhStar,
  SunHorizon as PhSunHorizon,
  SuitcaseRolling as PhSuitcaseRolling,
  Tag as PhTag,
  Timer as PhTimer,
  Ticket as PhTicket,
  Umbrella as PhUmbrella,
  Warning as PhWarning,
  Waves as PhWaves,
  X as PhX,
  Champagne as PhChampagne,
  Laptop as PhLaptop,
  Key as PhKey,
  IceCream as PhIceCream,
  Coffee as PhCoffee,
  FilmSlate as PhFilmSlate,
  Hamburger as PhHamburger,
  Golf as PhGolf,
  CastleTurret as PhCastle,
  Car as PhCar,
  PersonSimpleSki as PhPersonSimpleSki,
  PersonSimpleBike as PhPersonSimpleBike,
  Horse as PhHorse,
  Wine as PhWine,
  Binoculars as PhBinoculars,
  Television as PhTelevision,
  Couch as PhCouch,
  ShoppingBag as PhShoppingBag,
  Airplane as PhAirplane,
  Sun as PhSun,
  Confetti as PhConfetti,
  TreeEvergreen as PhTreeEvergreen,
  Mountains as PhMountains,
  FlowerLotus as PhFlowerLotus,
  PersonSimpleHike as PhPersonSimpleHike,
  Storefront as PhStorefront,
  Bathtub as PhBathtub,
} from "@phosphor-icons/react/dist/ssr";

/** One weight for the whole set. */
const WEIGHT = "bold" as const;

/*
  Phosphor defaults to size "1em"; Lucide defaulted to 24px. Matching 24 keeps
  every call site that never passed a size rendering at the size it was built
  against — CSS and inline styles still win, since size only sets the svg's
  width/height attributes.
*/
const SIZE = 24;

type PhosphorIcon = ComponentType<ComponentProps<typeof PhWaves>>;

/** The prop subset the app actually passes to an icon. */
export type IconProps = {
  className?: string;
  style?: CSSProperties;
  "aria-hidden"?: boolean | "true" | "false";
  size?: number | string;
};

/** Locks the weight so no call site can drift off the set. */
function icon(Glyph: PhosphorIcon, name: string) {
  const Wrapped = (props: IconProps) => <Glyph weight={WEIGHT} size={SIZE} {...props} />;
  Wrapped.displayName = `Icon(${name})`;
  return Wrapped;
}

/*
  The one sanctioned exception to the single weight: glyphs that read as a solid
  mark rather than a line icon — rating stars, the verified seal, the play
  triangle sitting inside its own circle. Drawn "bold" they read as outlines and
  the CSS fill floods the counters. Use `solid` only for those.
*/
function solid(Glyph: PhosphorIcon, name: string) {
  const Wrapped = (props: IconProps) => <Glyph weight="fill" size={SIZE} {...props} />;
  Wrapped.displayName = `Icon(${name},fill)`;
  return Wrapped;
}

/* Navigation and controls */
export const ChevronLeft = icon(PhCaretLeft, "ChevronLeft");
export const ChevronRight = icon(PhCaretRight, "ChevronRight");
export const Phone = icon(PhPhone, "Phone");
/** Phone modal: agent mark, hours rows and time zone. */
export const Headset = icon(PhHeadset, "Headset");
export const CalendarDots = icon(PhCalendarDots, "CalendarDots");
export const Clock = icon(PhClock, "Clock");
export const CalendarCheck = icon(PhCalendarCheck, "CalendarCheck");
export const Play = icon(PhPlay, "Play");
export const PlaySolid = solid(PhPlay, "PlaySolid");
export const CirclePlay = icon(PhPlayCircle, "CirclePlay");
export const MousePointerClick = icon(PhCursorClick, "MousePointerClick");
export const X = icon(PhX, "X");
export const PencilSimple = icon(PhPencilSimple, "PencilSimple");
export const CalendarBlank = icon(PhCalendarBlank, "CalendarBlank");

/* Checkout */
export const CreditCard = icon(PhCreditCard, "CreditCard");
export const LockKey = icon(PhLockKey, "LockKey");
export const Info = icon(PhInfo, "Info");
export const Warning = icon(PhWarning, "Warning");
export const ShieldCheck = icon(PhShieldCheck, "ShieldCheck");
/* Booking Protection reasons */
export const ClockCountdown = icon(PhClockCountdown, "ClockCountdown");
export const ArrowsClockwise = icon(PhArrowsClockwise, "ArrowsClockwise");
export const ShieldWarning = icon(PhShieldWarning, "ShieldWarning");
/** Countdown and scarcity cues in the checkout flow. */
export const Timer = icon(PhTimer, "Timer");
export const Lightning = solid(PhLightning, "Lightning");
export const Sparkle = solid(PhSparkle, "Sparkle");

/* Offer and resort */
export const BedDouble = icon(PhBed, "BedDouble");
export const Bed = icon(PhBed, "Bed");
export const DoorOpen = icon(PhDoorOpen, "DoorOpen");
/* SUBSTITUTION: Phosphor has no refrigerator glyph — Snowflake reads as cold storage. */
export const Refrigerator = icon(PhSnowflake, "Refrigerator");
export const Check = icon(PhCheck, "Check");
export const CheckCircle = icon(PhCheckCircle, "CheckCircle");
/** Review credibility marks (Guest Reviews cards) — solid, see `solid` above. */
export const SealCheck = solid(PhSealCheck, "SealCheck");
export const Star = solid(PhStar, "Star");
export const Waves = icon(PhWaves, "Waves");
export const Ship = icon(PhBoat, "Ship");
export const Umbrella = icon(PhUmbrella, "Umbrella");

/* Food and drink */
export const Martini = icon(PhMartini, "Martini");
export const Beer = icon(PhBeerStein, "Beer");
export const Pizza = icon(PhPizza, "Pizza");
export const Utensils = icon(PhForkKnife, "Utensils");

/* Activities */
export const Footprints = icon(PhFootprints, "Footprints");
export const LifeBuoy = icon(PhLifebuoy, "LifeBuoy");
export const Baby = icon(PhBaby, "Baby");
export const Dumbbell = icon(PhBarbell, "Dumbbell");
export const Gamepad2 = icon(PhGameController, "Gamepad2");
/* SUBSTITUTION: Phosphor has no ferris wheel — Pinwheel is the nearest spoked form. */
export const FerrisWheel = icon(PhPinwheel, "FerrisWheel");
export const Landmark = icon(PhBank, "Landmark");
export const Fish = icon(PhFish, "Fish");
export const Flame = icon(PhFlame, "Flame");
export const FlameSolid = solid(PhFlame, "FlameSolid");
export const Sunset = icon(PhSunHorizon, "Sunset");
export const Music = icon(PhMusicNotes, "Music");
export const ShoppingBasket = icon(PhBasket, "ShoppingBasket");
export const FlagTriangleRight = icon(PhFlagPennant, "FlagTriangleRight");
export const Ticket = icon(PhTicket, "Ticket");

/* Promo */
export const Gift = icon(PhGift, "Gift");
export const Tag = icon(PhTag, "Tag");
export const Luggage = icon(PhSuitcaseRolling, "Luggage");
export const Champagne = icon(PhChampagne, "Champagne");
export const Laptop = icon(PhLaptop, "Laptop");
export const ShoppingBag = icon(PhShoppingBag, "ShoppingBag");
export const Confetti = icon(PhConfetti, "Confetti");
export const TreeEvergreen = icon(PhTreeEvergreen, "TreeEvergreen");
export const Airplane = icon(PhAirplane, "Airplane");
export const Snowflake = icon(PhSnowflake, "Snowflake");
export const Sun = icon(PhSun, "Sun");
export const Mountains = icon(PhMountains, "Mountains");
export const Spa = icon(PhFlowerLotus, "Spa");
export const Hike = icon(PhPersonSimpleHike, "Hike");
export const Storefront = icon(PhStorefront, "Storefront");
export const HotTub = icon(PhBathtub, "HotTub");
/** Room key, paired with Gift in the hero bonus pill. */
export const Key = icon(PhKey, "Key");

/* Amenities and attractions */
export const IceCream = icon(PhIceCream, "IceCream");
export const Coffee = icon(PhCoffee, "Coffee");
export const Film = icon(PhFilmSlate, "Film");
export const Burger = icon(PhHamburger, "Burger");
export const Golf = icon(PhGolf, "Golf");
export const Castle = icon(PhCastle, "Castle");
export const Car = icon(PhCar, "Car");
export const Ski = icon(PhPersonSimpleSki, "Ski");
export const Bike = icon(PhPersonSimpleBike, "Bike");
export const Horse = icon(PhHorse, "Horse");
export const Wine = icon(PhWine, "Wine");
export const Binoculars = icon(PhBinoculars, "Binoculars");

/* Room features */
export const Tv = icon(PhTelevision, "Tv");
export const Sofa = icon(PhCouch, "Sofa");

/* Receipt rows — one glyph per fact, per Figma node 675:23572. */
export const User = icon(PhUser, "User");
export const Users = icon(PhUsers, "Users");
export const EnvelopeSimple = icon(PhEnvelopeSimple, "EnvelopeSimple");
export const Receipt = icon(PhReceipt, "Receipt");
export const Buildings = icon(PhBuildings, "Buildings");
export const Moon = icon(PhMoon, "Moon");

/* Wayfinding */
export const MapPin = icon(PhMapPin, "MapPin");

/**
 * Name-keyed lookup for content tables (lib/offer.ts, lib/season.ts) that
 * store an icon as a string. Unknown names fall back to Check at call sites.
 */
export const ICONS_BY_NAME: Record<string, ComponentType<IconProps>> = {
  BedDouble, Bed, DoorOpen, Refrigerator, Check, CheckCircle, Waves, Ship, Umbrella,
  Martini, Beer, Pizza, Utensils, Footprints, LifeBuoy, Baby, Dumbbell, Gamepad2,
  FerrisWheel, Landmark, Fish, Flame, Sunset, Music, ShoppingBasket, FlagTriangleRight,
  Ticket, Gift, Tag, Luggage, Champagne, Laptop, Key, IceCream, Coffee, Film, Burger,
  Golf, Castle, Car, MapPin, Sparkle, Star, Snowflake, Mountains, Spa, Hike, Storefront,
  HotTub, TreeEvergreen, Ski, Bike, Horse, Wine, Binoculars, Tv, Sofa,
};
