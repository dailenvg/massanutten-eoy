import { ICONS_BY_NAME, Check, Play } from "@/lib/icons";
import { showsHolidayEvents, type Season } from "@/lib/season";
import { RESERVE_URL } from "@/lib/site";
import { srcSetFor } from "@/lib/image-variants";
import OfferPrice from "./OfferPrice";
import {
  DESTINATION_HEADING,
  DESTINATION_PARAGRAPH_HOLIDAY,
  DESTINATION_PARAGRAPH_LATE,
  HERO_PERKS,
  RESORT_SHORT,
  RESORT_VIDEO_SRC,
  TRAVEL_LINE,
} from "@/lib/offer";

const ICON_STYLE = { color: "var(--accent-strong)" } as const;

/**
 * Component G — destination "Stay 3-Nights". Copy left with the offer card
 * content (value, price, perks, urgency), V2 resort video right (the photo
 * alone while RESORT_VIDEO_SRC is unset).
 */
export default function ResortDetails({ season }: { season: Season }) {
  const paragraph = showsHolidayEvents(season) ? DESTINATION_PARAGRAPH_HOLIDAY : DESTINATION_PARAGRAPH_LATE;

  return (
    <section id="resort-details">
      <div className="hs-left">
        <div className="hs-left-inner">
          <h2 className="hs-headline">{DESTINATION_HEADING}</h2>

          <p className="hs-body">{paragraph}</p>

          <div className="hs-price-group">
            <OfferPrice saleName={season.badge} percentOff />

            <ul className="hs-includes">
              {HERO_PERKS.map(({ icon, text }) => {
                const Icon = ICONS_BY_NAME[icon] ?? Check;
                return <li className="hs-item" key={text}><Icon style={ICON_STYLE} aria-hidden="true" />{text}</li>;
              })}
            </ul>
          </div>

          <a href={RESERVE_URL} className="hs-cta">Reserve Now</a>

          <p className="hs-trust">{TRAVEL_LINE}<br />{season.urgency}</p>
        </div>
      </div>

      <div className="hs-right">
        <img src="/images/massanutten/snow-tubing-lane.webp" srcSet={srcSetFor("/images/massanutten/snow-tubing-lane.webp")} sizes="(max-width: 767px) 100vw, 50vw" alt="Guests snow tubing down a Massanutten tubing lane" width="1024" height="768" loading="lazy" decoding="async" />
        {RESORT_VIDEO_SRC ? (
          <a href="#" className="hs-video playvideo" aria-label={`Play ${RESORT_SHORT} resort video`}>
            <span className="hs-play"><Play aria-hidden="true" style={{ color: "currentColor", fill: "currentColor", width: "38px", height: "38px" }} /></span>
          </a>
        ) : null}
      </div>
    </section>
  );
}
