"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { CalendarDots, Clock, Headset, Phone, X } from "@/lib/icons";
import { lockBody, unlockBody } from "@/lib/scroll-lock";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { MODAL_RISE, MODAL_STAGGER, PRESS, RING_PULSE, SPRING, TWEEN_COMPONENT } from "@/lib/motion";
import { CALL_MICROCOPY, PHONE_CONFIRMED, PHONE_DISPLAY, PHONE_HOURS_ROWS, PHONE_HOURS_ZONE, PHONE_HREF } from "@/lib/offer";
import type { SeasonKey } from "@/lib/season";
import { useModals } from "./ModalContext";
import ModalSeasonFx from "./season-fx/ModalSeasonFx";

const TITLE_ID = "pm-title";
const HOURS_ID = "pm-hours";
const FOCUSABLE = "a[href], button:not([disabled])";

const FADE: Variants = { hidden: { opacity: 0 }, shown: { opacity: 1 } };

const panelVariants = (reduced: boolean): Variants =>
  reduced
    ? FADE
    : {
        hidden: { opacity: 0, y: MODAL_RISE, scale: 0.96 },
        shown: { opacity: 1, y: 0, scale: 1, transition: { ...SPRING, ...MODAL_STAGGER } },
      };

const itemVariants = (reduced: boolean): Variants =>
  reduced
    ? FADE
    : {
        hidden: { opacity: 0, y: MODAL_RISE / 2 },
        shown: { opacity: 1, y: 0, transition: SPRING },
      };

/**
 * "Prefer to talk? Book by phone." dialog, opened by every PhoneTrigger
 * through ModalContext. Tap-to-call number plus the call center hours, under
 * a header carrying the active season's accent and particles.
 *
 * Dialog behaviour: focus moves to the close button and is trapped inside;
 * Esc, the close button and the backdrop all close it; focus returns to the
 * trigger; the page behind is scroll-locked.
 */
export default function PhoneModal({ season }: { season: SeasonKey }) {
  const { phoneRef } = useModals();
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);
  const scrollY = useRef(0);

  const openModal = useCallback((trigger?: HTMLElement | null) => {
    lastFocused.current = trigger || (document.activeElement as HTMLElement | null);
    scrollY.current = window.scrollY;
    lockBody(scrollY.current);
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    unlockBody(scrollY.current);
    lastFocused.current?.focus();
  }, []);

  useEffect(() => {
    phoneRef.current = { open: openModal };
    return () => {
      phoneRef.current = null;
    };
  }, [phoneRef, openModal]);

  useEffect(() => {
    if (!open) return;
    closeBtnRef.current?.focus();
    // Document-level so the trap still holds if focus lands on <body>
    // (e.g. after a click on non-focusable panel content).
    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const items = panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      const inside = active instanceof Node && panelRef.current.contains(active);
      if (!inside) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  const item = itemVariants(reduced);
  const press = reduced ? {} : { whileHover: { scale: PRESS.hover }, whileTap: { scale: PRESS.tap } };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="phone-modal"
          className="pm"
          data-season={season}
          initial="hidden"
          animate="shown"
          exit="hidden"
          variants={FADE}
          transition={TWEEN_COMPONENT}
        >
          <motion.div className="pm-backdrop" aria-hidden="true" onClick={close} variants={FADE} />

          <motion.div
            ref={panelRef}
            className="pm-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby={TITLE_ID}
            aria-describedby={HOURS_ID}
            variants={panelVariants(reduced)}
          >
            <div className="pm-head">
              <ModalSeasonFx season={season} still={reduced} />

              <button ref={closeBtnRef} type="button" className="pm-close" aria-label="Close" onClick={close}>
                <X aria-hidden="true" />
              </button>

              <motion.span className="pm-mark" aria-hidden="true" variants={item}>
                {!reduced && (
                  <motion.span
                    className="pm-mark-ring"
                    initial={{ scale: 1, opacity: 0.6 }}
                    animate={{ scale: 1.6, opacity: 0 }}
                    transition={RING_PULSE}
                  />
                )}
                <Headset className="pm-mark-icon" />
              </motion.span>

              <motion.h2 id={TITLE_ID} className="pm-title" variants={item}>
                {CALL_MICROCOPY}
              </motion.h2>
            </div>

            <div className="pm-body">
              {PHONE_CONFIRMED ? (
                <motion.a className="pm-call" href={PHONE_HREF} data-call-cta variants={item} {...press}>
                  <Phone className="pm-call-icon" aria-hidden="true" />
                  <span className="pm-call-text">
                    <span className="pm-call-label">Call us</span>
                    <span className="pm-call-num">{PHONE_DISPLAY}</span>
                  </span>
                </motion.a>
              ) : (
                /* Placeholder number: plain text, styled as info rather than a button, until PHONE_HREF is real. */
                <motion.p className="pm-call pm-call--pending" variants={item}>
                  <Phone className="pm-call-icon" aria-hidden="true" />
                  <span className="pm-call-text">
                    <span className="pm-call-label">Call us</span>
                    <span className="pm-call-num">{PHONE_DISPLAY}</span>
                  </span>
                </motion.p>
              )}

              <motion.ul id={HOURS_ID} className="pm-hours" aria-label="Call center hours" variants={item}>
                {PHONE_HOURS_ROWS.map(({ days, time }) => (
                  <li className="pm-hours-row" key={days}>
                    <CalendarDots className="pm-hours-icon" aria-hidden="true" />
                    <span className="pm-hours-days">{days}</span>
                    <span className="pm-hours-time">{time}</span>
                  </li>
                ))}
                <li className="pm-hours-row pm-hours-row--zone">
                  <Clock className="pm-hours-icon" aria-hidden="true" />
                  <span className="pm-hours-days">{PHONE_HOURS_ZONE}</span>
                </li>
              </motion.ul>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
