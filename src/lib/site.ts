import { META_DESCRIPTION } from "@/lib/offer";
import { DEFAULT_SEASON } from "@/lib/season";

/** CONFIRM: proposed slug; the checkout path must exist in VacationVIP before launch. */
export const SLUG = "sogno-massanutten-99-eoy";

export const CHECKOUT_URL = `https://vacationvip.com/checkout/${SLUG}/general-information`;

/**
 * Checkout flow. Every Reserve button on the landing page enters at step 1;
 * each step hands off to the next with router.push, and the booking itself
 * lives in a sessionStorage-backed store (lib/booking-store) so the Package
 * Summary on the right stays in sync across pages.
 *
 *   landing -> /checkout (general info + dates)
 *           -> /checkout/payment (card; Booking Protection modal on submit)
 *           -> /checkout/extend  (extra night, $49)
 *           -> /checkout/tickets (attraction tickets)
 *           -> /checkout/extra-vacation ($39)
 *           -> /confirmation
 */
export const RESERVE_URL = "/checkout";
export const FLOW = {
  general: "/checkout",
  payment: "/checkout/payment",
  extend: "/checkout/extend",
  tickets: "/checkout/tickets",
  extraVacation: "/checkout/extra-vacation",
  confirmation: "/confirmation",
} as const;
/** Kept for the one consumer that still reads it (CheckoutRouter's window global). */
export const CONFIRMATION_PATH = FLOW.confirmation;

export const CANONICAL_URL = `https://www.vacationvip.com/${SLUG}/`;
export const OG_IMAGE_URL = `https://www.vacationvip.com/getaways/${SLUG}/images/og-share.jpg`;

/**
 * Meta title is seasonal (copy spec §5) and resolved per-request in the layout;
 * this is the base-state title used as the static fallback.
 */
export const PAGE_TITLE = DEFAULT_SEASON.metaTitle;

/** Meta description is the same across all versions (copy spec §5). */
export const PAGE_DESCRIPTION = META_DESCRIPTION;

/** Webflow export identifiers kept on <html> for parity with the original markup. */
export const WEBFLOW_PAGE_ID = "692f2462677bc22e5d727887";
export const WEBFLOW_SITE_ID = "692f2462677bc22e5d72788e";
