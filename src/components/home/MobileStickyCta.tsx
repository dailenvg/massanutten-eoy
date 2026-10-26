"use client";

import { useEffect, useState } from "react";
import { RESERVE_URL } from "@/lib/site";
import type { Season } from "@/lib/season";
import { NIGHTS_LABEL, PRICE, PRICE_UNIT, RETAIL_VALUE } from "@/lib/offer";
import PhoneTrigger from "./PhoneTrigger";

/**
 * Component C — bottom sticky offer bar on phones:
 * "$540 VALUE | <seasonal label> | $99 Per Package".
 * Slides in once the hero has scrolled out of view; only the label is seasonal.
 */
export default function MobileStickyCta({ season }: { season: Season }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.querySelector(".hero");
    if (!hero || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        setVisible(!entries[0].isIntersecting);
      },
      { threshold: 0 },
    );
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  return (
    <div className={"mobile-sticky-cta" + (visible ? " is-visible" : "")} inert={!visible}>
      <div className="msc-info">
        <div className="msc-badge">{RETAIL_VALUE}<br />VALUE</div>
        <div className="msc-info-left">
          <span className="msc-days">{NIGHTS_LABEL}</span>
          <span className="msc-pkg"><span>{season.stickyPkgLine1}</span><span>{season.stickyPkgLine2}</span></span>
        </div>
        <div className="msc-price">
          <span className="msc-amount">{PRICE}</span>
          <span className="msc-per">{PRICE_UNIT}</span>
        </div>
      </div>
      <div className="msc-actions">
        <PhoneTrigger variant="sticky" />
        <a href={RESERVE_URL} className="msc-cta">RESERVE ONLINE</a>
      </div>
    </div>
  );
}
