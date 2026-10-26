"use client";

import { Fragment, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { RESERVE_URL } from "@/lib/site";
import { ARROW_NUDGE, SPRING, TOPBAR_STAGGER, TWEEN_COMPONENT } from "@/lib/motion";
import type { Season } from "@/lib/season";
import SeasonCountdown from "./SeasonCountdown";
import SeasonFx from "./SeasonFx";
import SeasonalTopBarMark from "./SeasonalTopBarMark";

/** Scroll depth after which the bar collapses and the sticky offer bar takes over. */
const STICKY_LIMIT = 600;

type Nudge = "rest" | "hover" | "tap";

const INSTANT = { duration: 0 } as const;

const LOCKUP = {
  hidden: {},
  show: { transition: TOPBAR_STAGGER },
};

const PIECE = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: TWEEN_COMPONENT },
};

/** Reduced motion: same initial state as SSR (no hydration mismatch), zero-length transitions. */
const LOCKUP_REDUCED = { hidden: {}, show: { transition: { staggerChildren: 0, delayChildren: 0 } } };
const PIECE_REDUCED = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: INSTANT },
};

/**
 * Component A — seasonal top bar. Sits under the logo header, sticky for the
 * first 600px of scroll, then slides away (transform only, so the page does
 * not reflow). The whole bar is one link to checkout.
 */
export default function SeasonalTopBar({ season }: { season: Season }) {
  const reduced = useReducedMotion();
  const [collapsed, setCollapsed] = useState(false);
  const [nudge, setNudge] = useState<Nudge>("rest");
  const arrowX = reduced || nudge === "rest" ? 0 : ARROW_NUDGE[nudge];
  const lockup = reduced ? LOCKUP_REDUCED : LOCKUP;
  const piece = reduced ? PIECE_REDUCED : PIECE;

  useEffect(() => {
    const onScroll = () => setCollapsed(window.scrollY > STICKY_LIMIT);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.a
      className={`stb stb--${season.animation}`}
      href={RESERVE_URL}
      data-season={season.key}
      inert={collapsed}
      initial={false}
      animate={{ y: collapsed ? "-100%" : "0%", opacity: collapsed ? 0 : 1 }}
      transition={reduced ? { duration: 0 } : TWEEN_COMPONENT}
      onHoverStart={() => setNudge("hover")}
      onHoverEnd={() => setNudge("rest")}
      onFocus={() => setNudge("hover")}
      onBlur={() => setNudge("rest")}
      onTapStart={() => setNudge("tap")}
      onTap={() => setNudge("hover")}
      onTapCancel={() => setNudge("rest")}
    >
      <SeasonFx effect={season.animation} />
      <motion.span
        className="stb-inner"
        variants={lockup}
        initial="hidden"
        animate="show"
      >
        <motion.span className="stb-mark-wrap" variants={piece}>
          <SeasonalTopBarMark season={season.key} />
        </motion.span>
        <motion.span className="stb-divider" variants={piece} aria-hidden="true" />
        <motion.span className="stb-message" variants={piece}>
          <span className="stb-copy stb-copy--desktop">{withDots(season.topBarDesktop)}</span>
          <span className="stb-copy stb-copy--mobile">{withDots(season.topBarMobile)}</span>
        </motion.span>
        <motion.span className="stb-pill-wrap" variants={piece} aria-hidden="true">
          <motion.span className="stb-pill" animate={{ x: arrowX }} transition={reduced ? { duration: 0 } : SPRING}>
            <svg viewBox="0 0 24 24" className="stb-arrow" focusable="false">
              <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.span>
        </motion.span>
        <motion.span className="stb-chip-wrap" variants={piece}>
          <SeasonCountdown mode={season.countdown} />
        </motion.span>
        <span className="stb-sr">, reserve your getaway</span>
      </motion.span>
    </motion.a>
  );
}

/** Tints the "•" separators with the season accent. */
function withDots(copy: string) {
  return copy.split(" • ").map((part, i) => (
    <Fragment key={i}>
      {i > 0 && <span className="stb-dot" aria-hidden="true"> • </span>}
      {part}
    </Fragment>
  ));
}
