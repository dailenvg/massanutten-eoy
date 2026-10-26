"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { BedDouble, CalendarCheck, Check, ChevronRight, Luggage, ShieldCheck, Ship, Tag, Ticket } from "@/lib/icons";
import { useBooking } from "@/lib/booking-store";
import { PACKAGE_NIGHTS, fmtDate, isAdded, linesThrough, money, previewLine, priceLabel } from "@/lib/booking";
import type { Addons } from "@/lib/booking";
import { DESTINATION, PACKAGE_NAME, ROOM_TYPE } from "@/lib/offer";
import { TWEEN_COMPONENT } from "@/lib/motion";
import { srcSetFor } from "@/lib/image-variants";
import HoldTimer from "./HoldTimer";

/** 90px square crop of a 4:3 photo. */
const THUMB = "/images/massanutten/resort-lodge-snow.webp";

/**
 * Right-hand Package Summary on the upsell steps (Figma 244:5412 / 1:2845).
 *
 * Reads straight from the booking store, so an add-on accepted on one step is
 * already in the list and the total when the next step renders. The comp shows
 * four stars from a TripAdvisor rating the spec says to pull (§12, CONFIRM) —
 * no rating is shown until it exists.
 *
 * Upgrades lists what the guest has bought, then — last — a preview of the one
 * this step is offering, so they can see what it would add without it being
 * counted as theirs. Later steps' add-ons are never shown: the list is the
 * booking so far plus the decision in front of them, nothing further ahead.
 */
const ICONS = { protection: ShieldCheck, extraNights: BedDouble, tickets: Ticket, extraVacation: Luggage } as const;

export default function PackageSummary({ offering }: { offering?: keyof Addons }) {
  const { booking, totals } = useBooking();
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(true);
  const nights = PACKAGE_NIGHTS + booking.addons.extraNights;
  /* Only while it is still un-taken — once bought it is a real line above. */
  const preview = offering && !isAdded(offering, booking.addons) ? previewLine(offering) : null;
  /*
    The booking so far, not the whole booking: a guest who goes back to an
    earlier step must not see an upgrade from a page ahead of them. The total
    below is deliberately left whole — it is what they owe, not what is listed.
  */
  const lines = linesThrough(totals.lines, offering);
  const PreviewIcon = preview ? ICONS[preview.key] : null;
  const guests = `${booking.guest.adults} Adult${booking.guest.adults === 1 ? "" : "s"}${booking.guest.kids ? `, ${booking.guest.kids} Child${booking.guest.kids === 1 ? "" : "ren"}` : ""}`;

  return (
    <aside className="ps" aria-labelledby="ps-title">
      <h2 className="ps-title" id="ps-title">Package Summary</h2>

      <div className="ps-timer">
        <HoldTimer />
      </div>

      <div className="ps-purchased">
        <span className="ps-ribbon" aria-hidden="true">Purchased</span>
        <button
          type="button"
          className="ps-hotel"
          aria-expanded={open}
          aria-controls="ps-details"
          onClick={() => setOpen((o) => !o)}
        >
          <img className="ps-thumb" src={THUMB} srcSet={srcSetFor(THUMB)} sizes="144px" alt="" width={90} height={90} loading="lazy" />
          <span className="ps-hotel-copy">
            <span className="ps-hotel-name">{PACKAGE_NAME}</span>
            <span className="ps-hotel-city">{DESTINATION}</span>
            <span className="ps-hotel-line"><BedDouble aria-hidden={true} /><b>Unit type:</b> {ROOM_TYPE}</span>
            <span className="ps-hotel-line"><CalendarCheck aria-hidden={true} /><b>Number of nights:</b> {nights} nights</span>
          </span>
          <ChevronRight aria-hidden={true} className={`ps-chevron${open ? " is-open" : ""}`} />
        </button>

        <AnimatePresence initial={false}>
          {open ? (
            <motion.dl
              className="ps-details"
              id="ps-details"
              key="details"
              initial={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
              animate={reduced ? { opacity: 1 } : { opacity: 1, height: "auto" }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
              transition={TWEEN_COMPONENT}
            >
              <div><dt><Check aria-hidden={true} />Confirmation #:</dt><dd>{booking.confirmation || "—"}</dd></div>
              <div><dt><Ship aria-hidden={true} />Guests:</dt><dd>{guests}</dd></div>
              <div><dt><CalendarCheck aria-hidden={true} />Preferred check-in:</dt><dd>{booking.guest.knowsDates ? fmtDate(booking.guest.checkIn) : "Flexible, 12 months to travel"}</dd></div>
              <div><dt><CalendarCheck aria-hidden={true} />Preferred check-out:</dt><dd>{booking.guest.knowsDates ? fmtDate(booking.guest.checkOut) : "—"}</dd></div>
              <div><dt><Tag aria-hidden={true} />Booking Fee:</dt><dd>{money(totals.bookingFee)}</dd></div>
              <div><dt><Tag aria-hidden={true} />Package Price:</dt><dd>{money(totals.package)}</dd></div>
            </motion.dl>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="ps-extras">
        <h3 className="ps-extras-title">Upgrades</h3>
        {lines.length === 0 && !preview ? (
          <p className="ps-empty">None added yet.</p>
        ) : (
          <ul className="ps-list">
            <AnimatePresence initial={false}>
              {lines.map((line) => {
                const Icon = ICONS[line.key];
                return (
                  <motion.li
                    className="ps-line"
                    key={line.key}
                    layout={!reduced}
                    initial={{ opacity: 0, x: reduced ? 0 : 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: reduced ? 0 : 8 }}
                    transition={TWEEN_COMPONENT}
                  >
                    <Icon aria-hidden={true} />
                    <span className="ps-line-label">{line.label}{line.note ? <small> {line.note}</small> : null}</span>
                    <span className="ps-line-amt">{priceLabel(line.amount)}</span>
                  </motion.li>
                );
              })}

              {preview ? (
                <motion.li
                  className="ps-line ps-line--preview"
                  key="preview"
                  layout={!reduced}
                  initial={{ opacity: 0, x: reduced ? 0 : 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: reduced ? 0 : 8 }}
                  transition={TWEEN_COMPONENT}
                >
                  {PreviewIcon ? <PreviewIcon aria-hidden={true} /> : null}
                  <span className="ps-line-label">
                    {preview.label}{preview.note ? <small> {preview.note}</small> : null}
                    {/* Carries the "not yours yet" meaning for screen readers too,
                        which the muted styling alone would not. */}
                    <small className="ps-line-tag">On this page, not added yet</small>
                  </span>
                  <span className="ps-line-amt">{priceLabel(preview.amount)}</span>
                </motion.li>
              ) : null}
            </AnimatePresence>
          </ul>
        )}
      </div>

      <div className="ps-total">
        <span>Total price</span>
        <span className="ps-total-amt">{money(totals.total)}{totals.hasPending ? <small> + tickets</small> : null}</span>
      </div>
    </aside>
  );
}
