/**
 * Confirmation email tokens and copy.
 *
 * One navy VacationVIP design for every season (confirmation-email.ts).
 * Email clients cannot read CSS variables, so colours are literal hex. The
 * Terms come from lib/terms.ts, shared with the site's Terms page.
 *
 * Guest-specific values are ESP merge tags ({{...}}), filled at send time.
 */
import {
  COMPANY_ADDRESS,
  COMPANY_LINE,
  CONFIRMATION_EMAIL_HERO_ALT,
  CONFIRMATION_EMAIL_PREHEADER,
  PHONE_CONFIRMED,
  PHONE_DISPLAY,
  PHONE_HOURS,
  PHONE_HREF,
  RESORT_NAME,
  ROOM_TYPE,
  TRAVEL_LINE,
} from "./offer";

/** Fixed VacationVIP palette; seasons do not change it. */
export const CONFIRMATION_THEME = {
  page: "#eeeeee",
  card: "#ffffff",
  bar: "#1c425c",
  heading: "#205272",
  body: "#333333",
  strong: "#111111",
  note: "#e9f3fb",
  panel: "#f9f9f9",
  rule: "#e4e4e7",
  legalBg: "#f4f4f5",
  legalText: "#444444",
  footer: "#263b85",
  onDark: "#ffffff",
  ctaFrom: "#ff8b00",
  ctaTo: "#fd6b20",
  font: "'Inter',Arial,Helvetica,sans-serif",
  ctaFont: "'Roboto',Arial,Helvetica,sans-serif",
  fontsHref: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&amp;family=Roboto:wght@400;500;700&amp;display=swap",
} as const;

/** Site-relative images (PNG/JPG only); the route resolves them against the request origin. */
export const CONFIRMATION_IMAGES = {
  hero: { src: "/images/email/confirmation/hero-resort@2x.jpg", width: 600, height: 240, alt: CONFIRMATION_EMAIL_HERO_ALT },
  logo: { src: "/images/email/vacationvip-logo-white@2x.png", width: 140, height: 18, alt: "VacationVIP.com" },
  iconDir: "/images/email/confirmation",
} as const;

export const CONFIRMATION_COPY = {
  preheader: CONFIRMATION_EMAIL_PREHEADER,
  totalLabel: "Total paid:",
  total: "{{total_paid}}",
  title: "Congrats! All set!",
  lede: "Here are your vacation package details, bonuses and the travel perks you paid for.",
  actionTitle: "Action required",
  actionLines: [
    "The resort requires additional details before we can confirm your travel dates.",
    "Please do <strong>NOT</strong> book your flights yet until we can speak with you!",
    "Any additional travel perks that were purchased will be distributed by your vacation agent.",
  ],
  hoursLabel: "Call center hours:",
  hours: PHONE_HOURS,
  cta: `Call now: ${PHONE_DISPLAY}`,
  phoneHref: PHONE_HREF,
  phoneDisplay: PHONE_DISPLAY,
  /** False while the number is a placeholder: the call CTA and link render as plain text. */
  phoneConfirmed: PHONE_CONFIRMED,
  summaryTitle: "Your vacation summary",
  packageTitle: "Vacation package",
  travelLine: TRAVEL_LINE,
  extrasTitle: "Extras",
  extras: "{{extras_list}}",
  extrasTotalLabel: "Total paid",
  questions: "Call now if you have any questions:",
  hoursOfOperation: "Hours of operation:",
  footer: `${COMPANY_LINE} &bull; ${COMPANY_ADDRESS}`,
} as const;

export type ConfirmationRow = { icon: string; label: string; value: string };

/** Summary card rows: icon file (in iconDir), label, and the merge tag or fixed fact. */
export const CONFIRMATION_ROWS: readonly ConfirmationRow[] = [
  { icon: "user", label: "Purchaser name", value: "{{purchaser_name}}" },
  { icon: "mail", label: "Purchaser email", value: "{{purchaser_email}}" },
  { icon: "calendar", label: "Purchase date", value: "{{purchase_date}}" },
  { icon: "certificate", label: "Receipt no.", value: "{{receipt_number}}" },
  { icon: "hotel", label: "Accommodations", value: RESORT_NAME },
  { icon: "bed", label: "Unit type", value: ROOM_TYPE },
  { icon: "moon", label: "Number of nights", value: "{{nights}} nights" },
  { icon: "users", label: "Guests", value: "{{guests}}" },
  { icon: "calendar-check", label: "Preferred check-in", value: "{{check_in}}" },
  { icon: "card", label: "Package price", value: "{{package_price}}" },
];
