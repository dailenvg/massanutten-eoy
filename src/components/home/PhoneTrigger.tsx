"use client";

import { motion } from "framer-motion";
import { Phone } from "@/lib/icons";
import { CALL_MICROCOPY } from "@/lib/offer";
import { PRESS } from "@/lib/motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { useModals } from "./ModalContext";

/**
 * `card`  offer card, under Reserve (full phrase)
 * `bonus` bonus CTA bar, beside Reserve (full phrase)
 * `nav`   sticky submenu pill (short label on tight rows)
 * `sticky` mobile sticky bar (short label)
 */
type Variant = "card" | "bonus" | "nav" | "sticky";

/** Visible on the narrow placements. The accessible name stays the full phrase, which contains it. */
const SHORT_LABEL = "Book by phone";

const SHORT: ReadonlySet<Variant> = new Set(["nav", "sticky"]);

/**
 * "Prefer to talk? Book by phone." Opens the PhoneModal, which holds the
 * number and hours. `data-call-cta` stays for analytics continuity.
 */
export default function PhoneTrigger({ variant }: { variant: Variant }) {
  const { phoneRef } = useModals();
  const reduced = useReducedMotion();
  const short = SHORT.has(variant);

  return (
    <motion.button
      type="button"
      className={`phone-trigger phone-trigger--${variant}`}
      data-call-cta
      aria-haspopup="dialog"
      aria-label={short ? CALL_MICROCOPY : undefined}
      onClick={(e) => phoneRef.current?.open(e.currentTarget)}
      whileHover={reduced ? undefined : { scale: PRESS.hover }}
      whileTap={reduced ? undefined : { scale: PRESS.tap }}
    >
      <Phone className="phone-trigger-icon" aria-hidden="true" />
      <span className="phone-trigger-label">{short ? SHORT_LABEL : CALL_MICROCOPY}</span>
    </motion.button>
  );
}
