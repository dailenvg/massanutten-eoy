"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, type MotionValue, type Variants } from "framer-motion";
import { Mountains, Snowflake, Ticket } from "@/lib/icons";
import { RESERVE_URL } from "@/lib/site";
import { BONUS_CARDS, BONUS_CONNECTOR, BONUS_HEADING, BONUS_SUBHEADING } from "@/lib/offer";
import { CARD_SHINE, PRESS, REVEAL_RISE, REVEAL_STAGGER, REVEAL_VIEWPORT, SPRING, STAMP_IN } from "@/lib/motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import PhoneTrigger from "./PhoneTrigger";

/** Panel backdrops: a skier in fresh powder and a sunset run (the source's bonus backdrop). */
const LEFT_PHOTO = "/images/massanutten/skier-powder.webp";
const RIGHT_PHOTO = "/images/massanutten/skier-sunset.webp";

/** Percent each panel photo drifts while the block crosses the viewport. */
const TRAVEL = 8;

const FADE: Variants = { hidden: { opacity: 0 }, shown: { opacity: 1 } };
const GLASS: Variants = {
  hidden: { opacity: 0, y: REVEAL_RISE * 2 },
  shown: { opacity: 1, y: 0, transition: { ...SPRING, ...REVEAL_STAGGER } },
};
const RISE: Variants = { hidden: { opacity: 0, y: REVEAL_RISE }, shown: { opacity: 1, y: 0, transition: SPRING } };
/** Offer art lands at its resting tilt (rotation lives in CSS on the wrapper). */
const ART: Variants = {
  hidden: { opacity: 0, scale: 0.8, rotate: -10 },
  shown: { opacity: 1, scale: 1, rotate: 0, transition: STAMP_IN },
};
const PLUS: Variants = { hidden: { opacity: 0, scale: 0.4 }, shown: { opacity: 1, scale: 1, transition: STAMP_IN } };

type PanelProps = {
  side: "left" | "right";
  photo: string;
  y: MotionValue<string> | undefined;
  card: PassCard;
  art: ReactNode;
  reduced: boolean;
};

/** Slow light sweep across a coded card. Skipped under reduced motion. */
function CardShine({ reduced }: { reduced: boolean }) {
  if (reduced) return null;
  return (
    <motion.span
      className="gc-shine"
      aria-hidden="true"
      initial={{ x: "-120%" }}
      animate={{ x: "220%" }}
      transition={CARD_SHINE}
    />
  );
}

type PassCard = (typeof BONUS_CARDS)[number];

/** Code-built ski pass: ribbon, snowflake chip, "Day 1"/"Day 2" and its key line, slow shine. */
function PassArt({ card, twin, reduced }: { card: PassCard; twin: boolean; reduced: boolean }) {
  const NoteIcon = twin ? Mountains : Ticket;
  return (
    <div className={`bch-card-img bch-gift-card${twin ? " bch-night-card" : ""}`} role="img" aria-label={`${card.label} for day ${card.day} of ${BONUS_CARDS.length}, included with your stay`}>
      <span className="gc-ribbon gc-ribbon--v" aria-hidden="true"></span>
      <span className="gc-ribbon gc-ribbon--h" aria-hidden="true"></span>
      <span className="gc-bow" aria-hidden="true"><Snowflake /></span>
      <span className="gc-top" aria-hidden="true">
        <span className="gc-label">{card.label}</span>
        <span className="gc-chip"></span>
      </span>
      <span className="gc-amount" aria-hidden="true"><span className="gc-unit gc-unit--lead">{card.unit}</span>{card.day}</span>
      <span className="gc-or" aria-hidden="true"><NoteIcon />{card.note}</span>
      <CardShine reduced={reduced} />
    </div>
  );
}

/** One half of the split: parallax photo, glass card, headline, offer art. */
function BonusPanel({ side, photo, y, card, art, reduced }: PanelProps) {
  return (
    <div className={`bch-panel bch-${side}`}>
      <motion.img className="bch-bg" src={photo} alt="" width="1024" height="768" loading="lazy" decoding="async" style={{ y }} />
      <motion.div className="bch-glass" variants={reduced ? FADE : GLASS}>
        <motion.h4 className="bch-headline" variants={reduced ? FADE : RISE}>
          <span className="bch-headline-line">{card.headingLead}</span>{" "}
          <span className="bch-headline-line">{card.headingRest}</span>
        </motion.h4>
        <motion.div className="bch-art" variants={reduced ? FADE : ART}>{art}</motion.div>
      </motion.div>
    </div>
  );
}

/**
 * Component K — bonus split CTA. Section heading, then two panels, each on its
 * own photo with a light glass card (headline, offer art), joined by "+" on the
 * seam, over a full-width bar with Reserve and the phone trigger. Stacks
 * below 900px.
 *
 * The two panels are the 2 Ski Day Passes, one pass each, code-built in the
 * same card footprint (ribbon, icon chip, big type, slow shine). The second
 * pass takes the seasonal twin palette, so the pair match in shape, not color.
 */
export default function BonusCta() {
  const [cardOne, cardTwo] = BONUS_CARDS;
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const drift = useTransform(scrollYProgress, [0, 1], [`-${TRAVEL}%`, `${TRAVEL}%`]);
  const y = reduced ? undefined : drift;

  return (
    <motion.section
      id="bonus-cta"
      ref={ref}
      initial="hidden"
      whileInView="shown"
      viewport={REVEAL_VIEWPORT}
      variants={{ hidden: {}, shown: { transition: REVEAL_STAGGER } }}
      aria-labelledby="bch-heading"
    >
      <motion.header className="bch-header" variants={reduced ? FADE : RISE}>
        <h2 className="bch-title" id="bch-heading">{BONUS_HEADING}</h2>
        <h3 className="bch-subtitle">{BONUS_SUBHEADING}</h3>
      </motion.header>

      <BonusPanel
        side="left"
        photo={LEFT_PHOTO}
        y={y}
        card={cardOne}
        reduced={reduced}
        art={<PassArt card={cardOne} twin={false} reduced={reduced} />}
      />

      <div className="bch-divider">
        <span className="bch-vline"></span>
        <motion.span className="bch-plus" variants={reduced ? FADE : PLUS}>{BONUS_CONNECTOR}</motion.span>
        <span className="bch-vline"></span>
      </div>

      <BonusPanel
        side="right"
        photo={RIGHT_PHOTO}
        y={y}
        card={cardTwo}
        reduced={reduced}
        art={<PassArt card={cardTwo} twin reduced={reduced} />}
      />

      <div className="bch-cta-bar">
        <div className="bch-cta-actions">
          <motion.a
            href={RESERVE_URL}
            className="bch-cta"
            whileHover={reduced ? undefined : { scale: PRESS.hover }}
            whileTap={reduced ? undefined : { scale: PRESS.tap }}
          >
            RESERVE ONLINE
          </motion.a>
          <PhoneTrigger variant="bonus" />
        </div>
      </div>
    </motion.section>
  );
}
