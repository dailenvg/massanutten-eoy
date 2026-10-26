import { RESERVE_URL } from "@/lib/site";
import { CheckCircle, SealCheck, Star } from "@/lib/icons";
import {
  HERO_PERKS,
  PRICE,
  PRICE_UNIT,
  RESORT_NAME,
  REVIEWS,
  TA_BUBBLES,
  TA_PURCHASED_LINE,
  TA_REVIEW_COUNT,
  VALUE_LINE,
} from "@/lib/offer";
import { srcSetFor } from "@/lib/image-variants";

/** Slides cover a short, wide frame: phones crop to ~1.24x the width, desktop renders ~625px wide. */
const SLIDE_SIZES = "(max-width: 767px) 124vw, (max-width: 1023px) calc(100vw - 64px), 625px";

/**
 * Photos behind the review cards (decorative). Slots 1-3 are the source page's
 * review photos; the slideshow timing is built for five, so slots 4-5 reuse
 * two other source photos.
 */
const SLIDES = [
  "/images/massanutten/suite-fireplace.webp",
  "/images/massanutten/indoor-waterpark.webp",
  "/images/massanutten/guestroom-two-beds.webp",
  "/images/massanutten/resort-lodge-snow.webp",
  "/images/massanutten/snow-tubing-lane.webp",
] as const;

/**
 * Component J — Guest Reviews. Reference structure; the Tripadvisor rating,
 * review count, purchase line and three quotes are from the Massanutten source page.
 */
export default function GuestReviews() {
  return (
    <section id="guest-reviews">
      <div className="gr-header">
        <h2 className="gr-title">Guest Reviews</h2>
      </div>

      <div className="ta-summary">
        <div className="ta-band-offer">
          <h3 className="ta-band-headline">{RESORT_NAME}</h3>
          <ul className="ta-band-bullets">
            {HERO_PERKS.map(({ text: bullet }) => (
              <li className="ta-band-bullet" key={bullet}>
                <CheckCircle className="ta-band-check" aria-hidden="true" />
                {bullet}
              </li>
            ))}
          </ul>
        </div>

        <div className="ta-band-proof">
          <div className="ta-band-rating-row">
            <img className="ta-summary-logo" src="/images/shared/tripadvisor-logo.webp" alt="Tripadvisor" loading="lazy" />
            <span
              className="ta-bubbles"
              role="img"
              aria-label={`Rated ${TA_BUBBLES} out of 5 on Tripadvisor`}
            >
              {Array.from({ length: 5 }, (_, i) => (
                <img
                  className="ta-bubble"
                  key={i}
                  src={i < Math.floor(TA_BUBBLES) ? "/images/shared/ta-bubble-fill.svg" : "/images/shared/ta-bubble-empty.svg"}
                  alt=""
                  width={20}
                  height={20}
                  loading="lazy"
                />
              ))}
            </span>
          </div>
          <p className="ta-summary-reviews">{TA_REVIEW_COUNT}</p>
          <p className="ta-summary-purchased">{TA_PURCHASED_LINE}</p>
        </div>

        <div className="ta-band-price">
          <p className="ta-band-amount">{PRICE}</p>
          <p className="ta-band-unit">{PRICE_UNIT}</p>
          <p className="ta-band-rate">{VALUE_LINE}</p>
        </div>
      </div>

      <div className="gr-body">
        <div className="gr-reviews-row">
          <div className="gr-slideshow" aria-hidden="true">
            {SLIDES.map((src) => <img className="gr-slide" key={src} src={src} srcSet={srcSetFor(src)} sizes={SLIDE_SIZES} alt="" loading="lazy" />)}
          </div>

          <div className="gr-cards">
            {REVIEWS.map((review) => (
              <div className="gr-card" key={review.name}>
                <p className="gr-card-name">{review.name}</p>
                <p className="gr-verified">
                  <SealCheck aria-hidden="true" />
                  Verified Guest
                </p>
                <p className="gr-card-text">&ldquo;{review.quote}&rdquo;</p>
                <div className="gr-stars" role="img" aria-label={`Rated ${review.stars} out of 5`}>
                  {Array.from({ length: review.stars }, (_, i) => (
                    <Star key={i} aria-hidden="true" />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <a href={RESERVE_URL} className="gr-cta">Reserve Now</a>
        </div>
      </div>
    </section>
  );
}
