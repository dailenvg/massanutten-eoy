"use client";

import { useBooking } from "@/lib/booking-store";
import { PRICES, money } from "@/lib/booking";
import { FLOW } from "@/lib/site";
import UpsellStep from "./UpsellStep";

/**
 * Step 3: Extend Your Stay (Figma 1:2830). Spec: extra nights, $49 per night.
 * The comp adds "The regular price for this is over $135", but no regular
 * nightly rate exists in this offer's spec, so that comparison is left out.
 */
export default function StepExtend() {
  const { setAddon } = useBooking();
  const price = money(PRICES.extraNight);

  return (
    <UpsellStep
      title="Extend Your Stay"
      yesLabel={`Yes, extend my stay for only ${price}`}
      onYes={() => setAddon("extraNights", 1)}
      next={FLOW.tickets}
      sure={{
        body: "Want more time? Add extra nights for just $49/night and make it the vacation you will love even more.",
        question: "Extend your stay?",
        confirmLabel: "Extend stay",
      }}
    >
      <h2 className="up-sub">While in the Shenandoah Valley, consider extending your stay!</h2>
      <p className="up-text">Add a 4th night for just {price}.</p>
      <img className="up-photo" src="/images/massanutten/guestroom-king.webp" alt="Massanutten Resort hotel room with a king bed, desk, TV, and two windows" width={750} height={544} loading="lazy" decoding="async" />
    </UpsellStep>
  );
}
