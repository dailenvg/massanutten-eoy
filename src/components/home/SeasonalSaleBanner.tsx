"use client";

import { motion, type Variants } from "framer-motion";
import { ICONS_BY_NAME, Check } from "@/lib/icons";
import type { Season } from "@/lib/season";
import { RESERVE_URL } from "@/lib/site";
import { NIGHTS_LABEL, PRICE, PRICE_UNIT } from "@/lib/offer";
import { PRESS, REVEAL_RISE, REVEAL_STAGGER, REVEAL_VIEWPORT, SPRING, STAMP_IN } from "@/lib/motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { srcSetFor } from "@/lib/image-variants";

const HEADING_ID = "ss-heading";
/** The photo covers a tall stage below 1280px, so it renders wider than the viewport there. */
const BG_SIZES = "(max-width: 767px) 1400px, (max-width: 1279px) 150vw, 100vw";

const FADE: Variants = { hidden: { opacity: 0 }, shown: { opacity: 1 } };
const STAGGER: Variants = { hidden: {}, shown: { transition: REVEAL_STAGGER } };
const RISE: Variants = {
  hidden: { opacity: 0, y: REVEAL_RISE },
  shown: { opacity: 1, y: 0, transition: { ...SPRING, ...REVEAL_STAGGER } },
};
const STAMP: Variants = {
  hidden: { opacity: 0, scale: 0.6, rotate: -18 },
  shown: { opacity: 1, scale: 1, rotate: -8, transition: STAMP_IN },
};
/** Reduced motion: the stamp keeps its resting tilt and only fades. */
const STAMP_STILL: Variants = { hidden: { opacity: 0, rotate: -8 }, shown: { opacity: 1, rotate: -8 } };

/**
 * Component F — seasonal sale banner, directly under What You Get. A
 * full-bleed destination photo with an offer stamp overlapping a glass panel:
 * "<Season>: <hook>." heading, the season's Massanutten story, three chips and a
 * Reserve CTA. Copy and photo come from `season.banner`; colours from the
 * [data-season] palette.
 */
export default function SeasonalSaleBanner({ season }: { season: Season }) {
  const { banner } = season;
  const reduced = useReducedMotion();
  const rise = reduced ? FADE : RISE;

  return (
    <section className="ss-section" data-season={season.key} aria-labelledby={HEADING_ID}>
      <div className="ss-stage">
        <img className="ss-bg" src={banner.image} srcSet={srcSetFor(banner.image)} sizes={BG_SIZES} alt="" width="1024" height="683" loading="lazy" decoding="async" />

        <motion.div className="ss-stack" initial="hidden" whileInView="shown" viewport={REVEAL_VIEWPORT} variants={STAGGER}>
          <motion.div className="ss-stamp" variants={reduced ? STAMP_STILL : STAMP}>
            <span className="ss-stamp-top">{NIGHTS_LABEL}</span>
            <span className="ss-stamp-price">{PRICE}</span>
            <span className="ss-stamp-unit">{PRICE_UNIT}</span>
          </motion.div>

          <motion.div className="ss-panel" variants={rise}>
            <motion.h2 id={HEADING_ID} className="ss-heading" variants={rise}>
              <span className="ss-heading-name">{banner.name}:</span> {banner.hook}
            </motion.h2>
            <motion.p className="ss-para" variants={rise}>{banner.paragraph}</motion.p>
            <motion.ul className="ss-chips" variants={STAGGER}>
              {banner.chips.map(({ icon, text }) => {
                const Icon = ICONS_BY_NAME[icon] ?? Check;
                return (
                  <motion.li className="ss-chip" key={text} variants={rise}>
                    <Icon className="ss-chip-icon" aria-hidden="true" />
                    {text}
                  </motion.li>
                );
              })}
            </motion.ul>
          </motion.div>

          <motion.div className="ss-cta-row" variants={rise}>
            <motion.a
              className="ss-cta"
              href={RESERVE_URL}
              whileHover={reduced ? undefined : { scale: PRESS.hover }}
              whileTap={reduced ? undefined : { scale: PRESS.tap }}
            >
              {banner.cta}
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
