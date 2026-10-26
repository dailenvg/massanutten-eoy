/**
 * The booking as it moves through the checkout flow, and the money maths.
 *
 * One `computeTotals()` feeds the Price Details table on the payment step, the
 * Package Summary sidebar on every upsell step, and the receipt — so the number
 * a guest sees can never differ from one screen to the next. Prices come from
 * the copy spec's offer table (offer.ts); nothing here is invented.
 */
import {
  ADDON_BOOKING_PROTECTION,
  ADDON_EXTRA_NIGHT,
  ADDON_EXTRA_VACATION,
  PRICE,
  TICKET_PRICE,
  TICKET_PRICE_NUMBER,
  TICKETS_NAME,
} from "./offer";

export type Guest = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  adults: number;
  kids: number;
  /** "Know your preferred dates?" toggle on step 1. */
  knowsDates: boolean;
  /** ISO yyyy-mm-dd, or "" when the guest has not picked. */
  checkIn: string;
  checkOut: string;
};

export type Addons = {
  protection: boolean;
  /** Nights beyond the package's 3. The extend step offers one. */
  extraNights: number;
  /** Attraction tickets (product TBD). */
  tickets: boolean;
  extraVacation: boolean;
};

export type Booking = {
  guest: Guest;
  addons: Addons;
  /** Set when step 2 completes; the upsell steps require it. */
  paid: boolean;
  /** Epoch ms when the hold timer started (first visit to step 1). */
  holdStartedAt: number | null;
  /** Generated once, client-side, when the booking is first paid. */
  confirmation: string;
};

export const EMPTY_BOOKING: Booking = {
  guest: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    adults: 2,
    kids: 0,
    knowsDates: true,
    checkIn: "",
    checkOut: "",
  },
  addons: { protection: false, extraNights: 0, tickets: false, extraVacation: false },
  paid: false,
  holdStartedAt: null,
  confirmation: "",
};

/** The package's own nights, fixed by the offer. */
export const PACKAGE_NIGHTS = 3;

const num = (s: string) => Number(s.replace(/[^0-9.]/g, ""));

export const PRICES = {
  package: num(PRICE),
  /** Spec lists Booking Protection as a flat $24.99 — not per person. */
  protection: num(ADDON_BOOKING_PROTECTION),
  extraNight: num(ADDON_EXTRA_NIGHT),
  /** null while the ticket price point is TBD; see offer.ts. */
  tickets: TICKET_PRICE_NUMBER,
  extraVacation: num(ADDON_EXTRA_VACATION),
  bookingFee: 0,
} as const;

export const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

/** A price for display: real money, or the spec's placeholder when TBD. */
export const priceLabel = (n: number | null, placeholder = TICKET_PRICE) =>
  n === null ? placeholder : money(n);

export type UpgradeLine = {
  key: keyof Addons;
  label: string;
  /** null = price TBD; counts as 0 in the total. */
  amount: number | null;
  note?: string;
};

/**
 * One entry per add-on, at its single-unit price.
 *
 * The summary's purchased rows and its preview row both read from here, so the
 * offer a guest is looking at is described in exactly the same words and at
 * exactly the same price once it lands in the list.
 */
const UPGRADE_META: Record<keyof Addons, Omit<UpgradeLine, "key">> = {
  protection: { label: "Booking Protection", amount: PRICES.protection },
  extraNights: { label: "Extend stay", amount: PRICES.extraNight },
  tickets: { label: TICKETS_NAME, amount: PRICES.tickets },
  extraVacation: { label: "Extra Vacation", amount: PRICES.extraVacation },
};

/** Is this add-on on the booking? Extra nights are a count, the rest are flags. */
export const isAdded = (key: keyof Addons, addons: Addons) => {
  const v = addons[key];
  return typeof v === "number" ? v > 0 : v === true;
};

/**
 * The line for the add-on the current step is offering, before it is taken.
 *
 * Shown last in the summary so a guest can see what the offer in front of them
 * would cost. It is never folded into the total — the total stays what the
 * booking is actually worth right now.
 */
export const previewLine = (key: keyof Addons): UpgradeLine => ({ key, ...UPGRADE_META[key] });

/**
 * The add-ons in the order the flow offers them.
 *
 * The summary uses this to cut itself off at the step the guest is on, so a
 * guest who goes back is never shown an upgrade from a page ahead of them.
 */
export const ADDON_ORDER: (keyof Addons)[] = [
  "protection",
  "extraNights",
  "tickets",
  "extraVacation",
];

/**
 * The booking so far: every line up to and including the step being offered.
 *
 * Applied to the display only, never to `computeTotals()` — the total stays
 * what the booking is actually worth, whatever the list is showing.
 */
export function linesThrough(lines: UpgradeLine[], offering?: keyof Addons): UpgradeLine[] {
  if (!offering) return lines;
  const cut = ADDON_ORDER.indexOf(offering);
  return lines.filter((l) => ADDON_ORDER.indexOf(l.key) <= cut);
}

/** Which add-ons are on the booking, in the order the flow offers them. */
export function upgradeLines(addons: Addons): UpgradeLine[] {
  const lines: UpgradeLine[] = [];
  if (addons.protection) lines.push(previewLine("protection"));
  if (addons.extraNights > 0) {
    lines.push({
      ...previewLine("extraNights"),
      label:
        addons.extraNights === 1 ? "Extend stay" : `Extend stay (${addons.extraNights} nights)`,
      amount: PRICES.extraNight * addons.extraNights,
    });
  }
  if (addons.tickets) lines.push(previewLine("tickets"));
  if (addons.extraVacation) lines.push(previewLine("extraVacation"));
  return lines;
}

/**
 * How an add-on is named in the confirmation toast.
 *
 * Kept next to `upgradeLines()` so the toast and the Package Summary call the
 * same thing by the same name — a guest who reads "Booking Protection" in the
 * toast must find "Booking Protection" in the summary, not a second product.
 */
export const ADDON_TOAST_LABEL: Record<keyof Addons, string> = {
  protection: "Booking Protection",
  extraNights: "Extended Stay",
  tickets: TICKETS_NAME,
  extraVacation: "Extra Vacation",
};

/** The toast copy from the comp, with the add-on's own name slotted in. */
export const addonToastMessage = (key: keyof Addons) =>
  `Vacation Package + ${ADDON_TOAST_LABEL[key]} purchase confirmed!`;

export function computeTotals(addons: Addons) {
  const lines = upgradeLines(addons);
  const upgrades = lines.reduce((sum, l) => sum + (l.amount ?? 0), 0);
  return {
    package: PRICES.package,
    bookingFee: PRICES.bookingFee,
    upgrades,
    lines,
    total: PRICES.package + PRICES.bookingFee + upgrades,
    /** True when a TBD price is in the cart, so the total is a floor. */
    hasPending: lines.some((l) => l.amount === null),
  };
}

export const TAX_NOTE =
  "Price does not include hotel taxes which vary and are payable upon check-in.";

/** How long the package is held. The comps count down from ~10 minutes. */
export const HOLD_SECONDS = 10 * 60;

/* --- Dates ------------------------------------------------------------------ */

export const toISO = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const fromISO = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export const addDays = (d: Date, n: number) => {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
};

export const fmtShort = (iso: string) =>
  iso ? fromISO(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—";

export const fmtDate = (iso: string) =>
  iso ? fromISO(iso).toLocaleDateString("en-US") : "—";

/** Check-out follows from check-in: the package nights plus any extension. */
export const checkOutFor = (checkIn: string, extraNights: number) =>
  checkIn ? toISO(addDays(fromISO(checkIn), PACKAGE_NIGHTS + extraNights)) : "";
