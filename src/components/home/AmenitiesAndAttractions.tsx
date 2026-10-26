"use client";

import { Check, ICONS_BY_NAME } from "@/lib/icons";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import type { Variants } from "framer-motion";
import { RESERVE_URL } from "@/lib/site";
import { showsHolidayEvents, type Season } from "@/lib/season";
import { TWEEN_COMPONENT } from "@/lib/motion";
import {
  EXPLORE_ATTRACTIONS_HOLIDAY,
  EXPLORE_ATTRACTIONS_LATE,
  EXPLORE_ATTRACTIONS_TITLE,
  EXPLORE_AMENITIES,
  EXPLORE_AMENITIES_TITLE,
} from "@/lib/offer";

const ICON_STYLE = { width: "20px", height: "20px" } as const;

type Item = { readonly icon: string; readonly text: string };

const group: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const card: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { ...TWEEN_COMPONENT, staggerChildren: 0.03, delayChildren: 0.1 },
  },
};

const row: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: TWEEN_COMPONENT },
};

const fade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: TWEEN_COMPONENT },
};

/**
 * One panel of the section. `columns` is the only difference between the two:
 * the amenities list is long and its labels are short, so it runs two-up,
 * while the attraction names are long enough to want a full line each. That
 * lands both lists on a similar number of rows, which is what keeps the two
 * cards the same height without either one padding out with dead space.
 */
function Panel({
  title,
  items,
  columns,
  variants,
}: {
  title: string;
  items: readonly Item[];
  columns: "one" | "two";
  variants: { card: Variants; row: Variants };
}) {
  return (
    <motion.article className="mte-card" variants={variants.card}>
      <div className="mte-card-head">
        <h3 className="mte-card-title">{title}</h3>
      </div>

      <ul className={`mte-list mte-list--${columns}`}>
        {items.map((item) => {
          const Icon = ICONS_BY_NAME[item.icon] ?? Check;
          return (
            <motion.li className="mte-item" key={item.text} variants={variants.row}>
              <span className="mte-item-chip" aria-hidden="true">
                <Icon aria-hidden={true} style={ICON_STYLE} />
              </span>
              <span className="mte-item-text">{item.text}</span>
            </motion.li>
          );
        })}
      </ul>
    </motion.article>
  );
}

/**
 * Component I — More to Explore.
 * The attractions column swaps on Jan 4 when the holiday events drop off.
 */
export default function AmenitiesAndAttractions({ season }: { season: Season }) {
  const reduced = useReducedMotion();
  const amenities = EXPLORE_AMENITIES;
  const attractions = showsHolidayEvents(season)
    ? EXPLORE_ATTRACTIONS_HOLIDAY
    : EXPLORE_ATTRACTIONS_LATE;

  const variants = reduced
    ? { group: fade, card: fade, row: fade }
    : { group, card, row };

  return (
    <section id="amenitiesAndAttractions" className="amenitiesandattractions">
      <div className="amndiv">
        <h2 className="whatyougettitle">More to Explore</h2>

        <motion.div
          className="mte-grid"
          variants={variants.group}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-10%" }}
        >
          <Panel
            title={EXPLORE_AMENITIES_TITLE}
            items={amenities}
            columns="two"
            variants={variants}
          />
          <Panel
            title={EXPLORE_ATTRACTIONS_TITLE}
            items={attractions}
            columns="one"
            variants={variants}
          />
        </motion.div>

        <div className="div-block-21">
          <a data-wf--button--variant="big" href={RESERVE_URL} className="checkout-cta w-variant-bb32e703-515b-0273-c76d-ea9f00368c6a w-button">Reserve now</a>
        </div>
      </div>
    </section>
  );
}
