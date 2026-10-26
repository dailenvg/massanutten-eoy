import { ICONS_BY_NAME, Check } from "@/lib/icons";
import type { Season } from "@/lib/season";
import { RESERVE_URL } from "@/lib/site";
import PhoneTrigger from "./PhoneTrigger";
import OfferPrice from "./OfferPrice";
import {
  HERO_PERKS,
  NIGHTS_LABEL_TIGHT,
  OFFER_CARD_HEADING,
  RESORT_LOGO,
  TRAVEL_LINE,
} from "@/lib/offer";

const ICON_STYLE = { color: "var(--accent-strong)", width: "22px", height: "22px" } as const;

/**
 * Hero offer card (V2 offer widget). Accents follow the site-wide season
 * tokens; the savings chip (sale name) and the urgency line carry the copy.
 */
export default function OfferCard({ season }: { season: Season }) {
  return (
    <div className="offerdetails">
      <div className="widgettitle">
        <img className="offer-card-logo" src={RESORT_LOGO.src} alt={RESORT_LOGO.alt} width={RESORT_LOGO.width} height={RESORT_LOGO.height} loading="eager" decoding="async" />
        <div className="titlestay">
          <div className="titleline"></div>
          <div className="widgettitlestay">{NIGHTS_LABEL_TIGHT}</div>
          <div className="titleline"></div>
        </div>
        <div className="resortname resort-name--centered">{OFFER_CARD_HEADING}</div>
      </div>

      <OfferPrice saleName={season.badge} percentOff />

      <ul className="includingslist">
        {HERO_PERKS.map(({ icon, text }) => {
          const Icon = ICONS_BY_NAME[icon] ?? Check;
          return (
            <li className="listitem" key={text}>
              <Icon className="checkicon feature-icon" aria-hidden="true" style={ICON_STYLE} />
              <div className="text-block-2">{text}</div>
            </li>
          );
        })}
      </ul>

      <div className="div-block-22">
        <a data-wf--button--variant="big" href={RESERVE_URL} className="checkout-cta w-button cta-button--primary-large">
          RESERVE ONLINE
        </a>
        <PhoneTrigger variant="card" />
      </div>

      <div className="booking-disclaimer">
        <p>{TRAVEL_LINE}</p>
        <p className="offer-urgency">{season.urgency}</p>
      </div>

      <div className="sealset trust-badges">
        <img loading="lazy" src="/images/badge-01.svg" alt="" className="widgetseal" />
        <img loading="lazy" src="/images/badge-02.svg" alt="" className="widgetseal" />
        <img loading="lazy" src="/images/shared/badge-03.webp" alt="" className="widgetseal" />
      </div>
    </div>
  );
}
