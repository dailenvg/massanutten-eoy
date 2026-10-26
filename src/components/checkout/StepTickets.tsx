"use client";

import { Check } from "@/lib/icons";
import { useBooking } from "@/lib/booking-store";
import { PRICES, priceLabel } from "@/lib/booking";
import { TICKETS_NAME } from "@/lib/offer";
import { FLOW } from "@/lib/site";
import UpsellStep from "./UpsellStep";

/**
 * Step 4: tickets. Reference behaviour (Add toggles to Remove, Continue
 * lights up once added). The reference product was destination-specific, and
 * no Massanutten ticket product is specified, so name and price render the
 * placeholders from lib/offer and the total adds $0 until confirmed.
 */
export default function StepTickets() {
  const { booking, setAddon } = useBooking();
  const added = booking.addons.tickets;
  const price = priceLabel(PRICES.tickets);

  return (
    <UpsellStep
      title={`Add ${TICKETS_NAME}`}
      yesLabel={added ? "Continue" : `Add for ${price}`}
      onYes={() => setAddon("tickets", true)}
      toggle={{
        added,
        addLabel: `Add for ${price}`,
        removeLabel: `Remove ${price}`,
        onToggle: (next) => setAddon("tickets", next),
      }}
      next={FLOW.extraVacation}
      sure={{
        body: `${TICKETS_NAME} for ${price}.`,
        question: `So, do you want to add ${TICKETS_NAME}?`,
        confirmLabel: "Yes, I want to add tickets",
      }}
    >
      <p className="up-text"><strong className="tk-offer">{TICKETS_NAME}: {price}</strong></p>

      <div className="tk-actions">
        {added ? (
          <>
            <span className="tk-added"><Check className="ic-inline" aria-hidden={true} />Added</span>
            <button type="button" className="fbtn fbtn--dark" onClick={() => setAddon("tickets", false)}>Remove {price}</button>
          </>
        ) : (
          <button type="button" className="fbtn fbtn--primary" onClick={() => setAddon("tickets", true)}>Add for {price}</button>
        )}
      </div>
    </UpsellStep>
  );
}
