"use client";

import { useEffect } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { PRICE_TICK } from "@/lib/motion";
import { PRICE_NUMBER } from "@/lib/offer";

/**
 * "$104" whose digits roll up from 0 on load. Screen readers get the static
 * price; the animated digits are hidden from them. A placeholder holds the
 * final width, so nothing shifts while the digits change. Size and colour
 * come from the caller's class; `.pb-dollar` / `.pb-digits` are the parts.
 */
export default function PriceNumeral({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  const count = useMotionValue(PRICE_NUMBER);
  const shown = useTransform(count, (v) => Math.round(v));

  useEffect(() => {
    // `reduced` is false on the hydration commit, so also read the media query
    // directly; never leave the count anywhere but the final price when static.
    if (reduced || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      count.set(PRICE_NUMBER);
      return;
    }
    count.set(0);
    const tick = animate(count, PRICE_NUMBER, PRICE_TICK);
    return () => tick.stop();
  }, [count, reduced]);

  return (
    <span className={className}>
      <span className="vv-visually-hidden">${PRICE_NUMBER}</span>
      <span className="pb-numeral" aria-hidden="true">
        <span className="pb-dollar">$</span>
        <span className="pb-digits">
          <span className="pb-digits-hold">{PRICE_NUMBER}</span>
          <motion.span className="pb-digits-live">{shown}</motion.span>
        </span>
      </span>
    </span>
  );
}
