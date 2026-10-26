import type { ComponentType } from "react";
import {
  BedDouble, CheckCircle, Check, Star, Gift, MapPin, ICONS_BY_NAME,
  type IconProps,
} from "@/lib/icons";
import { showsHolidayEvents, type Season } from "@/lib/season";
import { srcSetFor } from "@/lib/image-variants";
import {
  PACKAGE_NAME,
  PRICE_NUMBER,
  RESORT_AMENITIES,
  RESORT_UPPER,
  RETAIL_VALUE,
  ROOM_FEATURES,
  ROOM_TYPE,
  NEARBY_ATTRACTIONS,
  TAB_ACCOM_INTRO,
  TAB_AMENITIES_INTRO,
  TAB_BONUS_INTRO,
  TAB_BONUS_ITEMS,
  TAB_CARD_BULLETS,
  TAB_TODO_INTRO,
  THIS_WINTER_HOLIDAY,
  THIS_WINTER_LATE,
} from "@/lib/offer";

/**
 * The four "What's Included" tabs and their bodies.
 *
 * Lives apart from <EverythingIncluded> because the same panel markup is used
 * twice: inline under the desktop tab bar, and inside the phone bottom sheet.
 */

export const TAB_KEYS = ["accom", "amenities", "bonus", "todo"] as const;
export type TabKey = (typeof TAB_KEYS)[number];

export type IconComponent = ComponentType<IconProps>;

/** Tab order, labels and glyphs — the tab bar, the phone cards and the sheet all read from this. */
export const TABS: readonly { key: TabKey; label: string; Icon: IconComponent }[] = [
  { key: "accom", label: "Accommodations", Icon: BedDouble },
  { key: "amenities", label: "Amenities", Icon: Star },
  { key: "bonus", label: "Bonus", Icon: Gift },
  { key: "todo", label: "Things To Do", Icon: MapPin },
];

export const isTabKey = (id: string): id is TabKey => (TAB_KEYS as readonly string[]).includes(id);

/** DOM ids shared by the tab button, its panel and the panel heading. */
export const tabId = (key: TabKey) => `rd-tab-${key}`;
export const panelId = (key: TabKey) => `rd-${key}`;
export const panelTitleId = (key: TabKey) => `rd-title-${key}`;

const ORANGE = { color: "var(--accent-strong)" } as const;

function IconList({ items, className }: { items: readonly { icon: string; text: string }[]; className: string }) {
  return (
    <ul className={className}>
      {items.map(({ icon, text }) => {
        const Icon = ICONS_BY_NAME[icon] ?? Check;
        return <li key={text}><Icon style={ORANGE} aria-hidden={true} />{text}</li>;
      })}
    </ul>
  );
}

function CheckList({ items }: { items: readonly string[] }) {
  return (
    <ul className="rd-feature-list">
      {items.map((item) => (
        <li key={item}><CheckCircle style={ORANGE} aria-hidden={true} />{item}</li>
      ))}
    </ul>
  );
}

/** Panel photos cover a 4:3 frame (569x427 on desktop), so a 16:10 photo renders ~684px wide. */
const PANEL_SIZES = "(max-width: 767px) 100vw, 684px";

/** Tab photo — the right-hand column of the two-column panel. */
function PanelImage({ src, alt }: { src: string; alt: string }) {
  return (
    <figure className="rd-panel-media">
      <img src={src} srcSet={srcSetFor(src)} sizes={PANEL_SIZES} alt={alt} loading="lazy" width={1024} height={768} decoding="async" />
    </figure>
  );
}

/** Offer bar under the two columns, repeated on every tab. No urgency widget here. */
function TabOfferCard() {
  return (
    <div className="rd-offer-bar">
      <div className="rd-badge-wrap">
        <div className="pb-container">
          <div className="pb-ribbon-wrap"><div className="pb-ribbon-body">ONLY</div></div>
          <div className="pb-circle">
            <div className="pb-price-old">{RETAIL_VALUE} VALUE</div>
            <div className="pb-price-new"><span className="pb-dollar">$</span>{PRICE_NUMBER}</div>
            <div className="pb-footer-text">Per Package</div>
          </div>
        </div>
      </div>
      <div className="rd-vdiv" aria-hidden="true"></div>
      <div className="rd-pkg">
        <p className="rd-pkg-title">{PACKAGE_NAME}</p>
        <ul className="rd-pkg-list">
          {TAB_CARD_BULLETS.map((bullet) => (
            <li key={bullet}><CheckCircle style={ORANGE} aria-hidden={true} />{bullet}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** One tab's body: copy column, photo, and the offer bar underneath both. */
function PanelBody({ tab, season }: { tab: TabKey; season: Season }) {
  switch (tab) {
    case "accom":
      return (
        <>
          <div className="rd-panel-grid">
            <div className="rd-panel-content">
              <h3 className="rd-panel-title" id={panelTitleId("accom")}>Accommodations</h3>
              <p className="rd-panel-intro">{TAB_ACCOM_INTRO}</p>
              <div className="rd-panel-header-bar"><p>{RESORT_UPPER}</p></div>
              <h4 className="rd-panel-subtitle">{ROOM_TYPE}</h4>
              <IconList items={ROOM_FEATURES} className="rd-feature-list" />
            </div>
            <PanelImage src="/images/massanutten/guestroom-king.webp" alt="Massanutten Resort hotel room with a king bed, desk, TV, and two windows" />
          </div>
          <TabOfferCard />
        </>
      );

    case "amenities":
      return (
        <>
          <div className="rd-panel-grid">
            <div className="rd-panel-content">
              <h3 className="rd-panel-title" id={panelTitleId("amenities")}>What&apos;s Included at the Resort</h3>
              <p className="rd-panel-intro">{TAB_AMENITIES_INTRO}</p>
              <IconList items={RESORT_AMENITIES} className="rd-feature-grid" />
            </div>
            <PanelImage src="/images/massanutten/indoor-waterpark-dome.webp" alt="Guests swimming and floating on tubes in the Massanutten indoor WaterPark under a glass dome" />
          </div>
          <TabOfferCard />
        </>
      );

    case "bonus":
      return (
        <>
          <div className="rd-panel-grid">
            <div className="rd-panel-content">
              <h3 className="rd-panel-title" id={panelTitleId("bonus")}>What&apos;s Included With Your Package</h3>
              <p className="rd-panel-intro">{TAB_BONUS_INTRO}</p>
              <IconList items={TAB_BONUS_ITEMS} className="rd-feature-list rd-feature-list--stack" />
            </div>
            <PanelImage src="/images/massanutten/ski-instructor-young-skier.webp" alt="Smiling ski instructor kneeling to talk with a young skier in a pink jacket" />
          </div>
          <TabOfferCard />
        </>
      );

    case "todo": {
      const holiday = showsHolidayEvents(season);
      return (
        <>
          <div className="rd-panel-grid">
            <div className="rd-panel-content">
              <h3 className="rd-panel-title" id={panelTitleId("todo")}>Nearby Attractions</h3>
              <p className="rd-panel-intro">{TAB_TODO_INTRO}</p>
              <IconList items={NEARBY_ATTRACTIONS} className="rd-feature-list" />

              <h4 className="rd-panel-subtitle rd-panel-subtitle--spaced">This Winter</h4>
              <CheckList items={holiday ? THIS_WINTER_HOLIDAY : THIS_WINTER_LATE} />
            </div>
            {holiday
              ? <PanelImage src="/images/massanutten/snowboarder-mountain-view.webp" alt="Snowboarder taking in snowy mountain views from the top of a Massanutten slope" />
              : <PanelImage src="/images/massanutten/snow-tubing-lane.webp" alt="Guests snow tubing down a Massanutten tubing lane" />}
          </div>
          <TabOfferCard />
        </>
      );
    }
  }
}

/** A tab panel wrapper + its body. `active` drives both the class and `hidden`. */
export function IncludedPanel({ tab, season, active }: { tab: TabKey; season: Season; active: boolean }) {
  return (
    <div
      className={active ? "rd-panel active" : "rd-panel"}
      id={panelId(tab)}
      role="tabpanel"
      aria-labelledby={tabId(tab)}
      hidden={!active}
    >
      <PanelBody tab={tab} season={season} />
    </div>
  );
}
