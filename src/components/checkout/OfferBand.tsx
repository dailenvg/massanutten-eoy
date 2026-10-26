import { BedDouble, MapPin } from "@/lib/icons";
import {
  DESTINATION,
  NIGHTS_LABEL,
  PRICE,
  PRICE_UNIT,
  RESORT_NAME,
  ROOM_TYPE,
  TA_BUBBLES,
  TA_REVIEW_COUNT,
  VALUE_LINE,
} from "@/lib/offer";

const TA_BUBBLES_TOTAL = 5;

/**
 * Photo header above steps 1 and 2 (Figma "Frame 6288", 137:1923), laid out to
 * the supplied reference banner: headline and bullets on the left, the resort
 * credit and the price lockup bottom-right on a single baseline. Below ~900px
 * that pair wraps to its own row and stays side by side, as the mobile
 * reference shows.
 *
 * The retail value is still a placeholder, so the headline carries the offer
 * name and the value line shows the RETAIL_VALUE placeholder.
 */

export default function OfferBand() {
  return (
    <header className="ob">
      <img
        className="ob-bg"
        src="/images/massanutten/resort-lodge-snow.webp"
        alt=""
        width={1920}
        height={1046}
        fetchPriority="high"
        decoding="async"
      />
      <div className="ob-inner">
        <div className="ob-copy">
          <h1 className="ob-title">{DESTINATION} {NIGHTS_LABEL} | {RESORT_NAME}</h1>
          <ul className="ob-bullets">
            <li><MapPin aria-hidden={true} />{DESTINATION} {NIGHTS_LABEL}</li>
            <li><BedDouble aria-hidden={true} />Stay in a {ROOM_TYPE}</li>
          </ul>
        </div>
        <div className="ob-side">
          {/* Tripadvisor credit: owl, bubble rating, V2 review count. */}
          <div className="ob-resort">
            <span
              className="ob-ta"
              role="img"
              aria-label={`Tripadvisor rating: ${TA_BUBBLES} out of ${TA_BUBBLES_TOTAL} bubbles`}
            >
              <img
                className="ob-ta-logo"
                src="/images/shared/tripadvisor-owl-white.svg"
                alt=""
                width={29}
                height={19}
                loading="lazy"
                decoding="async"
              />
              <span className="ob-ta-bubbles">
                {Array.from({ length: TA_BUBBLES_TOTAL }, (_, i) => (
                  <img
                    key={i}
                    className="ob-ta-bubble"
                    src={i < TA_BUBBLES ? "/images/shared/ta-bubble-fill.svg" : "/images/shared/ta-bubble-empty.svg"}
                    alt=""
                    width={20}
                    height={20}
                    loading="lazy"
                    decoding="async"
                  />
                ))}
              </span>
            </span>
            <span className="ob-resort-addr">{TA_REVIEW_COUNT}</span>
          </div>
          <div className="ob-price">
            <span className="ob-amount">{PRICE}</span>
            <span className="ob-per">{PRICE_UNIT}</span>
            <span className="ob-normal">{VALUE_LINE}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
