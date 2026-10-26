"use client";

import type { CSSProperties } from "react";
import { Anton, Montserrat } from "next/font/google";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { RESERVE_URL } from "@/lib/site";
import { HERO_BONUS_BANNER } from "@/lib/offer";
import { SPRING, TWEEN_COMPONENT } from "@/lib/motion";

const anton = Anton({ subsets: ["latin"], weight: "400", display: "swap", variable: "--hbb-display" });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["700", "800"], display: "swap", variable: "--hbb-body" });

const STATIC = { duration: 0 } as const;
const STAGGER = { staggerChildren: 0.08, delayChildren: 0.2 } as const;

const rise = {
  hidden: { opacity: 0, y: 16 },
  shown: { opacity: 1, y: 0 },
};

/**
 * Hero bonus banner: an inset white "Includes" panel with a ski-pass visual,
 * tucked behind a rounded photo block carrying the condensed headline and the
 * HOTEL tag. The whole banner is one link to checkout.
 */
export default function HeroBonusBanner({ image }: { image: string }) {
  const reduced = useReducedMotion();
  const t = reduced ? STATIC : TWEEN_COMPONENT;
  const { lead, sub, cardPrefix, cardAmount, cardLabel, bigWord, bigWordSub, bigText, pill } = HERO_BONUS_BANNER;

  return (
    <motion.a
      className={`hbb ${anton.variable} ${montserrat.variable}`}
      href={RESERVE_URL}
      aria-label={`${lead} ${sub}. ${bigWord} ${bigWordSub} ${bigText} ${pill}. Reserve now`}
      initial="hidden"
      animate="shown"
      transition={reduced ? STATIC : STAGGER}
      whileHover={reduced ? undefined : { y: -2 }}
      whileTap={reduced ? undefined : { scale: 0.98 }}
    >
      <motion.span className="hbb-panel" variants={rise} transition={t}>
        <motion.span
          className="hbb-card"
          aria-hidden="true"
          initial={reduced ? false : { rotate: -14, opacity: 0 }}
          animate={{ rotate: -6, opacity: 1 }}
          transition={reduced ? STATIC : { ...SPRING, delay: 0.35 }}
        >
          <span className="hbb-card-amt">
            <span className="hbb-card-cur">{cardPrefix}</span>
            {cardAmount}
          </span>
          <span className="hbb-card-label">{cardLabel}</span>
          <span className="hbb-card-chip" />
        </motion.span>
        <span className="hbb-copy" aria-hidden="true">
          <span className="hbb-lead">{lead}</span>
          <span className="hbb-sub">{sub}</span>
        </span>
      </motion.span>

      <motion.span
        className="hbb-block"
        style={{ "--hbb-image": `url("${image}")` } as CSSProperties}
        variants={rise}
        transition={t}
        aria-hidden="true"
      >
        <span className="hbb-word-stack">
          <span className="hbb-word">{bigWord}</span>
          <span className="hbb-word-sub">{bigWordSub}</span>
        </span>
        <span className="hbb-right">
          <span className="hbb-text">{bigText}</span>
          <span className="hbb-tag">{pill}</span>
        </span>
      </motion.span>
    </motion.a>
  );
}
