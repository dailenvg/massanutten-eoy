import type { CSSProperties } from "react";
import { CirclePlay } from "@/lib/icons";
import { HERO_IMAGES, type Season } from "@/lib/season";
import { RESERVE_URL } from "@/lib/site";
import { RESORT_VIDEO_SRC } from "@/lib/offer";
import HeroLockup from "./HeroLockup";
import OfferCard from "./OfferCard";
import PriceDrop from "./PriceDrop";
import HeroBonusBanner from "./HeroBonusBanner";
import HeroSeasonLayer from "./HeroSeasonLayer";
import BadgeFx from "./season-fx/BadgeFx";

/** Snowy mountain views behind the hero bonus banner ("MOUNTAIN Views"). */
const BONUS_BANNER_IMAGE = "/images/massanutten/snowboarder-mountain-view.webp";

/**
 * Component B — hero. V2 layout: lockup left, offer card right, bonus banner
 * under the lockup. Seasonal pieces are the badge above the lockup, the H1
 * (rendered visually hidden in page.tsx) and the urgency line in the card.
 */
export default function Hero({ season }: { season: Season }) {
  const heroImage = HERO_IMAGES[season.key];
  const heroStyle = {
    "--hero-image": `url('${heroImage.desktop}')`,
    "--hero-focus": heroImage.focus,
  } as CSSProperties;

  return (
    <div className="w-layout-blockcontainer hero w-container" data-season={season.key} style={heroStyle}>
      {/* React hoists these into <head>, so the active season's photo is preloaded from the server render. */}
      <link rel="preload" as="image" href={heroImage.desktop} media="(min-width: 768px)" fetchPriority="high" />
      <link rel="preload" as="image" href={heroImage.mobile} media="(max-width: 767px)" fetchPriority="high" />
      <HeroSeasonLayer season={season.key} placement="stage" />
      <div className="herocontainer">
        <div className="campaignlogoand-price">
          <div className="hero-mobile-stage">
            <picture className="hero-mobile-picture">
              <source media="(max-width: 767px)" srcSet={heroImage.mobile} type="image/webp" />
              <img className="hero-mobile-photo" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="" width="588" height="840" decoding="async" fetchPriority="high" />
            </picture>

            <div className="w-layout-vflex flex-block-6">
              <HeroSeasonLayer season={season.key} placement="column" />
              <div className="ob-group">
                <div className="ob-sticker">
                  <HeroLockup season={season} />
                  <BadgeFx season={season.key} />
                </div>

                <div className="ob-combo">
                  <div className="pb-container">
                    <div className="pb-ribbon-wrap">
                      <div className="pb-ribbon-body">ONLY</div>
                    </div>
                    <PriceDrop />
                  </div>
                </div>
              </div>

              {RESORT_VIDEO_SRC ? (
                <a data-video-id="1" href="#" aria-label="Play resort video" className="video-resort playvideo playvideo--icon w-inline-block">
                  <CirclePlay className="image-42" aria-hidden="true" style={{ color: "var(--accent-strong)", width: "34px", height: "34px" }} />
                </a>
              ) : null}

              <div className="cta-wrapper hero-cta-in-column">
                <div className="video-button-wrapper"></div>
                <a href={RESERVE_URL} className="checkout-cta w-button">
                  Reserve now
                </a>
              </div>
            </div>

            <div className="hero-sales-banner hero-sales-banner--in-hero">
              <HeroBonusBanner image={BONUS_BANNER_IMAGE} />
            </div>
          </div>
        </div>

        <div className="offerwidget">
          <OfferCard season={season} />
        </div>
      </div>
    </div>
  );
}
