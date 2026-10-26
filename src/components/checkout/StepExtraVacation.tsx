"use client";

import { motion } from "framer-motion";
import { CalendarCheck, Check, Mountains, Waves } from "@/lib/icons";
import { useBooking } from "@/lib/booking-store";
import { PRICES, money } from "@/lib/booking";
import { srcSetFor } from "@/lib/image-variants";
import {
  EXTRA_VACATION_ADDED,
  EXTRA_VACATION_DETAILS,
  EXTRA_VACATION_INCLUDED_LABEL,
  EXTRA_VACATION_LEAD,
  EXTRA_VACATION_LINE,
  EXTRA_VACATION_PERKS,
  EXTRA_VACATION_PHOTOS,
  EXTRA_VACATION_PRICE_NOTE,
  EXTRA_VACATION_TITLE,
} from "@/lib/offer";
import type { Season } from "@/lib/season";
import { FLOW } from "@/lib/site";
import { REVEAL_RISE, REVEAL_STAGGER, TWEEN_COMPONENT } from "@/lib/motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import UpsellStep from "./UpsellStep";

const PERK_ICONS = { Mountains, Waves, CalendarCheck } as const;

const LIST = { hidden: {}, show: { transition: REVEAL_STAGGER } };
const ITEM = { hidden: { opacity: 0, y: REVEAL_RISE }, show: { opacity: 1, y: 0, transition: TWEEN_COMPONENT } };
const ITEM_REDUCED = { hidden: { opacity: 0 }, show: { opacity: 1, transition: TWEEN_COMPONENT } };

/** Destination photo stage: indoor WaterPark hero with the price tag, two resort shots beside it. */
function PhotoStage({ season, price }: { season: Season; price: string }) {
  const { hero, side } = EXTRA_VACATION_PHOTOS;
  return (
    <div className="ev-stage">
      <figure className="ev-hero">
        <img src={hero.src} alt={hero.alt} width={hero.width} height={hero.height} decoding="async" />
        <span className="ev-eyebrow">{season.badge}</span>
        <span className="ev-price">
          <strong>{price}</strong>
          <span>{EXTRA_VACATION_PRICE_NOTE}</span>
        </span>
      </figure>
      {side.map((p) => (
        <img key={p.src} className="ev-side" src={p.src} srcSet={srcSetFor(p.src)} sizes="260px" alt={p.alt} width={p.width} height={p.height}
          loading="lazy" decoding="async" style={{ objectPosition: p.focus }} />
      ))}
    </div>
  );
}

/**
 * Step 5: Extra Vacation ($39). Seasonal photo stage, three destination
 * reasons, and the add/remove toggle. Product specifics stay on the
 * EXTRA_VACATION_DETAILS placeholder until the business confirms them.
 */
export default function StepExtraVacation({ season }: { season: Season }) {
  const { booking, setAddon } = useBooking();
  const reduced = useReducedMotion();
  const added = booking.addons.extraVacation;
  const price = money(PRICES.extraVacation);
  const item = reduced ? ITEM_REDUCED : ITEM;

  return (
    <UpsellStep
      title={EXTRA_VACATION_TITLE}
      yesLabel={added ? "Continue" : `Add for ${price}`}
      onYes={() => setAddon("extraVacation", true)}
      toggle={{
        added,
        addLabel: `Add for ${price}`,
        removeLabel: `Remove ${price}`,
        onToggle: (next) => setAddon("extraVacation", next),
      }}
      next={FLOW.confirmation}
      sure={{
        body: EXTRA_VACATION_LINE,
        question: "So, do you want to add the Extra Vacation?",
        confirmLabel: "Yes, add the Extra Vacation",
      }}
    >
      <PhotoStage season={season} price={price} />
      <p className="ev-lead">{EXTRA_VACATION_LEAD}</p>

      <motion.ul className="ev-perks" variants={LIST} initial="hidden" animate="show">
        {EXTRA_VACATION_PERKS.map(({ icon, title, text }) => {
          const Icon = PERK_ICONS[icon];
          return (
            <motion.li key={title} className="ev-perk" variants={item}>
              <span className="ev-perk-icon"><Icon aria-hidden={true} /></span>
              <h2 className="ev-perk-title">{title}</h2>
              <p className="ev-perk-text">{text}</p>
            </motion.li>
          );
        })}
      </motion.ul>

      <p className="ev-included"><strong>{EXTRA_VACATION_INCLUDED_LABEL}:</strong> {EXTRA_VACATION_DETAILS}</p>
      <p className="ev-urgency">{season.urgency}</p>

      <p className="ev-status" aria-live="polite">
        {added ? <><Check className="ic-inline" aria-hidden={true} />{EXTRA_VACATION_ADDED}</> : null}
      </p>
    </UpsellStep>
  );
}
