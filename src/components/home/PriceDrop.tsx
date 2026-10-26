"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { PRICE_DROP, PRICE_DROP_FROM, PRICE_LABELS, TWEEN_COMPONENT } from "@/lib/motion";
import { PRICE_UNIT, RETAIL_VALUE } from "@/lib/offer";
import PriceNumeral from "./PriceNumeral";

const STATIC = { duration: 0 } as const;

const labels = {
  hidden: { opacity: 0, y: 8 },
  shown: { opacity: 1, y: 0 },
};

/**
 * Hero price circle content. On load the number drops in from above with an
 * overshoot while its digits roll up to the price (PriceNumeral), and the two
 * labels fade in after it lands.
 */
export default function PriceDrop() {
  const reduced = useReducedMotion();
  const labelTransition = reduced ? STATIC : TWEEN_COMPONENT;

  return (
    <motion.div
      className="pb-circle"
      initial="hidden"
      animate="shown"
      transition={reduced ? STATIC : PRICE_LABELS}
    >
      <motion.div className="pb-price-old" variants={labels} transition={labelTransition}>
        {RETAIL_VALUE} VALUE
      </motion.div>
      <motion.div
        className="pb-price-new"
        initial={{ opacity: 0, y: PRICE_DROP_FROM }}
        animate={{ opacity: 1, y: 0 }}
        transition={reduced ? STATIC : PRICE_DROP}
      >
        <PriceNumeral />
      </motion.div>
      <motion.div className="pb-footer-text" variants={labels} transition={labelTransition}>
        {PRICE_UNIT}
      </motion.div>
    </motion.div>
  );
}
