"use client";

import { useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { srcSetFor } from "@/lib/image-variants";
import type { Variants } from "framer-motion";
import {
  BedDouble,
  Buildings,
  CalendarBlank,
  CalendarCheck,
  CreditCard,
  EnvelopeSimple,
  Luggage,
  Moon,
  Phone,
  Receipt,
  ShieldCheck,
  Tag,
  Ticket,
  Umbrella,
  User,
  Users,
  Warning,
} from "@/lib/icons";
import { TWEEN_COMPONENT } from "@/lib/motion";
import { BookingProvider, useBooking } from "@/lib/booking-store";
import { PACKAGE_NIGHTS, fmtDate, money, priceLabel } from "@/lib/booking";

const noop = () => () => {};
/** Purchase date in the viewer's locale; "—" on the server so markup matches. */
const todayLabel = () => new Date().toLocaleDateString("en-US");

/** Hero strip: a short banner (981x234 max) that crops the panorama to cover; phones show ~1.43x the width. */
const HERO_SIZES = "(max-width: 767px) 143vw, (max-width: 1023px) calc(100vw - 64px), 981px";
import type { Addons } from "@/lib/booking";
import {
  PHONE_DISPLAY,
  PHONE_HOURS,
  PHONE_HREF,
  RESORT_NAME,
  ROOM_TYPE,
  TRAVEL_LINE,
} from "@/lib/offer";

/**
 * Receipt — Figma node 4093:4380.
 *
 * The comp is a hero strip with a "Total paid" bar, "Congrats! All set!", a
 * yellow ACTION REQUIRED panel, and the vacation summary list.
 *
 * Everything shown comes from the booking store (guest details from step 1,
 * add-ons from steps 3–5); no card data is ever in that store. The receipt
 * number is generated client-side when payment is marked complete and the
 * purchase date at render — both should come back from the processor once one
 * is wired up. See the note in Step2Payment.
 */

const group: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: TWEEN_COMPONENT },
};

const fade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: TWEEN_COMPONENT },
};

export default function Confirmation({ heroImage }: { heroImage: string }) {
  return (
    <BookingProvider>
      <ConfirmationInner heroImage={heroImage} />
    </BookingProvider>
  );
}

function ConfirmationInner({ heroImage }: { heroImage: string }) {
  const reduced = useReducedMotion();
  const v = reduced ? { group: fade, item: fade } : { group, item };
  const { booking, totals } = useBooking();
  const g = booking.guest;

  /* Rendered after mount so server and client markup match. */
  const date = useSyncExternalStore(noop, todayLabel, () => "—");

  const nights = PACKAGE_NIGHTS + booking.addons.extraNights;

  /* One glyph per fact, as the comp does, instead of a repeated check mark. */
  const packageRows: ReadonlyArray<[typeof User, string, string]> = [
    [User, "Purchaser name", `${g.firstName} ${g.lastName}`.trim() || "—"],
    [EnvelopeSimple, "Purchaser email", g.email || "—"],
    [CalendarBlank, "Purchase date", date],
    [Receipt, "Receipt no.", booking.confirmation || "—"],
    [Buildings, "Accommodations", RESORT_NAME],
    [BedDouble, "Unit type", ROOM_TYPE],
    [Moon, "Number of nights", `${nights} nights`],
    [Users, "Guests", `${g.adults} adult${g.adults === 1 ? "" : "s"}${g.kids ? `, ${g.kids} child${g.kids === 1 ? "" : "ren"}` : ""}`],
    [CalendarCheck, "Preferred check-in", g.knowsDates ? fmtDate(g.checkIn) : "Flexible, 12 months to travel"],
    [CreditCard, "Package price", money(totals.package)],
  ];

  const extraIcon: Record<keyof Addons, typeof User> = {
    protection: ShieldCheck,
    extraNights: Moon,
    tickets: Ticket,
    extraVacation: Umbrella,
  };

  return (
    <main className="cf">
      <motion.div
        className="cf-inner"
        variants={v.group}
        initial="hidden"
        animate="show"
      >
        <motion.div className="cf-hero" variants={v.item}>
          <img
            className="cf-hero-img"
            src={heroImage}
            srcSet={srcSetFor(heroImage)}
            sizes={HERO_SIZES}
            alt=""
            width={1920}
            height={600}
            fetchPriority="high"
            decoding="async"
          />
          <div className="cf-hero-bar">
            <span className="cf-hero-brand">VacationVIP.com</span>
            <span className="cf-hero-total">
              Total paid: <strong>{money(totals.total)}</strong>
            </span>
          </div>
        </motion.div>

        <motion.div className="cf-body" variants={v.item}>
          <h1 className="cf-title">Congrats! All set!</h1>
          <p className="cf-lede">
            Here are your vacation package details, bonuses and the travel perks
            you paid for.
          </p>

          {/* §Figma: yellow ACTION REQUIRED panel */}
          <section className="cf-action" aria-labelledby="cf-action-title">
            <div className="cf-action-copy">
              <h2 className="cf-action-title" id="cf-action-title"><Warning className="ic-inline" aria-hidden={true} />Action required</h2>
              <p>The resort requires additional details before we can confirm your travel dates.</p>
              <p>Please do <strong>NOT</strong> book your flights yet until we can speak with you!</p>
              <p>Any additional travel perks that were purchased will be distributed by your vacation agent.</p>
              <p className="cf-action-hours">
                <strong>Call center hours:</strong><br />
                {PHONE_HOURS}
              </p>
            </div>
            <a className="cf-action-cta" href={PHONE_HREF} data-call-cta>
              <Phone aria-hidden={true} />
              Call now: {PHONE_DISPLAY}
            </a>
          </section>

          <h2 className="cf-section-title">Your vacation summary</h2>

          {/*
            Figma node 675:23572: a rounded card whose sections are split by
            hairlines, each with its own icon + title over an icon-per-row list.
            The comp's third band is a bonus vacation this offer does not sell,
            so it has two sections; the total is ours, the comp has no receipt.
          */}
          <div className="cf-summary">
            <section className="cf-summary-section" aria-labelledby="cf-pkg">
              <h3 className="cf-summary-head" id="cf-pkg">
                <Luggage aria-hidden={true} />
                Vacation package
              </h3>
              <dl className="cf-list">
                {packageRows.map(([Icon, label, value]) => (
                  <div className="cf-list-row" key={label}>
                    <dt><Icon aria-hidden={true} />{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
              <p className="cf-travel-line">{TRAVEL_LINE}</p>
            </section>

            <section className="cf-summary-section" aria-labelledby="cf-extras">
              <h3 className="cf-summary-head" id="cf-extras">
                <Tag aria-hidden={true} />
                Extras
              </h3>
              <dl className="cf-list cf-list--extras">
                {totals.lines.map((line) => {
                  const Icon = extraIcon[line.key];
                  return (
                    <div className="cf-list-row" key={line.key}>
                      <dt><Icon aria-hidden={true} />{line.label}</dt>
                      <dd>{priceLabel(line.amount)}</dd>
                    </div>
                  );
                })}
                {totals.lines.length === 0 && (
                  <p className="cf-list-empty">No extras were added to this booking.</p>
                )}
                <div className="cf-list-row cf-list-row--total">
                  <dt>Total paid</dt>
                  <dd>{money(totals.total)}{totals.hasPending ? " + tickets" : ""}</dd>
                </div>
              </dl>
            </section>
          </div>

          <section className="cf-help">
            <p>
              Call now if you have any questions:{" "}
              <a href={PHONE_HREF} data-call-cta>{PHONE_DISPLAY}</a>
            </p>
            <p className="cf-help-hours">
              <strong>Hours of operation:</strong><br />
              {PHONE_HOURS}
            </p>
          </section>
        </motion.div>
      </motion.div>
    </main>
  );
}
