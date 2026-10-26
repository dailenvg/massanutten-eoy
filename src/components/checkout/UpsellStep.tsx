"use client";

import { useEffect, useState } from "react";
import { useFlowRouter } from "@/lib/use-flow-router";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { useBooking } from "@/lib/booking-store";
import { FLOW } from "@/lib/site";
import { TWEEN_COMPONENT } from "@/lib/motion";
import AreYouSureModal from "./AreYouSureModal";

/**
 * Frame shared by the three upsell steps: title, body, a stepper, and the
 * "Are you sure?" interception when Skip is pressed. Also guards the route —
 * an upsell before payment sends the guest back to step 1.
 *
 * The stepper has two shapes. Without `toggle` it is the original Skip / Yes
 * pair, where the primary both takes the offer and moves on. With `toggle` it
 * splits those two jobs: Skip sits on the left, and on the right an add/remove
 * button that stays on the page next to a Continue that only moves forward.
 * That lets a guest add the offer, see it land in the summary, and change
 * their mind before committing — which one combined button cannot express.
 */
export default function UpsellStep({
  title,
  children,
  yesLabel,
  onYes,
  next,
  sure,
  yesDisabled = false,
  continueLabel,
  toggle,
}: {
  title: string;
  children: ReactNode;
  yesLabel: string;
  onYes: () => void;
  next: string;
  sure: { body: string; question: string; confirmLabel: string };
  /** Tickets step: the primary is "Continue", enabled only once something is added. */
  yesDisabled?: boolean;
  continueLabel?: string;
  /** Split stepper: an add/remove button that stays put, plus Continue. */
  toggle?: {
    added: boolean;
    addLabel: string;
    removeLabel: string;
    onToggle: (next: boolean) => void;
  };
}) {
  const router = useFlowRouter();
  const reduced = useReducedMotion();
  const { booking, ready } = useBooking();
  const [askSure, setAskSure] = useState(false);

  useEffect(() => { if (ready && !booking.paid) router.replace(FLOW.general); }, [ready, booking.paid, router]);

  const v = reduced ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: TWEEN_COMPONENT } } : { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: TWEEN_COMPONENT } };

  return (
    <>
      <motion.section className="fcard up" variants={v} initial="hidden" animate="show" aria-labelledby="up-title">
        <div className="up-body">
          <h1 className="up-title" id="up-title">{title}</h1>
          {children}
        </div>
        <div className="up-stepper">
          <button type="button" className="fbtn fbtn--ghost up-stepper-skip" onClick={() => setAskSure(true)}>Skip</button>
          {toggle ? (
            <div className="up-stepper-end">
              <button
                type="button"
                className={`fbtn ${toggle.added ? "fbtn--dark" : "fbtn--primary"}`}
                aria-pressed={toggle.added}
                onClick={() => toggle.onToggle(!toggle.added)}
              >
                {toggle.added ? toggle.removeLabel : toggle.addLabel}
              </button>
              {/*
                Forward only, and only once the offer is taken. Declining is
                Skip's job, which is what raises the "Are you sure?" — an
                always-live Continue would route around that interception.
              */}
              <button
                type="button"
                className="fbtn fbtn--primary"
                disabled={!toggle.added}
                onClick={() => router.push(next)}
              >
                Continue
              </button>
            </div>
          ) : continueLabel ? (
            <button type="button" className="fbtn fbtn--primary" disabled={yesDisabled} onClick={() => router.push(next)}>{continueLabel}</button>
          ) : (
            <button type="button" className="fbtn fbtn--primary" onClick={() => { onYes(); router.push(next); }}>{yesLabel}</button>
          )}
        </div>
      </motion.section>

      <AreYouSureModal
        open={askSure}
        body={sure.body}
        question={sure.question}
        confirmLabel={sure.confirmLabel}
        onSkip={() => { setAskSure(false); router.push(next); }}
        onConfirm={() => { setAskSure(false); onYes(); router.push(next); }}
      />
    </>
  );
}
