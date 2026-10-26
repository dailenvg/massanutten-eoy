"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { ArrowsClockwise, ClockCountdown, ShieldCheck, ShieldWarning, Star } from "@/lib/icons";
import { SPRING, TWEEN_COMPONENT } from "@/lib/motion";
import { PRICES, money } from "@/lib/booking";
import { PRICE_UNIT, RETAIL_VALUE } from "@/lib/offer";

/**
 * Booking Protection — shown once payment is submitted (Figma 1:2793).
 *
 * The comp prices it "$16.33 per person"; this offer's spec lists Booking
 * Protection as a flat $24.99, so the chip carries the package unit (PRICE_UNIT). Continue is
 * disabled until Yes or No is chosen, as the comp annotates.
 */
export default function ProtectionModal({
  open,
  onContinue,
}: {
  open: boolean;
  onContinue: (accepted: boolean) => void;
}) {
  const reduced = useReducedMotion();
  const [choice, setChoice] = useState<"yes" | "no" | null>(null);
  const firstRadio = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    firstRadio.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="md-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={TWEEN_COMPONENT}>
          <motion.div
            className="md md--protect"
            role="dialog"
            aria-modal="true"
            aria-labelledby="md-protect-title"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
            transition={reduced ? TWEEN_COMPONENT : SPRING}
          >
            <span className="md-label"><Star className="md-label-star" aria-hidden={true} />Highly recommended</span>
            <div className="md-head">
              <ShieldCheck className="md-shield" aria-hidden={true} />
              <h2 className="md-title md-title--lg" id="md-protect-title">
                Congrats on locking in your vacation! Now add Hotel Booking Protection for your trip!
              </h2>
            </div>
            <p className="md-body">
              Hotel delays? Sudden illness? Getaway cancellations? No worries! Add Booking Protection and keep your trip stress-free for just <strong>{money(PRICES.protection)}</strong>.
            </p>

            <fieldset className="md-choices">
              <legend className="md-legend">Select Yes or No to continue booking</legend>

              <label className={`md-choice md-choice--yes${choice === "yes" ? " is-selected" : ""}`}>
                <span className="md-choice-row">
                  <input ref={firstRadio} type="radio" name="protection" value="yes" checked={choice === "yes"} onChange={() => setChoice("yes")} />
                  <span className="md-choice-text">Yes, I want Hotel Booking Protection for my vacation</span>
                  <span className="md-chip"><b>{money(PRICES.protection)}</b><small>{PRICE_UNIT}</small></span>
                </span>
                <span className="md-reasons">
                  <span className="md-reasons-title">3 reasons you might need Hotel Booking Protection:</span>
                  <span className="md-reason">
                    <ClockCountdown className="md-reason-icon" aria-hidden={true} />
                    <span><b>Travel Delay:</b> Unexpected delays can lead to missed hotel nights and extra costs.</span>
                  </span>
                  <span className="md-reason">
                    <ArrowsClockwise className="md-reason-icon" aria-hidden={true} />
                    <span><b>Trip Adjustments:</b> An unforeseen event and travel dates need to be adjusted.</span>
                  </span>
                  <span className="md-reason">
                    <ShieldWarning className="md-reason-icon" aria-hidden={true} />
                    <span><b>Trip Cancellations:</b> Illness, job loss, or family emergencies can lead to non-refundable trip costs. Read <a href="/terms-and-conditions" target="_blank" rel="noopener">Terms and Conditions</a>.</span>
                  </span>
                </span>
              </label>

              <label className={`md-choice md-choice--no${choice === "no" ? " is-selected" : ""}`}>
                <span className="md-choice-row">
                  <input type="radio" name="protection" value="no" checked={choice === "no"} onChange={() => setChoice("no")} />
                  <span className="md-choice-text">No, I&apos;m willing to risk my vacation valued at {RETAIL_VALUE}.</span>
                </span>
              </label>
            </fieldset>

            <button
              type="button"
              className="fbtn fbtn--primary"
              disabled={choice === null}
              onClick={() => onContinue(choice === "yes")}
            >
              Continue
            </button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
